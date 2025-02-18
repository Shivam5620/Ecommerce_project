import React, { useMemo, useState } from "react";
import { SelectOption } from "./EditOrder";
import { useAppSelector } from "../../../app/hooks";
import { IProduct } from "@repo/ui/types/product";
import { Button, Label } from "flowbite-react";
import Select from "react-select";
import { IUpdateOrderItemRequestBody } from "@repo/ui/types/order";

interface IProps {
  item: IUpdateOrderItemRequestBody;
  index: number;
  totalItems: number;
  // order: IOrder;
  onUpdate: (index: number, item: IUpdateOrderItemRequestBody) => void;
  onDelete: (index: number) => void;
}

const AdditionalOrderItem: React.FC<IProps> = ({
  item,
  index,
  totalItems,
  onDelete,
  onUpdate,
}) => {
  const products = useAppSelector((state) => state.products.products);
  const productOptions: SelectOption[] = useMemo(() => {
    return [...new Set(products.map((product) => product.name))].map(
      (name) => ({ label: name, value: name }),
    );
  }, [products]);

  const [codeOptions, setCodeOptions] = useState<SelectOption[]>([]);
  const [colorOptions, setColorOptions] = useState<SelectOption[]>([]);
  const [sizeOptions, setSizeOptions] = useState<SelectOption[]>([]);

  const generateCodeOptions = (filteredOptions: IProduct[]) => {
    const codes = [...new Set(filteredOptions.map((product) => product.code))];
    setCodeOptions(codes.map((code) => ({ label: code, value: code })));
  };

  const generateColorOptions = (filteredOptions: IProduct[]) => {
    const colors = [
      ...new Set(filteredOptions.map((product) => product.color)),
    ];
    setColorOptions(colors.map((color) => ({ label: color, value: color })));
  };

  const generateSizeOptions = (filteredOptions: IProduct[]) => {
    const sizes = [...new Set(filteredOptions.map((product) => product.size))];
    setSizeOptions(sizes.map((size) => ({ label: size, value: size })));
  };

  return (
    <div className="row" id="additional-items-wrapper">
      <div className="col-12 new-product">
        <h4>
          {index + 1}/ {totalItems}
        </h4>
        <div className="form-group pb-3">
          <Label>Name</Label>
          <Select
            options={productOptions}
            value={{ label: item.name, value: item.name }}
            onChange={(value) => {
              const filteredProducts = products.filter(
                (product) => product.name === value?.value,
              );

              generateCodeOptions(filteredProducts);
              setColorOptions([]);
              setSizeOptions([]);

              // Update the parents additionalItems to clear color, code and size values
              onUpdate(index, {
                ...item,
                name: value?.value ?? "",
                code: "",
                color: "",
                size: "",
              });
            }}
          />
        </div>
        <div className="form-group pb-3">
          <Label>Code</Label>
          <Select
            options={codeOptions}
            value={{ label: item.code, value: item.code }}
            onChange={(value) => {
              console.log({ name: item.name, code: value?.value });
              // Set the color and size options
              const filteredProducts = products.filter(
                (product) =>
                  product.name === item.name && product.code === value?.value,
              );

              generateColorOptions(filteredProducts);
              setSizeOptions([]);

              onUpdate(index, {
                ...item,
                code: value?.value || "",
                color: "",
                size: "",
              });
            }}
          />
        </div>
        <div className="form-group pb-3">
          <Label>Color</Label>
          <Select
            options={colorOptions}
            value={{ label: item.color, value: item.color }}
            onChange={(value) => {
              // Set the color and size options
              const filteredProducts = products.filter(
                (product) =>
                  product.name === item.name &&
                  product.code === item.code &&
                  product.color === value?.value,
              );

              generateSizeOptions(filteredProducts);

              onUpdate(index, { ...item, color: value?.value || "", size: "" });
            }}
          />
        </div>
        <div className="form-group pb-3">
          <Label>Size</Label>
          <Select
            options={sizeOptions}
            value={{ label: item.size, value: item.size }}
            onChange={(value) => {
              onUpdate(index, { ...item, size: value?.value || "" });
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button.Group className="flex justify-center pb-3">
            <Button
              onClick={() => {
                if (item.qty === 0) return;
                onUpdate(index, { ...item, qty: item.qty - 1 });
              }}
            >
              -
            </Button>
            <Button color="gray">{item.qty}</Button>
            <Button
              onClick={() => onUpdate(index, { ...item, qty: item.qty + 1 })}
            >
              +
            </Button>
          </Button.Group>

          <Button
            size="xs"
            className="bg-red-500 mb-3 w-full"
            onClick={() => onDelete(index)}
          >
            DELETE
          </Button>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default AdditionalOrderItem;
