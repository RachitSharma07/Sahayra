import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import ProviderSidebar from "./ProviderSidebar";

function ProviderLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
      <ProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen lg:pl-[260px]">
        <Outlet />
      </main>
    </div>
  );
}

export default ProviderLayout;
