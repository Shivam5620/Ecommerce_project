import React, { useState, useMemo } from "react";
import Category1 from "../../../src/assets/images/category-2.png";
import Category2 from "../../../src/assets/images/Adidas-Logo 1.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearFilters, setFilters } from "../../app/features/productSlice";
import useOutsideClick from "./useOutsideClick";
import FilterTab from "./FilterTab";
import FilterTabContent from "./FilterTabContent";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

enum Tabs {
  BRANDS = "BRANDS",
  CATEGORIES = "CATEGORIES",
}

const FilterDrawer: React.FC<IProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { availableFilters, selectedFilters } = useAppSelector(
    (state) => state.products,
  );

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.CATEGORIES);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    selectedFilters.brands,
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedFilters.categories,
  );

  const offCanvasRef = useOutsideClick(onClose);

  useMemo(() => {
    setSelectedBrands(selectedFilters.brands);
    setSelectedCategories(selectedFilters.categories);
  }, [
    selectedFilters.brands,
    selectedFilters.categories,
    setSelectedBrands,
    setSelectedCategories,
  ]);

  const handleTabClick = (tab: Tabs) => {
    setActiveTab(tab);
  };

  const tabs = useMemo(
    () => [
      {
        name: "Categories",
        value: Tabs.CATEGORIES,
        image: Category1,
        data: availableFilters.categories,
        selectedData: selectedCategories,
        onClick: (value: string) => {
          const newCategories = selectedCategories.includes(value)
            ? selectedCategories.filter((item) => item !== value)
            : [...selectedCategories, value];
          setSelectedCategories(newCategories);
        },
      },
      {
        name: "Brands",
        value: Tabs.BRANDS,
        image: Category2,
        data: availableFilters.brands,
        selectedData: selectedBrands,
        onClick: (value: string) => {
          const newBrands = selectedBrands.includes(value)
            ? selectedBrands.filter((item) => item !== value)
            : [...selectedBrands, value];
          setSelectedBrands(newBrands);
        },
      },
    ],
    [
      availableFilters.brands,
      availableFilters.categories,
      selectedBrands,
      selectedCategories,
    ],
  );

  return (
    <div
      className={`fixed z-40 inset-0 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={offCanvasRef}
        className={`fixed right-0 lg:w-[500px] w-[100%] top-0 h-full bg-white shadow-xl transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex gap-4">
          <div className="block gap-4">
            {tabs.map((tab) => (
              <FilterTab
                key={tab.value}
                name={tab.name}
                isActive={activeTab === tab.value}
                image={tab.image}
                onClick={() => handleTabClick(tab.value)}
              />
            ))}
          </div>
          <div className="w-full pt-3 pe-3">
            {tabs.map((tab) => {
              if (activeTab !== tab.value) return null;
              return (
                <FilterTabContent
                  key={tab.value}
                  data={tab.data}
                  selectedData={tab.selectedData}
                  onClick={tab.onClick}
                />
              );
            })}
          </div>
        </div>
        <div className="fixed bottom-0 bg-white shadow-[0px_-3px_15px_0px_#0000001F] p-5 w-full">
          <div className="flex gap-5 justify-between">
            <button
              className="border border-[#009CC9] rounded-full w-full text-center py-3 text-[#009CC9]"
              onClick={() => {
                dispatch(clearFilters({}));
                onClose();
              }}
            >
              <p>Reset</p>
            </button>
            <button
              className="border border-[#009CC9] bg-[#009CC9] rounded-full w-full text-center py-3 text-white"
              onClick={() => {
                dispatch(
                  setFilters({
                    categories: selectedCategories,
                    brands: selectedBrands,
                  }),
                );
                onClose();
              }}
            >
              <p>Apply</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FilterDrawer;
