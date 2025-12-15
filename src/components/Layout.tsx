import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
const Layout = () => {
  const HIDE_HEADER_PATHS = ["/"];
  const { pathname } = useLocation();
  const showHeader = !HIDE_HEADER_PATHS.includes(pathname);

  return (
    <div className="layout w-full h-full">
      {showHeader && <Header />}
      <main className={`w-full ${showHeader ? "min-h-[92%]" : "min-h-full"} bg-black text-white`}>
        <Outlet />
      </main>
      <footer className="w-full h-[2%] bg-black"></footer>
    </div>
  );
};
export default Layout;
