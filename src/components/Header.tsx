import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLoggedIn = !!localStorage.getItem("MJKRtoken");

  return (
    <header className="w-full h-[6%] flex justify-between md:justify-center items-center bg-black text-white">
      <div className="buttonsPart md:w-[90%] h-full flex justify-center items-center ml-3">
        <button
          className={`md:flex-none w-16 md:ml-34 md:w-[100px] h-full border-black border-b-2 mr-1 ${
            pathname === "/" ? "font-bold border-b-2 border-white" : ""
          } ${pathname === "/" ? "" : "hover:border-b-2 hover:border-white/50"} `}
          onClick={() => navigate("/")}
        >
          홈
        </button>
        <button
          className={`md:flex-none w-16 md:w-[100px] h-full border-black border-b-2 mr-1 ${pathname === "/main" ? "font-bold border-b-2 border-white" : ""} ${
            pathname === "/main" ? "" : "hover:border-b-2 hover:border-white/50"
          } `}
          onClick={() => navigate("/main")}
        >
          사건
        </button>
        <button
          className={`md:flex-none w-16 md:w-[100px] h-full border-black border-b-2 mr-1 ${pathname === "/rank" ? "font-bold border-b-2 border-white" : ""} ${
            pathname === "/rank" ? "" : "hover:border-b-2 hover:border-white/50"
          }`}
          onClick={() => navigate("/rank")}
        >
          랭킹
        </button>
      </div>
      <div className="loginPart md:w-[10%] h-full flex justify-end items-center">
        <button
          className={`flex items-center justify-end mr-4 rounded-lg text-sm md:text-base bg-blue-600 px-2 py-1 ${
            pathname === "/login" || pathname === "/info" ? "font-bold" : ""
          } hover:font-bold`}
          onClick={() => {
            if (isLoggedIn) {
              navigate("/info");
            } else {
              navigate("/login");
            }
          }}
        >
          {isLoggedIn ? <span className="font-bold">{localStorage.getItem("MJKRnickname")}</span> : "로그인"}
        </button>
      </div>
    </header>
  );
};

export default Header;
