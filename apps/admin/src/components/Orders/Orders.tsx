import { useAppSelector } from "../../app/hooks";
import OrderCards from "./OrderCards";
import OrderTable from "./OrderTable";
import { UserType } from "@repo/ui/enums/user";
import WarehouseWiseDependency from "./WarehouseWiseDependency";

const Orders = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.type === UserType.SUPERADMIN) {
    return (
      <>
        <WarehouseWiseDependency />
        <OrderTable />
      </>
    );
  } else if (user?.type === UserType.PACKAGER) {
    return <OrderCards />;
  } else if (user?.type === UserType.WAREHOUSEMANAGER) {
    return <OrderCards />;
  }
};

export default Orders;
