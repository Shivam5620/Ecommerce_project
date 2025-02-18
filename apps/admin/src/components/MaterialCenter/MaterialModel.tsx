import { Button, TextInput, Modal, Label } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { IMaterialCenter } from "@repo/ui/types/materialCenter";
import {
  fetchAddMaterialCenter,
  fetchUpdateMaterialCenter,
} from "../../app/feature/materialCenterSlice";

interface IProps {
  show: boolean;
  materialCenter: IMaterialCenter | null;
  onClose: () => void;
  onSave: (newMaterial: IMaterialCenter) => void;
}

const MaterialModal: React.FC<IProps> = ({
  show,
  materialCenter,
  onClose,
  onSave,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<Partial<IMaterialCenter>>({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    status: true,
  });
  useEffect(() => {
    if (materialCenter) {
      setFormData({
        name: materialCenter.name,
        addressLine1: materialCenter.addressLine1,
        addressLine2: materialCenter.addressLine2,
        city: materialCenter.city,
        state: materialCenter.state,
        pinCode: materialCenter.pinCode,
        status: materialCenter.status,
      });
    } else {
      setFormData({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
        status: true,
      });
    }
  }, [materialCenter]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form Data: ", formData);

    if (materialCenter) {
      dispatch(
        fetchUpdateMaterialCenter({ id: materialCenter._id!, data: formData }),
      )
        .unwrap()
        .then(() => {
          setFormData({
            name: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pinCode: "",
            status: true,
          });
          onClose();
        });
    } else {
      dispatch(fetchAddMaterialCenter(formData))
        .unwrap()
        .then((newMaterial) => {
          onSave(newMaterial);
          onClose();
        });
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>
        {materialCenter ? "Update" : "Add"} Material Center
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name-field" value="Name" />
              </div>
              <TextInput
                type="text"
                id="name-field"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="address-field" value="AddressLine-1" />
              </div>
              <TextInput
                type="text"
                id="address-field"
                name="addressLine1"
                placeholder="Address Line 1"
                value={formData.addressLine1}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="address-field" value="AddressLine-2" />
              </div>
              <TextInput
                type="text"
                id="address-field"
                name="addressLine2"
                placeholder="Address Line 2"
                value={formData.addressLine2}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine2: e.target.value })
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="city-field" value="City" />
                <TextInput
                  id="city-field"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="state-field" value="State" />
                </div>
                <TextInput
                  id="state-field"
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="pinCode-field" value="PinCode" />
                </div>
                <TextInput
                  id="pinCode-field"
                  type="text"
                  name="pinCode"
                  placeholder="Pin Code"
                  value={formData.pinCode}
                  onChange={(e) =>
                    setFormData({ ...formData, pinCode: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">
            {materialCenter ? "Update" : "Add"} Material Center
          </Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default MaterialModal;
