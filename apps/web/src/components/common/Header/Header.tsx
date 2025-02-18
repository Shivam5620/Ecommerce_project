import { useState } from "react";
import { CartType } from "@repo/ui/enums/cart";
import { routes } from "@repo/ui/lib/constants";
import { IoMdFunnel } from "react-icons/io";
import { RWebShare } from "react-web-share";
import { CiSearch } from "react-icons/ci";
import { CgPlayListSearch } from "react-icons/cg";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { RiShareLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { clearFilters } from "../../../app/features/productSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCartType } from "../../../app/features/cartSlice";
import { constructQueryParams } from "../../../lib/filter";
import FilterDrawer from "../../FilterDrawer/FilterDrawer";
import FilterChip from "./FilterChip";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedFilters = useAppSelector(
    (state) => state.products.selectedFilters,
  );
  const { items: cartItems, cartType } = useAppSelector((state) => state.cart);

  const [search, setSearch] = useState<string>("");
  const [isOffCanvasOpen, setOffCanvasOpen] = useState(false);
  const [intelligentSearch, setIntelligentSearch] = useState(false);
  const handleCategorySelect = (category: string) => {
    const { categories } = selectedFilters;
    const newCategories = categories.includes(category)
      ? categories.filter((item) => item !== category)
      : [...categories, category];

    const queryParams = constructQueryParams({
      ...selectedFilters,
      categories: newCategories,
    });

    navigate(`?${queryParams}`, { replace: true });
  };

  const handleBrandSelect = (brand: string) => {
    const { brands } = selectedFilters;
    const newBrands = brands.includes(brand)
      ? brands.filter((item) => item !== brand)
      : [...brands, brand];

    const queryParams = constructQueryParams({
      ...selectedFilters,
      brands: newBrands,
    });

    navigate(`?${queryParams}`, { replace: true });
  };

  return (
    <>
      <div className="sticky top-0 bg-[#F6F6F6] pt-3 z-[100] pb-2">
        <div className="lg:ps-7 lg:pe-7 px-2 sm:px-6">
          <div className="flex justify-between gap-3 items-center">
            <div className="flex justify-center gap-3 items-center navbar-responsive-m">
              <div>
                <div className="relative flex gap-3 items-center bg-[white] rounded-full p-2 ps-4 pe-4 lg:w-[600px]">
                  <CiSearch size={25} />
                  <input
                    className="w-[100%] outline-none text-[12px] lg:text-lg"
                    placeholder="Type anything..."
                    type="text"
                    value={search}
                    onChange={(e) => {
                      if (!intelligentSearch) {
                        const queryParams = constructQueryParams({
                          ...selectedFilters,
                          search: [e.target.value],
                        });
                        navigate(`?${queryParams}`, { replace: true });
                      }
                      setSearch(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        if (!intelligentSearch) {
                          return;
                        }
                        if (search.length) {
                          const queryParams = constructQueryParams({
                            ...selectedFilters,
                            search: [...selectedFilters.search, search],
                          });
                          navigate(`?${queryParams}`, { replace: true });
                          setSearch("");
                        }
                      }
                    }}
                  />
                  <button
                    className="text-[#00A5D0]"
                    onClick={() =>
                      setIntelligentSearch(
                        !intelligentSearch && !intelligentSearch,
                      )
                    }
                  >
                    <CgPlayListSearch
                      color={intelligentSearch ? "#00A5D0" : "gray"}
                      size={21}
                      cursor="pointer"
                    />
                  </button>
                  <button
                    className="text-[#00A5D0]"
                    onClick={() => setOffCanvasOpen(true)}
                  >
                    <IoMdFunnel />
                  </button>
                  <FilterDrawer
                    isOpen={isOffCanvasOpen}
                    onClose={() => setOffCanvasOpen(false)}
                  />
                </div>
              </div>
              <div className="lg:block sm:block">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center gap-5">
                    <button
                      className="lg:w-[50px] lg:h-[50px] w-[35px] h-[35px] rounded-full bg-[#00A5D0] flex justify-center items-center"
                      onClick={() => dispatch(clearFilters({}))}
                    >
                      <LuRefreshCw className="lg:w-[20px] lg:h-[20px] w-[15px] h-[15px] text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div
                    className={`relative sm:w-14 w-10 sm:h-8 h-5 rounded-full cursor-pointer transition-colors duration-300 ${
                      cartType === CartType.CARTON
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                    onClick={() => {
                      if (cartType === CartType.PAIR) {
                        dispatch(setCartType(CartType.CARTON));
                      } else {
                        dispatch(setCartType(CartType.PAIR));
                      }
                    }}
                  >
                    <div
                      className={`absolute sm:left-1 left-0.5 sm:top-1 top-0.5 sm:w-6 w-4 sm:h-6 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                        cartType === CartType.CARTON
                          ? "sm:translate-x-6 translate-x-5"
                          : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              <RWebShare
                data={{
                  text: "You can find your shoes at FAWZ. Check it out!",
                  url: window.location.href,
                  title: "Bootwala",
                }}
              >
                <button className="lg:h-[48px] lg:w-[48px] w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center">
                  <RiShareLine className="lg:w-[24px] lg:h-[24px] w-[18px] h-[18px]" />
                </button>
              </RWebShare>
              <Link to={routes.cart}>
                <div className="lg:h-[48px] lg:w-[48px] w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center relative">
                  {cartItems.length ? (
                    <div className="absolute font-normal top-0 left-[-7px] lg:h-[17px] lg:w-[17px] h-[13px] w-[13px] bg-[#00A5CC] rounded-full text-white flex justify-center items-center text-[8px] lg:text-lg">
                      {cartItems.length}
                    </div>
                  ) : null}
                  <HiOutlineShoppingCart className="lg:w-[24px] lg:h-[24px] w-[18px] h-[18px]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:ps-7 lg:pe-7 pe-3 ps-3 mt-3 lg:mt-0">
          <div className="flex flex-wrap gap-2 lg:pb-6 pb-0">
            {intelligentSearch &&
              selectedFilters.search
                // .filter((f) => f.length > 0)
                .map((tag) => (
                  <FilterChip
                    key={tag}
                    name={tag}
                    onRemove={() => {
                      const queryParams = constructQueryParams({
                        ...selectedFilters,
                        search: selectedFilters.search.filter((f) => f !== tag),
                      });
                      navigate(`?${queryParams}`, { replace: true });
                    }}
                  />
                ))}
            {selectedFilters.categories
              // .filter((f) => f.length > 0)
              .map((category) => (
                <FilterChip
                  key={category}
                  name={category}
                  onRemove={() => {
                    handleCategorySelect(category);
                  }}
                />
              ))}
            {selectedFilters.brands
              // .filter((f) => f.length > 0)
              .map((brand) => (
                <FilterChip
                  key={brand}
                  name={brand}
                  onRemove={() => {
                    handleBrandSelect(brand);
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
