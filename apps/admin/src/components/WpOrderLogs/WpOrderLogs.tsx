import React, { useEffect } from "react";
import { useState } from "react";
import {
  Accordion,
  Card,
  Datepicker,
  Pagination,
  TextInput,
} from "flowbite-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IOrderDispatchItem } from "@repo/ui/types/orderDispatch";
import moment from "moment";
import { getAssetUrl } from "../../lib/asset";
import { UploadType } from "@repo/ui/enums/upload";
import config from "../../config";
import { fetchWpOrderLogs } from "../../app/feature/orderDispatchSlice";
import { dashboardRoutes } from "@repo/ui/lib/constants";
import { Link } from "react-router-dom";

const WpOrderLogs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { docs, limit, totalPages } = useAppSelector(
    (state) => state.dispatches.logs,
  );

  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date>();

  // const [filterDispatch, setFilterDispatch] = useState(logs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchWpOrderLogs({ page: currentPage, limit, search, date }));
  }, [dispatch, search, currentPage, limit, date]);

  const columns: TableColumn<IOrderDispatchItem>[] = [
    { name: "Code", selector: (row) => row.code, sortable: true },
    { name: "Color", selector: (row) => row.color, sortable: true },
    { name: "Size", selector: (row) => row.size, sortable: true },
    {
      name: "Dispatch Qty",
      selector: (row) => row.dispatch_qty,
      sortable: true,
    },
  ];

  return (
    <>
      <Card className="mb-3">
        <div className="card-title">
          <p className="text-[#000] mb-3 text-capitalize font-bold">
            Dispatch Logs
          </p>
          <p className=" font-normal text-[#76838f] text-[0.875rem] mb-3">
            List of Dispatches
          </p>
          <TextInput
            type="search by Dispatch ID or Date"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="mb-4"
          />
          <Datepicker
            onChange={(date) => (date ? setDate(date) : setDate(undefined))}
            value={date}
          />
        </div>
      </Card>
      <div className="overflow-x-auto">
        <Accordion collapseAll className="border-none">
          {docs.map((dispatch) => (
            <Accordion.Panel key={dispatch._id}>
              <Card className="mb-3">
                <Accordion.Title>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div>
                      <p>
                        <strong>Customer Name:</strong>{" "}
                        {dispatch.order.shop_name ?? "N/A"}
                      </p>
                      <p>
                        <strong>Number Of Pairs:</strong>{" "}
                        {dispatch.items.reduce(
                          (total, item) => total + item.dispatch_qty,
                          0,
                        )}
                      </p>
                      <p>
                        <strong>Dispatch ID:</strong> {dispatch.dispatch_id}
                      </p>
                      <p>
                        <strong>Dispatch Date:</strong>{" "}
                        {moment(dispatch.created_at).format(config.date.format)}
                      </p>
                      {dispatch.image ? (
                        <img
                          className="w-full md:w-32 h-auto rounded-md mt-2 md:mt-0"
                          src={getAssetUrl(UploadType.dispatch, dispatch.image)}
                          alt="Dispatch Image"
                          width="50%"
                        />
                      ) : null}
                    </div>
                  </div>
                </Accordion.Title>
                <div>
                  <Accordion.Content>
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold mb-2">
                          Dispatched Items
                        </h2>
                        <Link
                          to={dashboardRoutes.order.dispatch.details.replace(
                            ":id",
                            dispatch._id ?? "",
                          )}
                          className="bg-[#0071AB] px-3 py-1 text-white rounded-full mb-4"
                        >
                          Invoice
                        </Link>
                      </div>
                      <DataTable
                        columns={columns}
                        data={dispatch.items}
                        highlightOnHover
                        pointerOnHover
                      />
                    </div>
                  </Accordion.Content>
                </div>
              </Card>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex overflow-x-auto sm:justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons={true}
          />
        </div>
      )}
    </>
  );
};

export default WpOrderLogs;
