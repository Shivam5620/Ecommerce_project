import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useParams } from "react-router";
import { Button, Label, Modal, Radio, TextInput } from "flowbite-react";
import { ICustomerBillSundry } from "@repo/ui/types/customerBillSundry";
import { CustomerBillSundryType } from "@repo/ui/enums/customerBillSundry";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAddCustomerBillSundry } from "../../app/feature/customerBillSundrySlice";
import { fetchAllBillSundries } from "../../app/feature/billSundrySlice";

interface IProps {
  show: boolean;
  onClose: () => void;
}

const CustomerBillSundryModal: React.FC<IProps> = ({ show, onClose }) => {
  const { code } = useParams();
  const dispatch = useAppDispatch();
  const billSundries = useAppSelector(
    (state) => state.billSundries.billSundries,
  );

  const initialFormData: ICustomerBillSundry = {
    bill_sundry_code: "",
    customer_code: code ?? "",
    type: CustomerBillSundryType.PERCENTAGE,
    value: 0,
  };

  const [formData, setFormData] =
    useState<ICustomerBillSundry>(initialFormData);

  useEffect(() => {
    dispatch(fetchAllBillSundries());
  }, []);

  // Convert the item groups to options for the select component
  const billSundryOptions = useMemo(() => {
    return billSundries.map((e) => ({ value: e.code, label: e.name }));
  }, [billSundries]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log(formData);
    dispatch(fetchAddCustomerBillSundry(formData))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setFormData(initialFormData);
          onClose();
        }
      });
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Customer Bill Sundry</Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <fieldset className="flex max-w-md flex-col gap-4 mb-4">
            <legend className="mb-4">Select type of bill sundry</legend>
            {Object.values(CustomerBillSundryType).map((type) => (
              <div className="flex items-center gap-2">
                <Radio
                  id={`${type}-check`}
                  name="type"
                  value={type}
                  checked={type === formData.type}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      type: e.target.value as CustomerBillSundryType,
                    });
                  }}
                />
                <Label htmlFor={`${type}-check`}>{type}</Label>
              </div>
            ))}
          </fieldset>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="bill-sundry-select" value="Item Group" />
              </div>
              <Select
                id="bill-sundry-select"
                name="bill_sundry_code"
                options={billSundryOptions}
                // value={selectedItemGroup}
                onChange={(selectedOption) => {
                  setFormData({
                    ...formData,
                    bill_sundry_code: selectedOption?.value ?? "",
                  });
                }}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="value-input" value="Value" />
              </div>
              <TextInput
                id="value-input"
                name="value"
                type="number"
                value={formData.value}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    value: Number(e.target.value),
                  });
                }}
                required
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

export default CustomerBillSundryModal;
