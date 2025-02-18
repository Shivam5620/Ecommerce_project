import { Button, Label, Modal, TextInput } from "flowbite-react";
import Select from "react-select";
import { CustomerDiscountType } from "@repo/ui/enums/customerDiscount";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import { fetchAddCustomerDiscount } from "../../app/feature/customerDiscountSlice";
import { ICreateCustomerDiscountRequestBody } from "@repo/ui/types/customerDiscount";

interface IProps {
  type: CustomerDiscountType;
  show: boolean;
  onClose: () => void;
}

const CustomerDiscountsModal: React.FC<IProps> = ({ type, show, onClose }) => {
  const { code } = useParams();
  const dispatch = useAppDispatch();

  const itemGroups = useAppSelector((state) => state.itemGroups.itemGroups);
  const products = useAppSelector((state) => state.products.products);

  const initialFormData: ICreateCustomerDiscountRequestBody = {
    item_group_code: "",
    product_code: "",
    customer_code: code ?? "",
    discount_1: 0,
    discount_2: 0,
    discount_3: 0,
    type,
    comment: "",
  };

  const [selectedItemGroup, setSelectedItemGroup] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] =
    useState<ICreateCustomerDiscountRequestBody>(initialFormData);

  // Convert the item groups to options for the select component
  const itemGroupOptions = useMemo(() => {
    return itemGroups.map((ig) => ({ value: ig.code, label: ig.name }));
  }, [itemGroups]);

  // Update the product options if the selected item group changes
  const productOptions = useMemo(() => {
    // Remove duplicate products with same code
    const uniqueProducts = Array.from(
      new Map(
        products.map((product) => [product.product_code, product]),
      ).values(),
    );
    let filteredProducts = uniqueProducts;
    if (selectedItemGroup) {
      filteredProducts = uniqueProducts.filter((product) => {
        return product.item_group_code === selectedItemGroup?.value;
      });
    }
    return filteredProducts.map((product) => ({
      value: String(product.product_code),
      label: product.name,
    }));
  }, [selectedItemGroup, products]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log(formData);
    dispatch(fetchAddCustomerDiscount(formData))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setSelectedItemGroup(null);
          setSelectedProduct(null);
          setFormData(initialFormData);
          onClose();
        }
      });
  };

  return (
    <Modal show={show} onClose={onClose} size="xxl">
      <Modal.Header>Customer Discount</Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="item-group-select" value="Item Group" />
              </div>
              <Select
                id="item-group-select"
                name="item_group_code"
                options={itemGroupOptions}
                value={selectedItemGroup}
                onChange={(selectedOption) => {
                  setSelectedItemGroup(selectedOption);
                  setSelectedProduct(null);
                  setFormData({
                    ...formData,
                    item_group_code: selectedOption?.value,
                    product_code: null,
                  });
                }}
                required
                isClearable={true}
              />
            </div>
            {type === CustomerDiscountType.PRODUCT && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="item-name-select" value="Item Name" />
                </div>
                <Select
                  id="item-name-select"
                  name="bill_sundry_code"
                  options={productOptions}
                  value={selectedProduct}
                  onChange={(selectedOption) => {
                    setSelectedProduct(selectedOption);
                    setFormData({
                      ...formData,
                      product_code: selectedOption?.value,
                    });
                  }}
                  required
                  isClearable={true}
                />
              </div>
            )}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="discount-1-input" value="Discount 1 (%)" />
              </div>
              <TextInput
                id="discount-1-input"
                name="discount_1"
                type="number"
                value={formData.discount_1}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    discount_1: parseInt(e.target.value),
                  });
                }}
                min="0"
                max="100"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="discount-2-input" value="Discount 2 (Flat)" />
              </div>
              <TextInput
                id="discount-2-input"
                name="discount_2"
                type="number"
                value={formData.discount_2}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    discount_2: parseInt(e.target.value),
                  });
                }}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="discount-3-input" value="Discount 3 (%)" />
              </div>
              <TextInput
                id="discount-3-input"
                name="discount_3"
                type="number"
                value={formData.discount_3}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    discount_3: parseInt(e.target.value),
                  });
                }}
                min="0"
                max="100"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="comment-input" value="Comment" />
              </div>
              <TextInput
                id="comment-input"
                name="comment"
                type="text"
                value={formData.comment}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    comment: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Save</Button>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CustomerDiscountsModal;
