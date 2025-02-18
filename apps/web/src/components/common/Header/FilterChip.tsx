import React from "react";

interface IProps {
  name: string;
  onRemove: () => void;
}
const FilterChip: React.FC<IProps> = ({ name, onRemove }) => {
  return (
    <div
      style={{ background: "#009CC9" }}
      className="bg-gray-200 px-4 py-0 rounded-full flex items-center text-white"
    >
      <span className="text-sm">{name}</span>
      <button
        className="ml-2 mb-1 text-orange-100 text-2xl text-white"
        onClick={onRemove}
      >
        &times;
      </button>
    </div>
  );
};

export default FilterChip;
