import { Card, Checkbox, Label, FileInput } from "flowbite-react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import moment from "moment";
import config from "../../config";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import {
  AllowedPermission,
  Modules,
  Features,
} from "@repo/ui/enums/permission";
import { hasPermission } from "@repo/ui/lib/permission";
import {
  fetchAddOrderLoad,
  fetchDispatchesToLoad,
} from "../../app/feature/orderLoadSlice";
import { fetchLoadings } from "../../app/feature/loadingSlice";
import Loader from "../common/Loader/Loader";
import { useNavigate } from "react-router";
import { dashboardRoutes } from "@repo/ui/lib/constants";

const Load = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { dispatches, loading } = useAppSelector((state) => state.orderLoads);
  const loadings = useAppSelector((state) => state.loadings.loadings);
  const [selectedDispatches, setSelectedDispatches] = useState<
    IOrderDispatch[]
  >([]);
  const permissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const createPermission = hasPermission(
    Modules.Order,
    Features.OrderLoad,
    AllowedPermission.CREATE,
    permissions,
  );

  useEffect(() => {
    dispatch(fetchLoadings());
    dispatch(fetchDispatchesToLoad());
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const newOrderLoad = new FormData(e.currentTarget);
    selectedDispatches.forEach((dispatch, index) => {
      newOrderLoad.set(`dispatch_ids[${index}]`, String(dispatch._id));
    });
    dispatch(fetchAddOrderLoad(newOrderLoad))
      .unwrap()
      .then((res) => {
        if (res.status) {
          navigate(
            dashboardRoutes.order.invoices +
              `?invoice_ids=${selectedDispatches.map((dispatch) => dispatch.dispatch_id).join(",")}`,
          );
        }
      });
  };

  if (loading) return <Loader />;

  console.log(
    dispatches
      .map((dispatch, index) => `dispatch_ids[${index}]:${dispatch._id}\n`)
      .join(""),
  );

  return (
    <>
      <Card className="mb-3">
        <div className="card-title">
          <p className="text-[#000] mb-3 text-capitalize font-bold">
            Loading Details
          </p>
          <p className="font-normal text-[#76838f] text-[0.875rem] mb-3">
            Load Shipments here
          </p>
        </div>
      </Card>
      <form
        encType="multipart/form-data"
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {dispatches.map((dispatch) => (
              <div key={dispatch.dispatch_id}>
                <div className="flex gap-2 border-b pb-3" key={dispatch._id}>
                  <Checkbox
                    id={`dispatch-${dispatch._id}`}
                    onChange={(e) => {
                      const { checked } = e.target;

                      if (checked) {
                        setSelectedDispatches([
                          ...selectedDispatches,
                          dispatch,
                        ]);
                      } else {
                        setSelectedDispatches(
                          selectedDispatches.filter(
                            (d) => d._id !== dispatch._id,
                          ),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`dispatch-${dispatch._id}`}>
                    <h5>Order ID: {dispatch.order.order_id}</h5>
                    <h5>Shop Name: {dispatch.order.shop_name}</h5>
                    <h5>Shipments ID: {dispatch.dispatch_id}</h5>
                    <h5>
                      Shipments Date:{" "}
                      {moment(dispatch.created_at).format(config.date.format)}
                    </h5>
                    <h5>Cartons: {dispatch.cartons}</h5>
                    <h5>Open Boxes: {dispatch.open_boxes}</h5>
                  </Label>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="LoadingId" value="Loading" />
            </div>
            <Select
              id="LoadingId"
              name="loading_id"
              options={loadings.map((loading) => ({
                value: loading._id,
                label: `${loading.loading_id} (${loading.driver_name}) (${loading.vehicle_number})`,
              }))}
              required
            />
          </div>
          <div className="mb-2">
            <div>
              <Label htmlFor="small-file-upload" value="Image" />
            </div>
            <FileInput
              name="image"
              id="small-file-upload"
              sizing="sm"
              required
              accept="image/*"
              capture="environment"
            />
          </div>
          <div>
            <h5>Total Shipments: {selectedDispatches.length}</h5>
            <h5>
              Total Cartons:{" "}
              {selectedDispatches.reduce(
                (sum, dispatch) => sum + dispatch.cartons,
                0,
              )}
            </h5>
            <h5>
              Total Open Boxes:{" "}
              {selectedDispatches.reduce(
                (sum, dispatch) => sum + dispatch.open_boxes,
                0,
              )}
            </h5>
          </div>
          {createPermission && (
            <button
              className="w-full rounded-full bg-[#0071AB] text-center text-white p-1"
              type="submit"
            >
              Save
            </button>
          )}
        </Card>
      </form>
    </>
  );
};

export default Load;
