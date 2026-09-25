import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
