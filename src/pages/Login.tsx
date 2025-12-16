import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem("MJKRtoken", data.token); // data.token은 서버에서 받은 JWT
        localStorage.setItem("MJKRnickname", data.nickname);
        if (data.isMJAdmin) {
          navigate("/master20251208");
        } else {
          navigate("/main");
        }
      } else if (res.status === 400 || res.status === 401) {
        localStorage.removeItem("MJKRtoken");
        localStorage.removeItem("MJKRnickname");
        alert(data.message || "로그인 실패");
      }
    } catch (error) {
      localStorage.removeItem("MJKRtoken");
      localStorage.removeItem("MJKRnickname");
      alert("Failed to fetch worry. Status:" + error);
      navigate("/");
    }
  };
  const validate = () => {
    if (id.trim() === "") {
      alert("아이디를 입력해주세요.");
      return false;
    } else if (password.trim() === "") {
      alert("비밀번호를 입력해주세요.");
      return false;
    }
    return true;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center overflow-y-hidden">
      <div className="blankSpace w-full h-60"></div>
      <form onSubmit={handleLogin} className="w-[500px] h-[200px] flex flex-col items-center">
        <input type="text" placeholder="아이디" className="mb-4 p-2 border rounded w-[250px]" value={id} onChange={(e) => setId(e.target.value)} />
        <input
          type="password"
          placeholder="비밀번호"
          className="mb-4 p-2 border rounded w-[250px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-[250px]">
          로그인
        </button>
      </form>
      <button onClick={() => navigate("/signup")}>회원가입</button>
    </div>
  );
};
export default Login;
