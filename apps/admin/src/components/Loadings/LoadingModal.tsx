import React from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { ICreateLoadingRequestBody, ILoading } from "@repo/ui/types/loading";
import { useAppDispatch } from "../../app/hooks";
import {
  fetchAddLoading,
  fetchUpdateLoading,
} from "../../app/feature/loadingSlice";

interface IProps {
  show: boolean;
  selectedLoading: ILoading | null;
  onClose: () => void;
}

const initialFormData: ICreateLoadingRequestBody = {
  driver_name: "",
  vehicle_number: "",
  mobile: "0",
};

const LoadingModal: React.FC<IProps> = ({ show, selectedLoading, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] =
    React.useState<ICreateLoadingRequestBody>(initialFormData);

  React.useEffect(() => {
    if (selectedLoading) {
      setFormData({
        driver_name: selectedLoading.driver_name || "",
        vehicle_number: selectedLoading.vehicle_number || "",
        mobile: selectedLoading.mobile || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedLoading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedLoading) {
      // If editing an existing loading, dispatch update action
      dispatch(
        fetchUpdateLoading({ id: String(selectedLoading._id), data: formData }),
      )
        .unwrap()
        .then((res) => {
          if (res.status) {
            setFormData(initialFormData);
            onClose();
          }
        });
    } else {
      // If adding a new user, dispatch add action
      dispatch(fetchAddLoading(formData))
        .unwrap()
        .then((res) => {
          if (res.status) {
            setFormData(initialFormData);
            onClose();
          }
        });
    }
  };

  return (
    <div>
      <Modal show={show} onClose={onClose}>
        <Modal.Header>Loading</Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="driver-name-field" value="Driver Name" />
                </div>
                <TextInput
                  id="driver-name-field"
                  name="driver_name"
                  type="text"
                  placeholder="Driver Name"
                  value={formData.driver_name}
                  onChange={(e) =>
                    setFormData({ ...formData, driver_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="vehicle-number-field"
                    value="Vehicle Number"
                  />
                </div>
                <TextInput
                  id="vehicle-number-field"
                  name="vehicle_number"
                  type="text"
                  placeholder="Vehicle Number"
                  value={formData.vehicle_number}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      vehicle_number: e.target.value,
                    });
                  }}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="mobile-field" value="Mobile" />
                </div>
                <TextInput
                  id="mobile-field"
                  name="mobile"
                  type="number"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
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
    </div>
  );
};

export default LoadingModal;
