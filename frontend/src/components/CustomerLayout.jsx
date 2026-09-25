import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";

function CustomerLayout() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageInfo = () => {
    if (location.pathname === "/customer") {
      return {
        section: "Customer workspace",
        description: "Discover, book and manage services",
      };
    }

    if (location.pathname === "/services") {
      return {
        section: "Explore services",
        description: "Discover local professionals and services",
      };
    }

    if (location.pathname.startsWith("/services/")) {
      return {
        section: "Service details",
        description: "Review the service and make a booking",
      };
    }

    if (location.pathname === "/customer/bookings") {
      return {
        section: "My bookings",
        description: "Track appointments and service history",
      };
    }

    if (location.pathname === "/customer/review") {
      return {
        section: "Reviews",
        description: "Share your experience with professionals",
      };
    }

    return {
      section: "Customer workspace",
      description: "Manage your Sahayra experience",
    };
  };

  const pageInfo = getPageInfo();

  // Close mobile sidebar after navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen lg:pl-[260px]">
        <CustomerHeader
          onMenuClick={() => setSidebarOpen(true)}
          section={pageInfo.section}
          description={pageInfo.description}
        />

        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;
