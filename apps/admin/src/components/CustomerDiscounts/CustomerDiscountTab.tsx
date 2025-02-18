import { Button } from "flowbite-react";
import { useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomerDiscountsModal from "./CustomerDiscountModal";
import { CustomerDiscountType } from "@repo/ui/enums/customerDiscount";
import { ICustomerDiscount } from "@repo/ui/types/customerDiscount";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getPermissions } from "@repo/ui/lib/permission";
import { Features, Modules } from "@repo/ui/enums/permission";
import { fetchDeleteCustomerDiscount } from "../../app/feature/customerDiscountSlice";
import { MdDeleteOutline } from "react-icons/md";

interface IProps {
  type: CustomerDiscountType;
}

const CustomerDiscountTab: React.FC<IProps> = ({ type }) => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [, setSelectedDiscount] = useState<ICustomerDiscount | null>(null);
  const customerDiscounts = useAppSelector(
    (state) => state.customerDiscounts.discounts,
  );

  const rolePermissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const discounts = useMemo(() => {
    return customerDiscounts.filter((discount) => discount.type === type);
  }, [customerDiscounts, type]);

  const permissions = getPermissions(
    Modules.Brand,
    Features.Brand,
    rolePermissions,
  );

  const columns: TableColumn<ICustomerDiscount>[] = useMemo(() => {
    const cols: TableColumn<ICustomerDiscount>[] = [
      {
        name: "Name",
        selector: (row) => row.item_group?.name || "-",
        wrap: true,
      },
    ];

    if (type === CustomerDiscountType.PRODUCT) {
      cols.push({
        name: "Name",
        selector: (row) => row.product?.name || "-",
        wrap: true,
      });
    }

    cols.push(
      { name: "Discount 1", selector: (row) => `${row.discount_1}%` },
      { name: "Discount 2", selector: (row) => `${row.discount_2}` },
      { name: "Discount 3", selector: (row) => `${row.discount_3}%` },
      { name: "Comment", selector: (row) => row.comment },
    );

    if (permissions.create || permissions.update || permissions.delete) {
      cols.push({
        name: "Action",
        cell: (row) => (
          <div className="flex gap-2">
            {permissions.delete && (
              <MdDeleteOutline
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  dispatch(fetchDeleteCustomerDiscount(String(row._id)));
                }}
              />
            )}
          </div>
        ),
      });
    }

    return cols;
  }, [
    dispatch,
    type,
    permissions.create,
    permissions.update,
    permissions.delete,
  ]);

  const handleAddDiscountClick = () => {
    setSelectedDiscount(null);
    setShowModal(true);
  };

  const actionsMemo = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <div className="flex gap-2  ">
          <Button size="sm" pill onClick={() => handleAddDiscountClick()}>
            Add Discount
          </Button>
        </div>
      </div>
    ),
    [],
  );

  return (
    <>
      <div className="whitespace-nowrap custom-data-table">
        <DataTable
          title="Item Group Discounts"
          columns={columns}
          actions={actionsMemo}
          data={discounts}
          // progressPending={loading}
          // progressComponent={<Loader />}
          pagination={true}
        />
      </div>
      <CustomerDiscountsModal
        type={type}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default CustomerDiscountTab;
