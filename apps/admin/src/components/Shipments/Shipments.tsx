import { useEffect, useState } from "react";
import { Card, TextInput } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchDispatchesToShip } from "../../app/feature/shipmentSlice";
import moment from "moment";
import config from "../../config";
import ShipmentDispatch from "./ShipmentDispatch";
import Loader from "../common/Loader/Loader";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";

const Shipments = () => {
  const dispatch = useAppDispatch();
  const { dispatches, loading } = useAppSelector((state) => state.shipments);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<IOrderDispatch[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const entitiesPerPage = 10;

  useEffect(() => {
    dispatch(fetchDispatchesToShip());
  }, []);

  // Search filtering
  useEffect(() => {
    const searchData = dispatches.filter((dispatch) => {
      const formattedDate = moment(dispatch.order.created_at).format(
        config.date.format,
      );
      return (
        dispatch.order.shop_name.toLowerCase().includes(search.toLowerCase()) ||
        dispatch.order.order_id.toLowerCase().includes(search.toLowerCase()) ||
        dispatch.dispatch_id.toLowerCase().includes(search.toLowerCase()) ||
        formattedDate.includes(search)
      );
    });
    setFilteredData(searchData);
  }, [search, dispatches]);

  // Calculate current orders for the current page
  // const indexOfLastData = currentPage * entitiesPerPage;
  // const indexOfFirstData = indexOfLastData - entitiesPerPage;
  // const currentOrders = filteredData.slice(indexOfFirstData, indexOfLastData);

  // Calculate total number of pages
  // const totalPages = Math.ceil(filteredData.length / entitiesPerPage);

  // Handle page change
  // const onPageChange = (page: number) => setCurrentPage(page);

  if (loading) return <Loader />;

  return (
    <>
      <Card className="mb-3">
        <div className="card-title">
          <p className="text-[#000] mb-3 text-capitalize font-bold">
            Shipments
          </p>
          <p className=" font-normal text-[#76838f] text-[0.875rem] mb-3">
            List of Shipments
          </p>
          <TextInput
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // setCurrentPage(1);
            }}
            className="mb-4"
          />
        </div>
      </Card>

      {Array.isArray(filteredData) &&
        filteredData.map((dispatch) => (
          <ShipmentDispatch
            key={dispatch.dispatch_id}
            orderDispatch={dispatch}
          />
        ))}

      {/* Pagination Controls */}
      {/* {dispatches.length > entitiesPerPage && (
        <div className="flex overflow-x-auto sm:justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons={true}
          />
        </div>
      )} */}
    </>
  );
};

export default Shipments;
