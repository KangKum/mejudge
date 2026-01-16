import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MdGavel } from "react-icons/md";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

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
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
  const deleteAccount = async () => {
    const res = await fetch(`${apiUrl}/api/users/delete-account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
      },
      body: JSON.stringify({
        confirmPassword,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      localStorage.removeItem("MJKRtoken");
      localStorage.removeItem("MJKRnickname");
      alert("계정이 성공적으로 삭제되었습니다.");
      navigate("/");
    } else {
      alert(data.message || "계정 삭제에 실패했습니다.");
    }
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

  useEffect(() => {
    //현재 로그인한 유저가 관리자인지 확인
    const checkAdmin = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${apiUrl}/api/check-admin`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
          },
        });
        const data = await res.json();
        if (res.status === 200 && data.isAdmin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    checkAdmin();
  }, [userId]);
  return (
    <div className="flex flex-col h-full items-center cursor-default" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>마이페이지 | 나의 판결</title>
        <meta
          name="description"
          content="나의 판결 활동 내역을 확인하세요. 선고한 사건 수, 작성한 댓글, 받은 좋아요와 싫어요를 한눈에 볼 수 있습니다."
        />
        <link rel="canonical" href="https://mejudge.com/info" />
      </Helmet>
      <div className="blankSpace w-full h-20 md:h-45"></div>
      <div className="flex flex-col items-center w-[45%] md:w-[35%]">
        <div className="w-full md:h-30 flex flex-col md:flex-row md:justify-between gap-3">
          <div className="card w-full md:w-[23%] h-[70px] md:h-full flex flex-row md:flex-col text-xl">
            <div className="md:w-full w-[50%] md:h-[50%] h-full flex justify-center items-center">
              <MdGavel size={30} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div
              className="md:w-full w-[50%] md:h-[50%] h-full flex justify-center items-center"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
            >
              {judgeCases}건
            </div>
          </div>

          <div className="card w-full md:w-[23%] h-[70px] md:h-full flex flex-row md:flex-col text-xl">
            <div className="md:w-full w-[50%] md:h-[50%] h-full flex justify-center items-center">
              <FaCommentAlt size={28} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div
              className="md:w-full w-[50%] md:h-[50%] h-full flex justify-center items-center"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
            >
              {commentCount}개
            </div>
          </div>

          <div className="card w-full md:w-[23%] h-[70px] md:h-full flex flex-row md:flex-col text-xl">
            <div className="md:w-full w-[50%] md:h-[50%] h-full flex justify-center items-center">
              <FaThumbsUp size={28} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div
              className="md:w-full w-[50%] md:h-[50%] h-full flex justify-center items-center"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
            >
              {totalLikes}개
            </div>
          </div>

          <div className="card w-full md:w-[23%] h-[70px] md:h-full flex flex-row md:flex-col text-xl">
            <div className="md:w-full w-[50%] md:h-[50%] h-full flex justify-center items-center">
              <FaThumbsDown size={28} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div
              className="md:w-full w-[50%] md:h-[50%] h-full flex justify-center items-center"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
            >
              {totalDislikes}개
            </div>
          </div>

          {isAdmin && (
            <div className="card w-full md:w-[23%] h-[70px] md:h-full flex flex-row md:flex-col text-xl cursor-pointer">
              <div
                className="md:w-full w-full h-full flex justify-center items-center transition-all duration-150"
                style={{ color: 'var(--accent-primary)' }}
                onClick={() => navigate("/master20251208")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.fontWeight = 'normal';
                }}
              >
                사건등록
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="blankSpace w-full h-15 md:h-40"></div>
      <button
        className="btn-primary px-6 py-2"
        onClick={() => {
          localStorage.removeItem("MJKRtoken");
          localStorage.removeItem("MJKRnickname");
          navigate("/");
        }}
      >
        로그아웃
      </button>
      <div className="blankSpace w-full h-10"></div>
      <button
        className="text-sm transition-all duration-150"
        style={{ color: 'var(--text-tertiary)' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
        onClick={() => setShowPasswordChange(!showPasswordChange)}
      >
        비밀번호 변경
      </button>
      {showPasswordChange && (
        <div className="flex flex-col items-center mt-4 gap-2">
          <input
            type="password"
            placeholder="기존 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="p-3 mb-2 rounded-lg w-[250px] transition-all duration-150"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-3 mb-2 rounded-lg w-[250px] transition-all duration-150"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
          />
          <button className="btn-secondary w-[250px]" onClick={async () => changePW()}>
            변경
          </button>
        </div>
      )}
      <div className="blankSpace w-full h-5"></div>
      {!showPasswordChange && (
        <button
          className="text-sm transition-all duration-150"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          onClick={() => setShowConfirmDelete(!showConfirmDelete)}
        >
          계정탈퇴
        </button>
      )}
      {showConfirmDelete && (
        <div className="flex flex-col items-center mt-4 gap-2">
          <input
            type="password"
            placeholder="비밀번호"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 mb-2 rounded-lg w-[250px] transition-all duration-150"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
          />
          <button className="btn-secondary w-[250px]" onClick={async () => deleteAccount()}>
            탈퇴
          </button>
        </div>
      )}
    </div>
  );
};
export default Info;
