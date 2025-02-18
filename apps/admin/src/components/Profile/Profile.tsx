import React, { useEffect, useRef, useState } from "react";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { getFormValidator } from "../../lib/form";
import { useAppDispatch } from "../../app/hooks";
import { fetchChangePassword } from "../../app/feature/authSlice";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<any>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [, forceUpdate] = useState<any>();

  const validator = useRef(
    getFormValidator({
      autoForceUpdate: { forceUpdate: () => forceUpdate(1) },
    }),
  );

  useEffect(() => {
    validator.current = getFormValidator({
      autoForceUpdate: { forceUpdate: () => forceUpdate(1) },
    });
  }, [formData.newPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (validator.current.allValid()) {
      await dispatch(
        fetchChangePassword({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      ).unwrap();
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      validator.current.showMessages();
      forceUpdate(1);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:px-4">
        <div className="card-title">
          <h4 className="mb-3 text-capitalize font-medium text-[#010101] capitalize text-[1.125rem]">
            Reset Password
          </h4>
          <p className="mb-2 font-normal text-[#76838f] text-[0.875rem]">
            You can update your password here
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="oldPassword" value="Old Password" />
            </div>
            <TextInput
              id="oldPassword"
              name="oldPassword"
              type="password"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
            />
            <p className="text-red-500">
              {validator.current.message(
                "oldPassword",
                formData.oldPassword,
                "required",
              )}
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="newPassword" value="New Password" />
            </div>
            <TextInput
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <p className="text-red-500">
              {validator.current.message(
                "newPassword",
                formData.newPassword,
                "required",
              )}
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="confirmPassword" value="Confirm New Password" />
            </div>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <p className="text-red-500">
              {validator.current.message(
                "confirmPassword",
                formData.confirmPassword,
                `required|in:${formData.newPassword}`,
                {
                  messages: {
                    in: "Passwords need to match!",
                  },
                },
              )}
            </p>
          </div>
          <Button
            className="bg-[#0071AB] border-[#0071AB] text-white"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
