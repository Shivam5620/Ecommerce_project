import { useState, useMemo, FormEventHandler } from "react";
import { Modal, Button, Label, Datepicker } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { UserType } from "@repo/ui/enums/user";
import Select from "react-select";
import {
  ICreateCustomerBeatScheduleRequestBody,
  ICustomerBeatSchedule,
} from "@repo/ui/types/customerBeatSchedule";
import moment from "moment";
import { createCustomerBeatSchedule } from "../../app/feature/customerBeatScheduleSlice";

interface CustomerBeatScheduleModalProps {
  showModal: boolean;
  onClose: () => void;
  selectedBeatSchedule: ICustomerBeatSchedule | null;
}

const CustomerBeatScheduleModal = ({
  showModal,
  onClose,
  selectedBeatSchedule,
}: CustomerBeatScheduleModalProps) => {
  const { users } = useAppSelector((state) => state.users);
  const { customerBeats } = useAppSelector((state) => state.customerBeats);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<
    Omit<ICreateCustomerBeatScheduleRequestBody, "schedules"> & {
      schedules: Array<{
        key: string;
        customer_beat_id: string;
        date: string;
      }>;
    }
  >({
    user_id: "",
    schedules: [],
  });

  const salesManOptions = useMemo(() => {
    return users
      .filter((user) => user.type === UserType.SALESMAN)
      .map((salesman) => ({
        value: salesman._id,
        label: salesman.name,
      }));
  }, [users]);

  const customerBeatOptions = useMemo(() => {
    return customerBeats.map((beat) => ({
      value: beat._id,
      label: beat.name,
    }));
  }, [customerBeats]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formDataToSubmit = {
      user_id: formData.user_id,
      schedules: formData.schedules.map((schedule) => ({
        customer_beat_id: schedule.customer_beat_id,
        date: schedule.date,
      })),
    };
    dispatch(createCustomerBeatSchedule(formDataToSubmit))
      .unwrap()
      .then((res) => {
        if (res.status) {
          onClose();
        }
      });
  };
  return (
    <Modal show={showModal} onClose={onClose} size="4xl">
      <Modal.Header>
        {selectedBeatSchedule ? "Edit" : "Add"} Beat Schedule
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body style={{ minHeight: "50vh", overflowY: "auto" }}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="salesman" value="Select Salesman" />
            </div>
            <Select
              id="salesman"
              value={salesManOptions.find((s) => s.value === formData.user_id)}
              options={salesManOptions}
              onChange={(selectedOption) => {
                setFormData({
                  ...formData,
                  user_id: String(selectedOption?.value),
                });
              }}
            />
          </div>

          <h1 className="mt-2 mb-0">Schedules</h1>
          {formData.schedules.map((schedule, index) => (
            <div key={schedule.key} className="grid grid-cols-3 gap-4 mt-2">
              <Select
                value={customerBeatOptions.find(
                  (b) => b.value === schedule.customer_beat_id,
                )}
                options={customerBeatOptions}
                onChange={(selectedOption) => {
                  const newSchedules = [...formData.schedules];
                  newSchedules[index].customer_beat_id = String(
                    selectedOption?.value,
                  );
                  setFormData({
                    ...formData,
                    schedules: newSchedules,
                  });
                }}
              />
              <Datepicker
                value={moment(schedule.date, "DD-MM-YYYY").toDate()}
                onChange={(date: Date | null) => {
                  if (date) {
                    // Format the date to DD-MM-YYYY using moment
                    const formattedDate = moment(date).format("DD-MM-YYYY");

                    // Update the date in the schedules array
                    const newSchedules = [...formData.schedules];
                    newSchedules[index].date = formattedDate;
                    setFormData({
                      ...formData,
                      schedules: newSchedules,
                    });
                  }
                }}
              />
              <Button
                onClick={() => {
                  // Remove schedule from index
                  const newSchedules = formData.schedules.filter(
                    (s) => s.key !== schedule.key,
                  );
                  setFormData({
                    ...formData,
                    schedules: newSchedules,
                  });
                }}
                color="red"
              >
                Delete
              </Button>
            </div>
          ))}

          <Button
            onClick={() => {
              setFormData({
                ...formData,
                schedules: [
                  ...formData.schedules,
                  {
                    key: String(Math.random()),
                    customer_beat_id: "",
                    date: moment().format("DD-MM-YYYY"),
                  },
                ],
              });
            }}
            className="w-full sm:w-auto mt-2"
          >
            Add More
          </Button>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" className="w-full sm:w-auto">
            {selectedBeatSchedule ? "Edit" : "Add"} Schedule
          </Button>
          <Button onClick={onClose} color="gray" className="w-full sm:w-auto">
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CustomerBeatScheduleModal;
