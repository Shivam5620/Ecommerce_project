import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "../common/Footer/Footer";
import Loader from "../common/Loader/Loader";
import ProductBox from "./ProductBox";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./Home.css";
import { getAssetUrl } from "../../lib/asset";
import { UploadType } from "@repo/ui/enums/upload";
import { constructQueryParams, parseQueryParams } from "../../lib/filter";
import { useLocation, useNavigate } from "react-router";
import { initialFilters, setFilters } from "../../app/features/productSlice";

const ITEMS_PER_PAGE = 20; // Adjust this to control how many items are loaded per scroll

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { filteredProducts, loading } = useAppSelector(
    (state) => state.products,
  );
  const brands = useAppSelector((state) => state.brands.brands);
  const selectedFilters = useAppSelector(
    (state) => state.products.selectedFilters,
  );
  const [visibleProducts, setVisibleProducts] = useState(
    filteredProducts.slice(0, ITEMS_PER_PAGE),
  );

  const location = useLocation();

  // Set store filters from URL on component mount
  useEffect(() => {
    const urlFilters = parseQueryParams(location.search);
    console.log({ urlFilters });
    dispatch(setFilters({ ...initialFilters, ...urlFilters }));
  }, [location.search, dispatch]);

  // Update the URL whenever filters change in the store
  useEffect(() => {
    const queryParams = constructQueryParams(selectedFilters);
    navigate(`?${queryParams}`, { replace: true });
  }, [selectedFilters, navigate]);

  const showMoreData = () => {
    if (visibleProducts.length >= filteredProducts.length) {
      return;
    }

    const newProducts = filteredProducts.slice(
      visibleProducts.length,
      visibleProducts.length + ITEMS_PER_PAGE,
    );
    setVisibleProducts([...visibleProducts, ...newProducts]);
  };

  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, ITEMS_PER_PAGE));
  }, [filteredProducts]);

  if (loading) {
    return <Loader />;
  }

  if (filteredProducts.length === 0) {
    return <h1>Oops! There are no products to display.</h1>;
  }

  return (
    <>
      <div className="rounded-bl-[52px] rounded-br-[52px] bg-[#F6F6F6] lg:p-10 p-1 pb-20 top-0 relative"></div>
      <div className="lg:me-[70px] lg:ms-[70px] sm:me-[35px] sm:ms-[35px]">
        <div className="bg-white lg:p-12 relative top-[-80px] rounded-tl-[52px] rounded-tr-[52px] px-1 py-8">
          {brands.length > 0 && (
            <div className="grid grid-cols-6 lg:gap-9 mb-10 pb-3 overflow-x-scroll gap-3 mobile-gap-circle">
              {brands.map(({ name, image }, index) => (
                <div key={`${name}-${index}`}>
                  <div className="h-[131px] w-[131px] responsive-h-w rounded-full bg-circle-liner flex justify-center items-center">
                    <img
                      className="lg:w-[97px] lg:h-[56px] circle-logo-mobile"
                      src={getAssetUrl(UploadType.brand, image)}
                      alt="Brand Logo"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <InfiniteScroll
            className="px-1 hide-scrollbar"
            dataLength={visibleProducts.length}
            next={showMoreData}
            hasMore={visibleProducts.length < filteredProducts.length}
            loader={<Loader />}
            scrollableTarget="scrollableDiv"
          >
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 relative">
              {visibleProducts.map((product) => (
                <ProductBox
                  key={`${product.code}-${product.color}`}
                  product={product}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
