import { IBrand } from "@repo/ui/types/brand";
import DataTable, { TableColumn } from "react-data-table-component";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAllBrands, fetchDeleteBrand } from "../../app/feature/brandSlice";
import { Button, Card, TextInput } from "flowbite-react";
import { ExcelHeader, generateExcel } from "../../lib/excel";
import { MdDeleteOutline } from "react-icons/md";
import BrandModal from "./BrandModal";
import { getAssetUrl } from "../../lib/asset";
import { Modules, Features } from "@repo/ui/enums/permission";
import { getPermissions } from "@repo/ui/lib/permission";
import { UploadType } from "@repo/ui/enums/upload";
import Loader from "../common/Loader/Loader";

const Brands = () => {
  const dispatch = useAppDispatch();
  const { brands, loading } = useAppSelector((state) => state.brands);

  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState<IBrand[]>(brands);
  const rolePermissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const permissions = getPermissions(
    Modules.Brand,
    Features.Brand,
    rolePermissions,
  );

  const columns: TableColumn<IBrand>[] = [
    {
      name: "#",
      selector: (_, rowIndex) =>
        String(rowIndex !== undefined ? rowIndex + 1 : "-"),
    },
    { name: "Name", selector: (row) => row.name },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={getAssetUrl(UploadType.brand, row.image)}
          alt={row.name}
          className="w-[36px] h-[36px] rounded-full"
        />
      ),
    },
    // { name: "Target Link", selector: (row) => row.target_link },
    // { name: "Status", selector: (row) => row.status },
  ];

  if (permissions.delete) {
    columns.push({
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2 justify-center items-center">
          {permissions.delete && (
            <MdDeleteOutline
              className="text-red-500 cursor-pointer"
              onClick={() => {
                dispatch(fetchDeleteBrand(String(row._id)));
              }}
            />
          )}
        </div>
      ),
    });
  }

  useEffect(() => {
    dispatch(fetchAllBrands());
  }, []);

  useEffect(() => {
    const searchData = search
      ? brands.filter((brand) => {
          const lowercasedSearch = search.toLowerCase();
          return (
            brand.name && brand.name.toLowerCase().includes(lowercasedSearch)
          );
        })
      : brands;
    setFilteredBrands(searchData);
    console.log(searchData);
  }, [search, brands]);

  const handleAddBrandClick = () => {
    setShowModal(true);
  };

  const actionsMemo = useMemo(() => {
    const handleExportCSV = () => {
      if (brands.length > 0) {
        const link = document.createElement("a");
        const csvHeaders: ExcelHeader[] = [
          { label: "Name", key: "name" },
          { label: "Image", key: "image" },
          { label: "Target Link", key: "target_link" },
          { label: "Status", key: "status" },
        ];
        let csv = generateExcel(csvHeaders, brands);
        if (csv == null) return;

        const filename = "brands_export.csv";

        if (!csv?.match(/^data:text\/csv/i)) {
          csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", filename);
        link.click();
      } else {
        console.log("No brands available for export");
      }
    };

    return (
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {permissions.create && (
            <Button size="sm" pill onClick={() => handleAddBrandClick()}>
              Add Brand
            </Button>
          )}
          <Button color="purple" size="sm" pill onClick={handleExportCSV}>
            Export Brands
          </Button>
          <TextInput
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    );
  }, [brands, search]);

  return (
    <Card>
      <div className="card-body">
        {/* Table Start  */}
        <div className="whitespace-nowrap custom-data-table">
          <DataTable
            title="Brands"
            columns={columns}
            actions={actionsMemo}
            data={filteredBrands}
            progressPending={loading}
            progressComponent={<Loader />}
            pagination={true}
          />
        </div>
        {/* Table End  */}
      </div>
      {permissions.create && (
        <BrandModal
          show={showModal}
          // brand={selectedBrand}
          onClose={() => setShowModal(false)}
        />
      )}
    </Card>
  );
};

export default Brands;
