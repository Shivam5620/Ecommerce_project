import { Outlet } from "react-router";
import Header from "../Header/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
