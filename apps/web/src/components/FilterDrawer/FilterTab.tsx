interface IProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
  image: string;
}

const FilterTab: React.FC<IProps> = ({ name, isActive, onClick, image }) => {
  return (
    <div className="py-2">
      <button
        className={`py-2 px-4 text-sm font-medium text-center 
                ${isActive ? "border-l-4 border-blue-500 text-blue-600 bg-white" : "text-gray-500 hover:text-blue-600 bg-[#F8F8F8] rounded-tr-[10px] rounded-br-[10px]"} w-full`}
        onClick={onClick}
      >
        <div className="flex justify-center">
          <div className="w-[65px] h-[65px] rounded-full bg-[#009CC908] flex justify-center items-center mb-3">
            <img src={image} alt="" />
          </div>
        </div>
        <p className="text-center font-bold text-[15px] text-[#000] font-family: Plus Jakarta Sans">
          {name}
        </p>
      </button>
    </div>
  );
};

export default FilterTab;
