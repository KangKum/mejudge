import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [showAlertText, setShowAlertText] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password, nickname }),
      });

      const data = await res.json();
      if (res.status === 200) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else if (res.status === 400 || res.status === 401 || res.status === 402 || res.status === 403 || res.status === 404) {
        alert(data.message || "회원가입 실패");
      } else {
        alert(data.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("Failed to fetch worry. Status:", error);
    }
  };
  const validate = () => {
    const idRegex = /^[a-zA-Z0-9]{4,16}$/;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (!idRegex.test(id)) {
      alert("아이디는 4~16자의 영문/숫자만 가능합니다.");
      return false;
    }
    if (!pwRegex.test(password)) {
      alert("비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.");
      return false;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (nickname.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return false;
    }
    return true;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="blankSpace w-full h-30"></div>
      <form onSubmit={handleSignup} className="w-[500px] h-[400px] flex flex-col justify-center items-center">
        <input type="text" placeholder="아이디" className="mb-4 p-2 border rounded w-[250px]" value={id} onChange={(e) => setId(e.target.value)} />
        <input
          type="password"
          placeholder="비밀번호"
          className="mb-4 p-2 border rounded w-[250px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="mb-4 p-2 border rounded w-[250px]"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="닉네임"
          className="mb-4 p-2 border rounded w-[250px]"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onFocus={() => setShowAlertText(true)}
          onBlur={() => setShowAlertText(false)}
        />
        <div className={`text-sm mb-10 cursor-default ${showAlertText ? "text-white" : "text-black"}`}>부적절한 닉네임은 이용에 제약을 받을 수 있습니다.</div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-[250px]">
          회원가입
        </button>
      </form>
    </div>
  );
};
export default Signup;
