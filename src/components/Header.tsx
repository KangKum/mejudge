import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLoggedIn = !!localStorage.getItem("MJKRtoken");

  return (
    <header
      className="w-full h-[5%] md:h-[6%] flex justify-between md:justify-center items-center border-b"
      style={{
        backgroundColor: 'var(--bg-header)',
        color: 'var(--text-primary)',
        borderBottomColor: 'var(--border-primary)'
      }}
    >
      <div className="buttonsPart md:w-[90%] h-full flex justify-center items-center ml-3 md:gap-2">
        <button
          className={`md:flex-none w-16 md:ml-34 md:w-[100px] h-full border-b-2 transition-all duration-150 ${
            pathname === "/" ? "font-semibold" : "font-normal"
          }`}
          style={{
            borderBottomColor: pathname === "/" ? 'var(--accent-primary)' : 'transparent',
            color: pathname === "/" ? 'var(--text-emphasis)' : 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/") {
              e.currentTarget.style.borderBottomColor = 'var(--border-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/") {
              e.currentTarget.style.borderBottomColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
          onClick={() => navigate("/")}
        >
          홈
        </button>
        <button
          className={`md:flex-none w-16 md:w-[100px] h-full border-b-2 transition-all duration-150 ${
            pathname === "/main" ? "font-semibold" : "font-normal"
          }`}
          style={{
            borderBottomColor: pathname === "/main" ? 'var(--accent-primary)' : 'transparent',
            color: pathname === "/main" ? 'var(--text-emphasis)' : 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/main") {
              e.currentTarget.style.borderBottomColor = 'var(--border-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/main") {
              e.currentTarget.style.borderBottomColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
          onClick={() => navigate("/main")}
        >
          사건
        </button>
        <button
          className={`md:flex-none w-16 md:w-[100px] h-full border-b-2 transition-all duration-150 ${
            pathname === "/rank" ? "font-semibold" : "font-normal"
          }`}
          style={{
            borderBottomColor: pathname === "/rank" ? 'var(--accent-primary)' : 'transparent',
            color: pathname === "/rank" ? 'var(--text-emphasis)' : 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/rank") {
              e.currentTarget.style.borderBottomColor = 'var(--border-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/rank") {
              e.currentTarget.style.borderBottomColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
          onClick={() => navigate("/rank")}
        >
          랭킹
        </button>
      </div>
      <div className="loginPart md:w-[10%] h-full flex justify-end items-center">
        <button
          className="btn-primary flex items-center justify-end mr-4 rounded-lg text-sm md:text-base px-3 py-1.5 font-medium"
          onClick={() => {
            if (isLoggedIn) {
              navigate("/info");
            } else {
              navigate("/login");
            }
          }}
        >
          {isLoggedIn ? (
            <span>
              {localStorage.getItem("MJKRnickname")}
            </span>
          ) : (
            "로그인"
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
