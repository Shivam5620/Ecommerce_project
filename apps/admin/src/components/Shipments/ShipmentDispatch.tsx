import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import moment from "moment";
import React, { useState } from "react";
import config from "../../config";
import { Button, Card, Spinner } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchShipDispatch } from "../../app/feature/shipmentSlice";
import {
  Modules,
  Features,
  AllowedPermission,
} from "@repo/ui/enums/permission";
import { hasPermission } from "@repo/ui/lib/permission";

interface IProps {
  orderDispatch: IOrderDispatch;
}

const ShipmentDispatch: React.FC<IProps> = ({ orderDispatch }) => {
  const loading = useAppSelector((state) => state.shipments.loading);
  const dispatch = useAppDispatch();

  const [cartons, setCartons] = useState(orderDispatch.cartons ?? 0);
  const [open_boxes, setOpenBoxes] = useState(orderDispatch.open_boxes ?? 0);
  const permissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const createPermission = hasPermission(
    Modules.Shipment,
    Features.Shipment,
    AllowedPermission.CREATE,
    permissions,
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Shipment Dispatch");
    dispatch(
      fetchShipDispatch({
        id: String(orderDispatch._id),
        data: { cartons, open_boxes },
      }),
    );
  };

  return (
    <Card className="mb-3">
      <form onSubmit={handleSubmit} className="mb-3">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {orderDispatch.order.shop_name}
        </h5>
        <h5 className="text-black">
          Order ID : {orderDispatch.order.order_id}
        </h5>
        <h5 className="text-black">
          Order Date:{" "}
          {moment(orderDispatch.order.created_at).format(config.date.format)}
        </h5>
        <h5 className="text-lg block">
          Dispatch ID: {orderDispatch.dispatch_id}
        </h5>
        <h5 className="text-lg">
          Dispatch Date:{" "}
          {moment(orderDispatch.created_at).format(config.date.format)}
        </h5>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <div className="grid gap-3">
            <label>Cartons</label>
            <Button.Group outline>
              <Button
                onClick={() => {
                  if (cartons === 0) return;
                  setCartons((prev) => prev - 1);
                }}
              >
                -
              </Button>
              <Button color="gray">{cartons}</Button>
              <Button onClick={() => setCartons((prev) => prev + 1)}>+</Button>
            </Button.Group>
          </div>

          {/* Open Boxes */}
          <div className="grid gap-3">
            <label htmlFor="">Open Boxes</label>
            <Button.Group outline>
              <Button
                onClick={() => {
                  if (open_boxes === 0) return;
                  setOpenBoxes((prev) => prev - 1);
                }}
              >
                -
              </Button>
              <Button color="gray">{open_boxes}</Button>
              <Button onClick={() => setOpenBoxes((prev) => prev + 1)}>
                +
              </Button>
            </Button.Group>
          </div>
          <div className="col-start-1 col-end-3 pt-5">
            {createPermission && (
              <Button
                type="submit"
                className="w-full rounded-full text-center text-white p-1"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Create Shipment"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ShipmentDispatch;
