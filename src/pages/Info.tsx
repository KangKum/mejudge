import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Info = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("MJKRtoken");
  const { userId } = token ? jwtDecode<{ userId: string }>(token) : {};
  const [judgeCases, setJudgeCases] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalDislikes, setTotalDislikes] = useState<number>(0);
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const changePW = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${apiUrl}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.status === 400) {
        alert(data.message || "비밀번호 변경에 실패했습니다.");
        return;
      } else if (res.status === 401) {
        alert(data.message || "인증에 실패했습니다. 다시 로그인해주세요.");
        return;
      }
      if (res.status === 200) {
        alert(data.message || "비밀번호가 성공적으로 변경되었습니다.");
        setShowPasswordChange(false);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        alert(data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };
  const validate = () => {
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (currentPassword.trim() === "") {
      alert("기존 비밀번호를 입력해주세요.");
      return false;
    }
    if (newPassword.trim() === "") {
      alert("새 비밀번호를 입력해주세요.");
      return false;
    }
    if (!pwRegex.test(newPassword)) {
      alert("비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.");
      return false;
    }
    if (currentPassword === newPassword) {
      alert("기존 비밀번호와 새 비밀번호가 같습니다.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchJudgeCases = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/judgements/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
          },
        });
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setJudgeCases(data);
        }
      } catch (error) {
        console.error("Error fetching judge cases:", error);
      }
    };
    fetchJudgeCases();
  }, [userId]);

  useEffect(() => {
    const fetchCommentsById = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/comments/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
          },
        });
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setCommentCount(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchCommentsById();
  }, [userId]);

  useEffect(() => {
    const fetchTotalLike = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/comment/likes/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTotalLikes(data);
        }
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };
    fetchTotalLike();
  }, [userId]);

  useEffect(() => {
    const fetchTotalDislike = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/comment/dislikes/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTotalDislikes(data);
        }
      } catch (error) {
        console.error("Error fetching total dislikes:", error);
      }
    };
    fetchTotalDislike();
  }, [userId]);

  return (
    <div className="flex flex-col items-center cursor-default">
      <div className="blankSpace w-full h-30"></div>
      <div className="flex flex-col items-center w-[40%] md:w-[15%]">
        <div className="w-full h-14 text-xl flex justify-center font-bold">{localStorage.getItem("MJKRnickname")}</div>
        <div className="w-full flex text-xl h-12">
          <div className="w-[60%] h-full flex justify-start">선고 완료</div>
          <div className="w-[40%] h-full flex justify-end">{judgeCases}건</div>
        </div>
        <div className="w-full flex text-xl h-12">
          <div className="w-[60%] h-full flex justify-start">내 댓글</div>
          <div className="w-[40%] h-full flex justify-end">{commentCount}개</div>
        </div>
        <div className="w-full flex text-xl h-12">
          <div className="w-[60%] h-full flex justify-start">받은 좋아요</div>
          <div className="w-[40%] h-full flex justify-end">{totalLikes}개</div>
        </div>
        <div className="w-full flex text-xl h-12">
          <div className="w-[60%] h-full flex justify-start">받은 싫어요</div>
          <div className="w-[40%] h-full flex justify-end">{totalDislikes}개</div>
        </div>
      </div>
      <div className="blankSpace w-full h-10"></div>
      <button className="bg-gray-500 p-2" onClick={() => setShowPasswordChange(true)}>
        비밀번호 변경
      </button>
      {showPasswordChange && (
        <div className="flex flex-col items-center mt-4">
          <input
            type="password"
            placeholder="기존 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border p-2 mb-2"
          />
          <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border p-2 mb-2" />
          <button onClick={async () => changePW()}>변경</button>
        </div>
      )}
      <div className="blankSpace w-full h-10"></div>
      <button
        className="bg-gray-500 p-2"
        onClick={() => {
          localStorage.removeItem("MJKRtoken");
          localStorage.removeItem("MJKRnickname");
          navigate("/");
        }}
      >
        로그아웃
      </button>
    </div>
  );
};
export default Info;
