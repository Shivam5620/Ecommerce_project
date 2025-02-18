import { UserType } from "@repo/ui/enums/user";
import { ICreateUserRequestBody, IUser } from "@repo/ui/types/user";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAddUser, fetchUpdateUser } from "../../app/feature/userSlice";
import { fetchAllRole } from "../../app/feature/roleSlice";
import { fetchLoadings } from "../../app/feature/loadingSlice";

interface IProps {
  show: boolean;
  user: IUser | null;
  onClose: () => void;
}

const initialFormData: ICreateUserRequestBody = {
  name: "",
  email: "",
  password: "",
  type: UserType.SUPERADMIN,
  mobile: 0,
  warehouses: [],
  assignedRole: "",
  loading_id: null,
};

const UserModal: React.FC<IProps> = ({ show, user, onClose }) => {
  const dispatch = useAppDispatch();
  const { warehouses } = useAppSelector((state) => state.products);
  const { roles } = useAppSelector((state) => state.roles);
  const { loadings } = useAppSelector((state) => state.loadings);

  const [formData, setFormData] =
    React.useState<ICreateUserRequestBody>(initialFormData);

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        type: user.type,
        mobile: user.mobile || 0,
        warehouses: user.warehouses || [],
        assignedRole: user.assignedRole || "",
        loading_id: user.loading_id || null,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      // If editing an existing user, dispatch update action
      dispatch(fetchUpdateUser({ id: String(user._id), data: formData }))
        .unwrap()
        .then((res) => {
          if (res.status) {
            setFormData(initialFormData);
            onClose();
          }
        });
    } else {
      // If adding a new user, dispatch add action
      dispatch(fetchAddUser(formData))
        .unwrap()
        .then((res) => {
          if (res.status) {
            setFormData(initialFormData);
            onClose();
          }
        });
    }
  };

  useEffect(() => {
    dispatch(fetchAllRole());
    dispatch(fetchLoadings());
  }, []);

  return (
    <div>
      <Modal show={show} onClose={onClose}>
        <Modal.Header>User</Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name-field" value="Name" />
                </div>
                <TextInput
                  id="name-field"
                  name="name"
                  type="text"
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
                  <Label htmlFor="email-field" value="Email" />
                </div>
                <TextInput
                  id="email-field"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
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
                    setFormData({ ...formData, mobile: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password-field" value="Password" />
                </div>
                <TextInput
                  id="password-field"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!user}
                  disabled={!!user}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="user-type" value="User Type" />
                </div>
                <Select
                  id="user-type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as UserType,
                    })
                  }
                  required
                >
                  {Object.values(UserType).map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </Select>
              </div>
              {formData.type === UserType.WAREHOUSEMANAGER && (
                <div>
                  <legend className="mb-1">Assign Warehouses</legend>
                  <div className="grid grid-cols-4 gap-4">
                    {warehouses.map((warehouse) => (
                      <div key={warehouse} className="flex items-center gap-2">
                        <Checkbox
                          id={`warehouse-${warehouse}`}
                          name="warehouse"
                          checked={formData.warehouses.includes(warehouse)}
                          onChange={(e) => {
                            const { checked } = e.target;
                            if (checked) {
                              setFormData({
                                ...formData,
                                warehouses: [...formData.warehouses, warehouse],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                warehouses: formData.warehouses.filter(
                                  (w) => w !== warehouse,
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`warehouse-${warehouse}`}>
                          {warehouse}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="assignedRole" value="assignedRole" />
                </div>
                <Select
                  id="role"
                  value={formData.assignedRole.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignedRole: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {roles &&
                    roles.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                </Select>
              </div>
              {formData.type === UserType.LOADING_DRIVER && (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="loading-select" value="Loading" />
                  </div>
                  <Select
                    id="loading-select"
                    value={formData.loading_id ? formData.loading_id : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, loading_id: e.target.value })
                    }
                    required
                  >
                    {loadings.map(
                      ({ _id, loading_id, vehicle_number, driver_name }) => (
                        <option key={_id} value={_id}>
                          {loading_id} ({driver_name}) ({vehicle_number})
                        </option>
                      ),
                    )}
                  </Select>
                </div>
              )}
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

export default UserModal;
