import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
const Layout = () => {
  const HIDE_HEADER_PATHS = ["/"];
  const { pathname } = useLocation();
  const showHeader = !HIDE_HEADER_PATHS.includes(pathname);

  return (
    <div className="layout w-full h-screen overflow-hidden flex flex-col">
      {showHeader && <Header />}
      <main className={`w-full flex-1 overflow-hidden ${showHeader ? "min-h-[95%] md:min-h-[94%]" : "min-h-full"} bg-black text-white`}>
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
