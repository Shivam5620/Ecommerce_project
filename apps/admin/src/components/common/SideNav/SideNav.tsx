import { useMemo } from "react";
import { dashboardRoutes } from "@repo/ui/lib/constants";
import { NavLink } from "react-router-dom";
import {
  FaTruckPickup,
  FaUsers,
  FaCartArrowDown,
  FaBox,
  FaWarehouse,
} from "react-icons/fa6";
import { Sidebar } from "flowbite-react";
import { useAppSelector } from "../../../app/hooks";
import { hasPermission } from "@repo/ui/lib/permission";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/enums/permission";
import {
  FaTruckLoading,
  FaUnlockAlt,
  FaUserEdit,
  FaUsersCog,
} from "react-icons/fa";
import { MdBrandingWatermark, MdDashboard, MdInventory } from "react-icons/md";
import { RiReceiptFill } from "react-icons/ri";

const SideNav = ({
  isOpen,
  onClose,
  sidebarRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
}) => {
  const permissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const buttons = useMemo(() => {
    const buttons = [];
    if (
      hasPermission(
        Modules.Dashboard,
        Features.Dashboard,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.dashboard,
        icon: <MdDashboard />,
        label: "Dashboard",
      });

    if (
      hasPermission(
        Modules.Product,
        Features.Product,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.product.index,
        icon: <MdInventory />,
        label: "Products",
      });

    if (
      hasPermission(
        Modules.Order,
        Features.Order,
        AllowedPermission.READ,
        permissions,
      ) ||
      hasPermission(
        Modules.Order,
        Features.Dispatch,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.order.index,
        icon: <FaCartArrowDown />,
        label: "Orders",
      });

    if (
      hasPermission(
        Modules.Shipment,
        Features.Shipment,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.shipment.index,
        icon: <FaBox />,
        label: "Shipments",
      });

    if (
      hasPermission(
        Modules.Loading,
        Features.Loading,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.loading.index,
        icon: <FaTruckPickup />,
        label: "Loadings",
      });

    if (
      hasPermission(
        Modules.Order,
        Features.OrderLoad,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.orderLoad.index,
        icon: <FaTruckLoading />,
        label: "Load Order",
      });

    if (
      hasPermission(
        Modules.Brand,
        Features.Brand,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.brand.index,
        icon: <MdBrandingWatermark />,
        label: "Brands",
      });

    if (
      hasPermission(
        Modules.User,
        Features.User,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.user.index,
        icon: <FaUsersCog />,
        label: "Users",
      });

    if (
      hasPermission(
        Modules.Customer,
        Features.Customer,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.customer.index,
        icon: <FaUsers />,
        label: "Customers",
      });

    if (
      hasPermission(
        Modules.CustomerBeat,
        Features.CustomerBeat,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.customerBeats.index,
        icon: <FaUsers />,
        label: "Customer Beats",
      });

    if (
      hasPermission(
        Modules.CustomerBeat,
        Features.CustomerBeatSchedule,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.customerBeatSchedule.index,
        icon: <FaUsers />,
        label: "Customer Beat Schedule",
      });

    if (
      hasPermission(
        Modules.Role,
        Features.Role,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.role.index,
        icon: <FaUnlockAlt />,
        label: "Role",
      });

    if (
      hasPermission(
        Modules.MaterialCenter,
        Features.MaterialCenter,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.materialCenter.index,
        icon: <FaWarehouse />,
        label: "Material Center",
      });

    if (
      hasPermission(
        Modules.CashReceipt,
        Features.CashReceipt,
        AllowedPermission.READ,
        permissions,
      )
    )
      buttons.push({
        to: dashboardRoutes.cashReceipts.index,
        icon: <RiReceiptFill />,
        label: "Receipts",
      });

    // if (
    //   hasPermission(
    //     Modules.Bilty,
    //     Features.Bilty,
    //     AllowedPermission.READ,
    //     permissions,
    //   )
    // )
    //   buttons.push({
    //     to: dashboardRoutes.bilty,
    //     icon: <FaFileInvoice />,
    //     label: "Bilty",
    //   });

    buttons.push({
      to: dashboardRoutes.profile.index,
      icon: <FaUserEdit />,
      label: "Profile",
    });
    return buttons;
  }, [permissions]);

  return (
    <div
      id="logo-sidebar"
      ref={sidebarRef}
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
      aria-label="Sidebar"
    >
      <Sidebar aria-label="Sidebar with multi-level dropdown example">
        <Sidebar.Items className="pt-0">
          <Sidebar.ItemGroup className="m-0 border-0 pt-0">
            {buttons.map((button) => (
              <NavLink
                to={button.to}
                key={button.label}
                className="sidebar-btn"
                onClick={onClose}
              >
                <Sidebar.Item
                  icon={() => button.icon}
                  className="mt-[.2rem] mb-2 hover:none rounded-[8px]"
                >
                  {button.label}
                </Sidebar.Item>
              </NavLink>
            ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default SideNav;
