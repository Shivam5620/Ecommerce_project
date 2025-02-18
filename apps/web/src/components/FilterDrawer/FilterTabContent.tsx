import { IoMdCheckmark } from "react-icons/io";
import { useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";

interface IProps {
  data: string[];
  selectedData: string[];
  onClick: (value: string) => void;
}

const FilterTabContent: React.FC<IProps> = ({
  data,
  selectedData,
  onClick,
}) => {
  const [search, setSearch] = useState<string>("");

  const filteredData = useMemo(() => {
    return data.filter((data) =>
      data.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  return (
    <div>
      <div className="relative flex gap-3 items-center bg-[white] rounded-full p-2 ps-4 pe-4 mb-2 w-[100] border">
        <CiSearch className="w-[15px] h-[15px]" />
        <input
          className="w-[100%] outline-none text-[12px]"
          placeholder="Type anything..."
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-y-scroll h-[90vh]">
        {filteredData.map((value, index) => {
          const isSelected = selectedData.includes(value);
          return (
            <div
              key={value + "-" + index}
              className="border-b py-[15px] px-[20px] flex gap-[10px]"
              onClick={() => {
                onClick(value);
              }}
            >
              <div
                className={`w-[24px] h-[24px] rounded-full flex justify-center items-center ${isSelected ? "text-white bg-[#009CC9]" : "border border-gray text-gray-500"}`}
              >
                <IoMdCheckmark />
              </div>
              <div>
                <p className="font-semibold">{value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterTabContent;
