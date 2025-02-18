import { Navigate, Outlet } from "react-router";
import Header from "../Header/Header";
import SideNav from "../SideNav/SideNav";
import { dashboardRoutes } from "@repo/ui/lib/constants";
import { useAppSelector } from "../../../app/hooks";
import { useEffect, useRef, useState } from "react";
// import Footer from "../Footer/Footer";

const Layout = () => {
  const { logged_in, user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node) &&
      burgerRef.current &&
      !burgerRef.current.contains(event.target as Node)
    ) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  if (logged_in && user) {
    return (
      <>
        <Header onclose={toggleSidebar} burgerRef={burgerRef} />
        <SideNav
          isOpen={sidebarOpen}
          onClose={toggleSidebar}
          sidebarRef={sidebarRef}
        />
        <div
          className={`sm:ml-64 px-2 bg-[#F5F7FF] ${sidebarOpen ? "overflow-hidden" : ""}`}
        >
          <div className="py-3 px-1 rounded-lg mt-20 min-h-screen">
            <div className="main-page">
              <div className="bg-[#F5F7FF]">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Navigate to={dashboardRoutes.index} />;
  }
};

export default Layout;
