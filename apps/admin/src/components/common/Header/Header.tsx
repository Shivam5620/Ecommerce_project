import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchLogout } from "../../../app/feature/authSlice";
import { dashboardRoutes } from "@repo/ui/lib/constants";

const Header = ({
  onclose,
  burgerRef,
}: {
  onclose: () => void;
  burgerRef: React.RefObject<HTMLButtonElement>;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    dispatch(fetchLogout())
      .then(() => {
        navigate(dashboardRoutes.index);
      })
      .catch(console.error);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-2 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              // data-drawer-target="logo-sidebar"
              // data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              ref={burgerRef}
              onClick={onclose}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                />
              </svg>
            </button>
            <div className="text-center">
              <Link
                className="flex justify-center items-center"
                to={dashboardRoutes.index}
              >
                <img className="w-[70px]" src="/Logo.png" alt="" />
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[12px] lg:text-lg">
                    {user?.name.toUpperCase()} ({user?.type.toUpperCase()})
                  </p>
                </div>
                <div>
                  <img
                    className="w-[40px] h-[40px] rounded-full cursor-pointer"
                    src="/Profile.jpg"
                    alt=""
                    onClick={toggleDropdown}
                  />
                </div>
              </div>
              <div
                className={`z-50 absolute top-12 right-0 ${dropdownVisible ? "" : "hidden"} my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600`}
                id="dropdown-user"
              >
                <ul className="py-1" role="none">
                  {/* <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Settings
                        </a>
                      </li> */}
                  <li>
                    <p
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Logout
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
