import { Button, Card, Tabs } from "flowbite-react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  fetchAllItemGroups,
  fetchImportItemGroups,
} from "../../app/feature/itemGroupSlice";
import { fetchProducts } from "../../app/feature/productSlice";
import { fetchCustomerDiscounts } from "../../app/feature/customerDiscountSlice";
import { CustomerDiscountType } from "@repo/ui/enums/customerDiscount";
import CustomerDiscountTab from "./CustomerDiscountTab";

const Discounts = () => {
  const { code } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllItemGroups());
    dispatch(fetchProducts({}));
  }, []);

  useEffect(() => {
    if (code && code.length) {
      dispatch(fetchCustomerDiscounts({ customer_code: code }));
    }
  }, [code]);

  return (
    <Card>
      <div className="card-body">
        <div className="flex justify-end gap-2">
          <Button
            pill
            size="sm"
            onClick={() => {
              dispatch(fetchImportItemGroups()).then(() => {
                dispatch(fetchAllItemGroups());
              });
            }}
          >
            Import Item Groups
          </Button>
        </div>
        <Tabs aria-label="Default tabs" variant="default">
          {Object.values(CustomerDiscountType).map((type) => (
            <Tabs.Item title={type.replace("_", " ")}>
              <CustomerDiscountTab type={type} />
            </Tabs.Item>
          ))}
        </Tabs>
      </div>
    </Card>
  );
};

export default Discounts;
