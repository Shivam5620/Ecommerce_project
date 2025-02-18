import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextInput,
  Label,
  FileInput,
  Datepicker,
  Radio,
} from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAddBilty,
  fetchDispatchesByTransportAndDate,
} from "../../app/feature/biltySlice";
import moment from "moment";
import config from "../../config";

interface BiltyModalProps {
  show: boolean;
  onClose: () => void;
}

const BiltyModal: React.FC<BiltyModalProps> = ({ show, onClose }) => {
  const dispatch = useAppDispatch();
  const { dispatches, loading } = useAppSelector((state) => state.bilty);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [date, setDate] = useState("");
  const [orderDispatch, setOrderDispatch] = useState("");

  useEffect(() => {
    if (vehicleNumber && date) {
      const formattedDate = moment(date).format(config.date.format);
      dispatch(
        fetchDispatchesByTransportAndDate({
          vehicle_number: vehicleNumber,
          date: formattedDate,
        }),
      );
    }
  }, [vehicleNumber, date, dispatch]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await dispatch(fetchAddBilty(formData));
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Upload Bilty</Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="transport-number" value="Transport Number" />
              </div>
              <TextInput
                id="transport-number"
                placeholder="Enter Transport Number"
                onChange={(e) => setVehicleNumber(e.target.value)}
                value={vehicleNumber}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="date" value="Dispatch Date" />
              </div>
              <Datepicker
                id="date"
                onChange={(date: Date | null) =>
                  setDate(date ? moment(date).format(config.date.format) : "")
                }
              />
            </div>

            <div>
              <Label value="Order Dispatch" />
              <div className="flex flex-col space-y-2">
                {dispatches.map((dispatch) => (
                  <div
                    key={dispatch.dispatch_id}
                    className="flex items-center gap-2"
                  >
                    <Radio
                      id={dispatch.dispatch_id}
                      name="dispatch_id"
                      value={dispatch._id}
                      checked={orderDispatch === dispatch._id}
                      onChange={(e) => setOrderDispatch(e.target.value)}
                    />
                    <Label htmlFor="dispatch1" className="ml-2">
                      {dispatch.dispatch_id}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bilty-image" value="Bilty Image" />
              <FileInput id="bilty-image" name="image" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BiltyModal;
