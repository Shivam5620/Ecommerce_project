import { useEffect, useMemo, useState } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createCustomerBeat,
  updateCustomerBeat,
} from "../../app/feature/customerBeatSlice";
import { fetchAllCustomers } from "../../app/feature/customerSlice";
import {
  ICreateCustomerBeatRequestBody,
  ICustomerBeat,
} from "@repo/ui/types/customerBeat";
import Select, { MultiValue } from "react-select";

interface CustomerModalProps {
  showModal: boolean;
  onClose: () => void;
  selectedCustomerBeat: ICustomerBeat | null;
}

const CustomerBeatModal: React.FC<CustomerModalProps> = ({
  showModal,
  onClose,
  selectedCustomerBeat,
}) => {
  const dispatch = useAppDispatch();
  const { customers, loading: customersLoading } = useAppSelector(
    (state) => state.customers,
  );
  const [selectedCustomers, setSelectedCustomers] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);

  const [formData, setFormData] = useState<ICreateCustomerBeatRequestBody>({
    name: selectedCustomerBeat?.name || "",
    customer_codes: selectedCustomerBeat?.customer_codes || [],
  });

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCustomerBeat) {
      setFormData(selectedCustomerBeat);
      const selectedOptions = selectedCustomerBeat.customers?.map((c) => ({
        label: c.name,
        value: c.code,
      }));
      setSelectedCustomers(selectedOptions || []);
    } else {
      setFormData({
        name: "",
        customer_codes: [],
      });
    }
  }, [dispatch, selectedCustomerBeat]);

  const customerOptions = useMemo(() => {
    return customers.map((customer) => ({
      value: customer.code,
      label: customer.name,
    }));
  }, [customers]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (selectedCustomerBeat) {
      dispatch(
        updateCustomerBeat({
          id: selectedCustomerBeat._id,
          data: formData,
        }),
      )
        .unwrap()
        .then((res) => {
          if (res.status) {
            onClose();
          }
        });
    } else {
      dispatch(createCustomerBeat(formData))
        .unwrap()
        .then((res) => {
          if (res.status) {
            onClose();
          }
        });
    }
  };

  return (
    <Modal show={showModal} onClose={onClose} size="5xl">
      <Modal.Header>
        {selectedCustomerBeat ? "Edit Customer Beat" : "Add New Customer Beat"}
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="customer-beat-name"
                  value="Customer Beat Name"
                />
              </div>
              <TextInput
                id="customer-beat-name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="customer-codes-select" value="Customers" />
              </div>
              <Select
                isMulti
                name="customer_codes"
                isLoading={customersLoading}
                options={customerOptions}
                value={selectedCustomers}
                onChange={(selectedOptions) => {
                  setSelectedCustomers(selectedOptions);
                  setFormData({
                    ...formData,
                    customer_codes: selectedOptions.map((c) => c.value),
                  });
                }}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" className="w-full sm:w-auto">
            {selectedCustomerBeat
              ? "Update Customer Beat"
              : "Add Customer Beat"}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            color="gray"
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CustomerBeatModal;
