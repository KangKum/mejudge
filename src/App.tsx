import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CasePage from "./pages/CasePage";
import Rank from "./pages/Rank";
import Info from "./pages/Info";
import Master from "./pages/Master";
import { STORAGE_KEYS } from "./constants";

function App() {
  useEffect(() => {
    // 토큰 유효성 검증
    const validateToken = () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) return;

      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000; // JWT exp는 초 단위

        // 토큰이 만료되었으면 localStorage 클리어
        if (decoded.exp < currentTime) {
          console.log("토큰이 만료되었습니다. 로그아웃 처리합니다.");
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.NICKNAME);
        }
      } catch (error) {
        // 토큰 디코딩 실패 시 (잘못된 토큰) localStorage 클리어
        console.error("토큰 검증 실패:", error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.NICKNAME);
      }
    };

    validateToken();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/main" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/case/:caseId" element={<CasePage />} />
            <Route path="/rank" element={<Rank />} />
            <Route path="/info" element={<Info />} />
            <Route path="/master20251208" element={<Master />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
