import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "../../app/feature/authSlice";
import { ILoginBody } from "@repo/ui/types/auth";
import { dashboardRoutes } from "@repo/ui/lib/constants";
import { getFormValidator } from "../../lib/form";
import { Button, Card, TextInput } from "flowbite-react";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const location = useLocation();

  const loading = useAppSelector((state) => state.auth.loading);
  const [formData, setFormData] = useState<ILoginBody>({
    email: "",
    password: "",
  });

  // const from = location.state?.from?.pathname || dashboardRoutes.dashboard;

  const [, forceUpdate] = useState<any>();
  const validator = useRef(
    getFormValidator({
      autoForceUpdate: { forceUpdate: () => forceUpdate(1) },
    }),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const res = await dispatch(fetchLogin(formData)).unwrap();

      if (res.status) navigate(dashboardRoutes.order.index, { replace: true });
    } else {
      validator.current.showMessages();
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#F5F7FF] min-h-screen py-[2.375rem] flex place-items-center">
        <div className="flex justify-center w-full mx-0">
          <div className="w-full max-w-md mx-auto px-2">
            <Card className="bg-[#ffffff]">
              <div className="mb-[1rem]">
                <img className="w-[150px]" src="/Logo.png" alt="Login Logo" />
              </div>
              <h6 className="font-normal mb-2">Sign in to continue</h6>
              <form className="pt-3" onSubmit={handleSubmit}>
                <div className="mb-[1.5rem]">
                  <TextInput
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-describedby="email-error"
                  />
                  <p id="email-error" className="text-red-500">
                    {validator.current.message(
                      "email",
                      formData.email,
                      "required|email",
                    )}
                  </p>
                </div>
                <div className="mb-[1.5rem]">
                  <TextInput
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-describedby="password-error"
                  />
                  <p id="email-error" className="text-red-500">
                    {validator.current.message(
                      "password",
                      formData.password,
                      "required",
                    )}
                  </p>
                </div>
                <div className="mb-6">
                  <Button
                    className="bg-[#00A2D0]  w-full"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
