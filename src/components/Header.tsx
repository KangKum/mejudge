import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLoggedIn = !!localStorage.getItem("MJKRtoken");

  return (
    <header className="w-full h-[6%] bg-black flex text-white">
      <div className="leftPart md:w-[20%] h-full"></div>
      <div className="middlePart w-[70%] md:w-[60%] h-full flex justify-center items-center">
        <button
          className={`md:flex-none flex-1 md:w-[120px] h-full ${pathname === "/main" ? "bg-gray-500" : ""} hover:bg-gray-400 hover:cursor-pointer`}
          onClick={() => navigate("/main")}
        >
          사건
        </button>
        <button
          className={`md:flex-none flex-1 md:w-[120px] h-full ${pathname === "/rank" ? "bg-gray-500" : ""} hover:bg-gray-400 hover:cursor-pointer`}
          onClick={() => navigate("/rank")}
        >
          랭킹
        </button>
      </div>
      <div className="rightPart w-[30%] md:w-[20%] h-full flex justify-end items-center">
        <button
          className={`h-full flex items-center justify-end px-4 ${pathname === "/login" ? "bg-gray-500" : ""} hover:font-bold hover:cursor-pointer`}
          onClick={() => {
            if (isLoggedIn) {
              navigate("/info");
            } else {
              navigate("/login");
            }
          }}
        >
          {isLoggedIn ? localStorage.getItem("MJKRnickname") : "로그인"}
        </button>
      </div>
    </header>
  );
};

export default Header;
