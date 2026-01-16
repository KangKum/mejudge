import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
    <div className="w-full h-full flex flex-col justify-center items-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>회원가입 | 나의 판결</title>
        <meta
          name="description"
          content="나의 판결에 가입하고 실제 판결문을 읽으며 직접 형량을 판단해보세요. 간편한 회원가입으로 지금 바로 시작하세요."
        />
        <link rel="canonical" href="https://mejudge.com/signup" />
      </Helmet>
      <div className="blankSpace w-full h-15"></div>
      <form
        onSubmit={handleSignup}
        className="w-[90%] md:w-[500px] flex flex-col justify-center items-center p-6 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)'
        }}
      >
        <input
          type="text"
          placeholder="아이디"
          className="mb-4 p-3 rounded-lg w-full md:w-[250px] transition-all duration-150"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
          value={id}
          onChange={(e) => setId(e.target.value)}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="mb-4 p-3 rounded-lg w-full md:w-[250px] transition-all duration-150"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="mb-4 p-3 rounded-lg w-full md:w-[250px] transition-all duration-150"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
        />
        <input
          type="text"
          placeholder="닉네임"
          className="mb-4 p-3 rounded-lg w-full md:w-[250px] transition-all duration-150"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            setShowAlertText(true);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            setShowAlertText(false);
          }}
        />
        {showAlertText ? (
          <div className="h-6 text-sm mb-6 cursor-default" style={{ color: 'var(--text-secondary)' }}>
            부적절한 닉네임은 이용에 제약을 받을 수 있습니다.
          </div>
        ) : (
          <div className="h-6 text-sm mb-6 cursor-default"></div>
        )}
        <button type="submit" className="btn-primary w-full md:w-[250px]">
          회원가입
        </button>
      </form>
    </div>
  );
};
export default Signup;
