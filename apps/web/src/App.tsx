import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/common/Layout/Layout";
import { routes } from "@repo/ui/lib/constants";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect } from "react";
import { fetchProducts } from "./app/features/productSlice";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import { ToastContainer } from "react-toastify";
import { fetchBrands } from "./app/features/brandSlice";

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <></>;
};

function App() {
  const dispatch = useAppDispatch();

  const availability = useAppSelector(
    (state) => state.cart.productAvailability,
  );

  useEffect(() => {
    dispatch(fetchBrands({}));
  }, []);

  useEffect(() => {
    dispatch(
      fetchProducts({
        available: availability ? true : undefined,
      }),
    );
  }, [availability]);

  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path={routes.home} element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path={routes.cart} element={<Cart />} />
          <Route path={routes.orderDetails} element={<OrderDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
