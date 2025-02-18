import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/common/Layout/Layout";
import { dashboardRoutes } from "@repo/ui/lib/constants";
import Dashboard from "./components/Dashboard/Dashboard";
import Products from "./components/Products/Products";
import Orders from "./components/Orders/Orders";
import Brands from "./components/Brands/Brands";
import Users from "./components/Users/Users";
import Customers from "./components/Customers/Customers";
import Profile from "./components/Profile/Profile";
import Login from "./components/Login/Login";
import Role from "./components/Role/Role";
import "flowbite";

import OrderLoad from "./components/OrderLoad/OrderLoad";
import { ToastContainer } from "react-toastify";
import EditOrders from "./components/Orders/EditOrder/EditOrder";
import Shipments from "./components/Shipments/Shipments";
import SingleOrderLog from "./components/Orders/OrderLogs/SingleOrderLog";
import MaterialCenter from "./components/MaterialCenter/MaterialCenter";
import WpOrderLogs from "./components/WpOrderLogs/WpOrderLogs";
import Bilty from "./components/Bilty/Bilty";
import Loadings from "./components/Loadings/Loadings";
import OrderDetails from "./components/Orders/OrderDetails/OrderDetails";
import CustomerDiscounts from "./components/CustomerDiscounts/CustomerDiscounts";
import CustomerBillSundries from "./components/CustomerBillSundries/CustomerBillSundries";
import OrderDispatchDetails from "./components/Orders/OrderDispatchDetails/OrderDispatchDetails";
import CustomerBeats from "./components/CustomerBeats/CustomerBeats";
import CashReceipts from "./components/CashReceipts/CashReceipts";
import CustomerBeatSchedule from "./components/CustomerBeatSchedules/CustomerBeatSchedule";
import OrderInvoices from "./components/Orders/OrderDetails/OrderInvoices";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route
            path={dashboardRoutes.index}
            element={<Navigate to={dashboardRoutes.login} />}
          />
          <Route path={dashboardRoutes.login} element={<Login />} />
          <Route path={dashboardRoutes.index} element={<Layout />}>
            <Route path={dashboardRoutes.dashboard} element={<Dashboard />} />
            <Route
              path={dashboardRoutes.product.index}
              element={<Products />}
            />
            <Route
              path={dashboardRoutes.order.details}
              element={<OrderDetails />}
            />
            <Route path={dashboardRoutes.order.index} element={<Orders />} />
            <Route path={dashboardRoutes.order.edit} element={<EditOrders />} />
            <Route
              path={dashboardRoutes.order.log}
              element={<SingleOrderLog />}
            />
            <Route
              path={dashboardRoutes.shipment.index}
              element={<Shipments />}
            />
            <Route
              path={dashboardRoutes.loading.index}
              element={<Loadings />}
            />
            <Route
              path={dashboardRoutes.orderLoad.index}
              element={<OrderLoad />}
            />
            <Route path={dashboardRoutes.brand.index} element={<Brands />} />
            <Route path={dashboardRoutes.user.index} element={<Users />} />
            <Route
              path={dashboardRoutes.customer.index}
              element={<Customers />}
            />
            <Route path={dashboardRoutes.profile.index} element={<Profile />} />
            <Route path={dashboardRoutes.bilty.index} element={<Bilty />} />
            <Route path={dashboardRoutes.role.index} element={<Role />} />
            <Route
              path={dashboardRoutes.customer.discounts}
              element={<CustomerDiscounts />}
            />
            <Route
              path={dashboardRoutes.customer.billSundries}
              element={<CustomerBillSundries />}
            />
            <Route
              path={dashboardRoutes.customerBeats.index}
              element={<CustomerBeats />}
            />
            <Route
              path={dashboardRoutes.order.wpLogs}
              element={<WpOrderLogs />}
            />
            <Route
              path={dashboardRoutes.order.dispatch.details}
              element={<OrderDispatchDetails />}
            />
            <Route
              path={dashboardRoutes.order.invoices}
              element={<OrderInvoices />}
            />
            <Route
              path={dashboardRoutes.materialCenter.index}
              element={<MaterialCenter />}
            />
            <Route
              path={dashboardRoutes.cashReceipts.index}
              element={<CashReceipts />}
            />
            <Route
              path={dashboardRoutes.customerBeatSchedule.index}
              element={<CustomerBeatSchedule />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
