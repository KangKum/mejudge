import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { FaMedal } from "react-icons/fa";
import { MdGavel } from "react-icons/md";
import { Helmet } from "react-helmet-async";
import { MEDAL_THRESHOLD, INITIAL_COMMENT_LIMIT, COMMENT_LOAD_INCREMENT, STORAGE_KEYS, SENTENCE_LIMITS, MAX_COMMENT_LENGTH } from "../constants";

interface ICaseItem {
  _id: string;
  caseNumber: number;
  caseTitle: string;
  caseText: string;
  caseResult: string;
  caseResult2: string;
}
interface IComment {
  _id: string;
  userNickname: string;
  comment: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
}

const CasePage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const imgUrl = import.meta.env.VITE_IMG_BASEURL;
  const navigate = useNavigate();
  const { caseId } = useParams(); // id가 바로 caseItem._id 값
  const [caseData, setCaseData] = useState<ICaseItem | null>(null);
  const [isSentenced, setIsSentenced] = useState(false);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [suspend, setSuspend] = useState(0);
  const [mode, setMode] = useState(0); // 0: 징역형, 1: 벌금형
  const [fine, setFine] = useState(0);
  const Ymax = SENTENCE_LIMITS.YEAR_MAX;
  const Ymin = SENTENCE_LIMITS.YEAR_MIN;
  const Mmax = SENTENCE_LIMITS.MONTH_MAX;
  const Mmin = SENTENCE_LIMITS.MONTH_MIN;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Array<IComment>>([]);
  const [commentLimit, setCommentLimit] = useState(INITIAL_COMMENT_LIMIT);
  const [commentCount, setCommentCount] = useState(0);
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const { userId } = token ? jwtDecode<{ userId: string }>(token) : {};
  const userNickname = localStorage.getItem(STORAGE_KEYS.NICKNAME) || "";
  const caseNumber = caseData?.caseNumber;
  const [latestCaseNumber, setLatestCaseNumber] = useState<number>(0);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchCase = async () => {
    const res = await fetch(`${apiUrl}/api/case/${caseId}`, {
      method: "GET",
    });
    const data = await res.json();
    setCaseData(data);
  };
  const deleteCase = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/deleteCase/${caseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}` },
      });
      if (res.status === 200) {
        alert("사건이 삭제되었습니다.");
        navigate("/main");
      } else {
        alert("사건 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };
  const makeComment = async () => {
    if (comment.trim() === "" || isCommenting) return;
    setIsCommenting(true);
    const res = await fetch(`${apiUrl}/api/comment/${userId}/${caseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.TOKEN)}` },
      body: JSON.stringify({ userNickname, comment }),
    });
    if (res.ok) {
      setComment("");
      alert("댓글이 등록되었습니다.");
      fetchComment();
      fetchAllComments();
    } else {
      alert("댓글 전송 실패");
    }
    setIsCommenting(false);
  };
  const fetchComment = async () => {
    if (!caseId) return;
    try {
      const res = await fetch(`${apiUrl}/api/comment/${caseId}?limit=${commentLimit}`, {
        method: "GET",
      });
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const fetchAllComments = async () => {
    if (!caseId) return;
    try {
      const res = await fetch(`${apiUrl}/api/comment/count/${caseId}`, {
        method: "GET",
      });
      const data = await res.json();
      setCommentCount(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const deleteComment = async ({ comment }: { comment: IComment }) => {
    try {
      const res = await fetch(`${apiUrl}/api/deleteComment/${comment._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}` },
      });
      if (res.status === 200) {
        alert("댓글이 삭제되었습니다.");
        fetchComment();
        // fetchAllComments();
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const changeNickname = async ({ comment }: { comment: IComment }) => {
    const res = await fetch(`${apiUrl}/api/change-nickname`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
      },
      body: JSON.stringify({
        nickname: comment?.userNickname,
      }),
    });
    if (res.status === 200) {
      alert("닉네임이 변경되었습니다.");
    } else if (res.status === 404) {
      alert("해당 닉네임의 유저를 찾을 수 없습니다.");
    } else {
      alert("닉네임 변경에 실패했습니다.");
    }
  };
  const formattedDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");

    const formatted = `${year}. ${month}. ${day} ${hour}:${min}`;
    return formatted;
  }, []);
  const makeLike = useCallback(async ({ comment }: { comment: IComment }) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    //프론트 먼저 반영
    setComments((prev) =>
      prev.map((c) => (c._id === comment._id ? { ...c, likes: c.likes.includes(userId) ? c.likes.filter((id) => id !== userId) : [...c.likes, userId] } : c))
    );

    //좋아요 기능 구현
    try {
      const res = await fetch(`${apiUrl}/api/like/${comment._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.TOKEN)}` },
        body: JSON.stringify({ userId }),
      });
      if (res.status !== 200) {
        //실패 시 프론트 롤백
        fetchComment();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  }, [userId, apiUrl, navigate]);
  const makeDislike = useCallback(async ({ comment }: { comment: IComment }) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    //프론트 먼저 반영
    setComments((prev) =>
      prev.map((c) =>
        c._id === comment._id ? { ...c, dislikes: c.dislikes.includes(userId) ? c.dislikes.filter((id) => id !== userId) : [...c.dislikes, userId] } : c
      )
    );
    try {
      const res = await fetch(`${apiUrl}/api/dislike/${comment._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.TOKEN)}` },
        body: JSON.stringify({ userId }),
      });
      if (res.status !== 200) {
        //실패 시 프론트 롤백
        fetchComment();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  }, [userId, apiUrl, navigate]);
  const pastCase = async () => {
    if (caseNumber === 1) return;
    try {
      const res = await fetch(`${apiUrl}/api/pastCase/${caseNumber}`, {
        method: "GET",
      });
      const previousCaseId = await res.json();
      if (!previousCaseId) {
        alert("이전 사건이 없습니다.");
        return;
      } else if (res.status === 404) {
        alert("이전 사건이 없습니다.");
        return;
      }
      navigate(`/case/${previousCaseId}`);
    } catch (error) {
      console.error("Error fetching previous case:", error);
    }
  };
  const nextCase = async () => {
    if (caseNumber === latestCaseNumber) return;
    try {
      const res = await fetch(`${apiUrl}/api/nextCase/${caseNumber}`, {
        method: "GET",
      });
      const previousCaseId = await res.json();
      if (!previousCaseId) {
        alert("다음 사건이 없습니다.");
        return;
      } else if (res.status === 404) {
        alert("다음 사건이 없습니다.");
        return;
      }
      navigate(`/case/${previousCaseId}`);
    } catch (error) {
      console.error("Error fetching previous case:", error);
    }
  };
  const verdict = async () => {
    if (isSentenced) return;
    if (!userId) {
      alert("로그인이 필요합니다.");
      localStorage.removeItem("MJKRtoken");
      localStorage.removeItem("MJKRnickname");
      navigate("/login");
      return;
    }
    if (mode === 0 && year === 0 && month === 0) {
      alert("형량을 정해주세요.");
      return;
    }
    if (mode === 1 && fine === 0) {
      alert("벌금을 정해주세요.");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/judgement/${userId}/${caseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
        },
        body: JSON.stringify({ mode, year, month, suspend, fine }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("선고가 완료되었습니다.");
        setIsSentenced(true);
      } else {
        alert(data.message || "선고 실패");
      }
    } catch (error) {
      console.error("Error submitting sentence:", error);
    }
  };
  const markAsRead = async () => {
    if (!userId || !caseId) return;
    try {
      await fetch(`${apiUrl}/api/markAsRead/${userId}/${caseId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}` },
      });
    } catch (error) {
      console.error("Error marking case as read:", error);
    }
  };
  const fetchPreviousSentence = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/judgement/${userId}/${caseId}`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.exists) {
        // 선고 기록이 있으면 data에 값이 있음
        if (data && typeof data.judgement.mode !== "undefined") {
          setIsSentenced(true);
          setMode(data.judgement.mode);
          setYear(data.judgement.year);
          setMonth(data.judgement.month);
          setSuspend(data.judgement.suspend);
          setFine(typeof data.judgement.fine === "number" ? data.judgement.fine : 0);
        } else {
          // 선고 기록이 없으면 기본값으로 초기화
          setIsSentenced(false);
          setMode(0);
          setYear(0);
          setMonth(0);
          setSuspend(0);
          setFine(0);
        }
      } else {
        // 요청 실패 시에도 기본값으로 초기화
        setIsSentenced(false);
        setMode(0);
        setYear(0);
        setMonth(0);
        setFine(0);
      }
    } catch (error) {
      console.error("Error fetching previous sentence:", error);
    }
  };

  useEffect(() => {
    if (!caseId) return;
    fetchCase();
    fetchAllComments();
  }, [caseId]);

  useEffect(() => {
    if (!userId || !caseId) return;
    fetchPreviousSentence();
  }, [userId, caseId]);

  useEffect(() => {
    fetchComment();
  }, [caseId, commentLimit]);

  //마지막 케이스 넘버 가져오기
  useEffect(() => {
    const fetchLatestCaseNumber = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/cases/latest`, {
          method: "GET",
        });
        const data = await res.json();
        if (res.status === 200) {
          //마지막 케이스 넘버가져오기
          setLatestCaseNumber(data);
        }
      } catch (error) {
        console.error("Error fetching latest case number:", error);
      }
    };
    fetchLatestCaseNumber();
  }, [caseData]);

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

  useEffect(() => {
    if ((year >= SENTENCE_LIMITS.SUSPEND_MIN_REQUIREMENT_YEARS && month !== 0) || (year === 0 && month === 0) || year >= SENTENCE_LIMITS.SUSPEND_MAX_YEARS) {
      setSuspend(0);
    }
  }, [year, month]);

  useEffect(() => {
    //'읽음'처리
    markAsRead();
  }, [userId, caseId]);

  // 실제 스크롤이 발생하는 div를 맨 위로 이동
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [caseId]);

  return (
    <div className="w-full h-dvh" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Helmet>
        <title>{caseData ? `${caseData.caseTitle} | 나의 판결` : "사건 상세 | 나의 판결"}</title>
        <meta
          name="description"
          content={
            caseData
              ? `${caseData.caseTitle} 사건의 판결문을 읽고 직접 형량을 판단해보세요. 실제 판결과 비교할 수 있습니다.`
              : "실제 판결문을 읽고 직접 형량을 판단해보세요."
          }
        />
        <link rel="canonical" href={`https://mejudge.com/case/${caseId}`} />
      </Helmet>

      <div ref={scrollRef} className="w-[90%] md:w-[95%] mx-auto h-full overflow-y-auto overscroll-contain touch-pan-y">
        <div className="w-full md:w-[50%] mx-auto h-8 mb-2 flex justify-between items-center mt-4">
          <button
            className={`text-sm md:text-base transition-all duration-150 ${caseNumber === 1 ? "" : "hover:font-semibold"}`}
            style={{
              color: caseNumber === 1 ? "var(--text-tertiary)" : "var(--text-secondary)",
              cursor: caseNumber === 1 ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (caseNumber !== 1) e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              if (caseNumber !== 1) e.currentTarget.style.color = "var(--text-secondary)";
            }}
            onClick={async () => pastCase()}
          >
            이전 사건
          </button>
          {isAdmin && (
            <button
              className="text-sm md:text-base font-bold flex justify-center items-center"
              style={{ color: "var(--status-danger)" }}
              onClick={() => {
                confirm("정말로 사건을 삭제하시겠습니까? 삭제된 사건은 복구할 수 없습니다.") && deleteCase();
              }}
            >
              DELETE
            </button>
          )}
          <button
            className={`text-sm md:text-base transition-all duration-150 ${caseNumber === latestCaseNumber ? "" : "hover:font-semibold"}`}
            style={{
              color: caseNumber === latestCaseNumber ? "var(--text-tertiary)" : "var(--text-secondary)",
              cursor: caseNumber === latestCaseNumber ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (caseNumber !== latestCaseNumber) e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              if (caseNumber !== latestCaseNumber) e.currentTarget.style.color = "var(--text-secondary)";
            }}
            onClick={async () => nextCase()}
          >
            다음 사건
          </button>
        </div>
        <div
          className="titlePart w-full md:w-[50%] mx-auto h-8 flex justify-center items-center font-bold px-2 py-4 mb-2 text-xl cursor-default"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text-emphasis)" }}
        >
          {caseData?.caseTitle}
        </div>
        <div className="webtoonPart w-full md:w-[50%] mx-auto rounded-lg overflow-hidden">
          {caseData?.caseNumber && (
            <img
              src={`${imgUrl}/cases/${caseData.caseNumber}/case${caseData.caseNumber}_1.webp`}
              alt="case image"
              loading="lazy"
              style={{ border: "1px solid var(--border-primary)" }}
            />
          )}
        </div>
        <div className="blankSpace h-4"></div>
        <div
          className="textPart w-full md:w-[50%] mx-auto whitespace-pre-line text-lg leading-relaxed"
          style={{ color: "var(--text-primary)", lineHeight: "1.75" }}
        >
          {caseData?.caseText}
        </div>
        <div className="commentPart w-full md:w-[50%] mx-auto mt-6">
          <div className="commentUpPart h-8 text-lg my-2 font-semibold" style={{ color: "var(--text-emphasis)" }}>
            댓글({commentCount})
          </div>
          <div
            className="commentMiddlePart flex flex-col items-center p-2 mb-4 rounded-lg"
            style={{
              border: "1px solid var(--border-primary)",
              backgroundColor: "var(--bg-secondary)",
            }}
          >
            <div className="idPart w-full mb-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {userNickname}
            </div>
            <textarea
              className={`textPart w-full h-24 mx-auto p-2 rounded ${userId ? "" : "cursor-default"}`}
              spellCheck={false}
              placeholder={`${userId ? "댓글을 입력하세요" : "로그인이 필요합니다."}`}
              maxLength={MAX_COMMENT_LENGTH}
              value={comment}
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-primary)",
              }}
              onClick={() => {
                if (!userId) {
                  alert("로그인이 필요합니다.");
                  navigate("/login");
                }
              }}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="buttonPart w-full flex justify-end mt-2">
              <button className="btn-primary py-1.5 px-4 text-sm" onClick={async () => makeComment()}>
                전송
              </button>
            </div>
          </div>
          <div className="commentDownPart">
            {comments.map((comment, index) => (
              <div key={index} className="commentItem flex flex-col px-2 mt-2 pb-2 rounded-lg" style={{ borderBottom: "1px solid var(--border-primary)" }}>
                <div className="commentUser text-sm md:text-base flex">
                  <span className="flex justify-center items-center">
                    {index === 0 && comment.likes.length > MEDAL_THRESHOLD ? (
                      <FaMedal color="#FFD700" size={12} />
                    ) : index === 1 && comment.likes.length > MEDAL_THRESHOLD ? (
                      <FaMedal color="#C0C0C0" size={12} />
                    ) : index === 2 && comment.likes.length > MEDAL_THRESHOLD ? (
                      <FaMedal color="#CD7F32" size={12} />
                    ) : null}
                  </span>
                  <span className="mr-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {comment.userNickname}
                  </span>
                  <span className="text-xs md:text-sm flex items-center" style={{ color: "var(--text-tertiary)" }}>
                    {formattedDate(comment.createdAt)}
                  </span>
                  {isAdmin && (
                    <div>
                      <button
                        className="ml-3 border"
                        style={{ color: "var(--status-danger)" }}
                        onClick={() => {
                          confirm("해당 유저의 닉네임을 변경하시겠습니까?") && changeNickname({ comment });
                        }}
                      >
                        닉변
                      </button>
                      <button
                        className="ml-3 border"
                        style={{ color: "var(--status-danger)" }}
                        onClick={() => {
                          confirm("정말로 댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.") && deleteComment({ comment });
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                <div className="commentText text-sm md:text-base mt-1" style={{ color: "var(--text-primary)" }}>
                  {comment.comment}
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    className={`p-1 flex justify-center items-center rounded transition-all duration-150`}
                    style={{
                      border: "1px solid var(--border-primary)",
                      backgroundColor: userId && comment.likes && comment.likes.includes(userId) ? "var(--accent-subtle)" : "transparent",
                      color: userId && comment.likes && comment.likes.includes(userId) ? "var(--accent-primary)" : "var(--text-secondary)",
                    }}
                    onClick={async () => makeLike({ comment })}
                  >
                    <span className="pl-1">
                      <FaThumbsUp />
                    </span>
                    <span className="px-1">{comment.likes ? comment.likes.length : 0}</span>
                  </button>
                  <button
                    className={`p-1 flex justify-center items-center rounded transition-all duration-150`}
                    style={{
                      border: "1px solid var(--border-primary)",
                      backgroundColor: userId && comment.dislikes && comment.dislikes.includes(userId) ? "var(--accent-subtle)" : "transparent",
                      color: userId && comment.dislikes && comment.dislikes.includes(userId) ? "var(--accent-primary)" : "var(--text-secondary)",
                    }}
                    onClick={async () => makeDislike({ comment })}
                  >
                    <span className="pl-1">
                      <FaThumbsDown />
                    </span>
                    <span className="px-1">{comment.dislikes ? comment.dislikes.length : 0}</span>
                  </button>
                </div>
              </div>
            ))}
            <button
              className={`my-2 p-2 flex justify-center items-center gap-2 w-[60%] mx-auto mb-10 rounded-lg transition-all duration-150 ${
                commentCount <= commentLimit ? "hidden" : ""
              }`}
              style={{
                backgroundColor: "transparent",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
              onClick={() => setCommentLimit((prev) => prev + COMMENT_LOAD_INCREMENT)}
            >
              <span>
                <IoIosArrowDown size={18} />
              </span>
            </button>
            {commentCount <= commentLimit ? <div className="h-10 w-full"></div> : null}
          </div>
        </div>
        <div className={`footerPart w-[90%] md:w-[50%] mx-auto pb-2 flex flex-col mt-2 ${isSentenced ? "hidden" : ""}`}>
          <div className="w-[60%] md:w-[50%] mx-auto min-h-8 md:min-h-10 flex justify-center mb-2 rounded-lg overflow-hidden">
            <button
              className={`flex-1 min-h-full font-medium transition-all duration-150`}
              style={{
                backgroundColor: mode === 0 ? "var(--accent-primary)" : "var(--bg-secondary)",
                color: mode === 0 ? "var(--text-emphasis)" : "var(--text-secondary)",
                borderTopLeftRadius: "0.5rem",
                borderBottomLeftRadius: "0.5rem",
              }}
              onClick={() => setMode(0)}
            >
              징역형
            </button>
            <button
              className={`flex-1 min-h-full font-medium transition-all duration-150`}
              style={{
                backgroundColor: mode === 1 ? "var(--accent-primary)" : "var(--bg-secondary)",
                color: mode === 1 ? "var(--text-emphasis)" : "var(--text-secondary)",
                borderTopRightRadius: "0.5rem",
                borderBottomRightRadius: "0.5rem",
              }}
              onClick={() => setMode(1)}
            >
              벌금형
            </button>
          </div>
          {mode === 0 ? (
            <div className="flex flex-col h-40 md:h-44">
              <div
                className="w-full h-12 md:h-16 flex justify-center items-center text-xl md:text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)", color: "var(--text-emphasis)" }}
              >
                {year === 50 && month === 11 ? "무기징역" : year > 0 ? "징역" + " " + year + "년" + " " + month + "개월" : "징역" + " " + month + "개월"}
              </div>
              <div className="w-[95%] h-18 md:h-18 flex flex-col mx-auto gap-3 md:gap-5 justify-center">
                <input
                  type="range"
                  min={Ymin}
                  max={Ymax}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  style={{ accentColor: "var(--accent-primary)" }}
                />
                <input
                  type="range"
                  min={Mmin}
                  max={Mmax}
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  style={{ accentColor: "var(--accent-primary)" }}
                />
              </div>
              <div
                className={`h-10 md:h-10 mt-4 w-full md:w-[95%] mx-auto flex flex-row my-auto`}
                style={{
                  color: (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4 ? "var(--text-tertiary)" : "var(--text-primary)",
                }}
              >
                <div className="w-[23%] h-full flex md:justify-center items-center text-sm md:text-lg" style={{ whiteSpace: "nowrap" }}>
                  집행유예
                </div>
                <div className="w-[77%] h-full flex justify-center items-center text-sm md:text-base">
                  <div className="w-full h-[95%] flex justify-center mx-auto gap-2">
                    {[1, 2, 3, 4, 5].map((years) => (
                      <button
                        key={years}
                        disabled={isSentenced || (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4}
                        className={`btn-secondary rounded p-1 w-[20%] h-[80%] md:h-full my-auto flex justify-center items-center`}
                        style={{
                          backgroundColor: suspend === years ? "var(--accent-primary)" : "var(--bg-secondary)",
                          color: suspend === years ? "var(--text-emphasis)" : "var(--text-primary)",
                          opacity: (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4 ? 0.5 : 1,
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => {
                          if (suspend === years) {
                            setSuspend(0);
                          } else {
                            setSuspend(years);
                          }
                        }}
                      >
                        {years}년
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center h-40 md:h-44">
              <div
                className="w-full h-12 md:h-16 flex justify-center items-center text-xl md:text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)", color: "var(--text-emphasis)" }}
              >
                벌금 {(fine ?? 0).toLocaleString()}원
              </div>
              <div className="w-[98%] h-14 md:h-14 flex justify-center items-center gap-1 md:gap-2 mb-1">
                <button
                  className="btn-secondary flex-1 text-xs md:text-base h-10 rounded"
                  style={{ whiteSpace: "nowrap", minWidth: "0" }}
                  onClick={() => setFine((prev) => prev + 100000000)}
                >
                  +1억
                </button>
                <button
                  className="btn-secondary flex-1 text-xs md:text-base h-10 rounded"
                  style={{ whiteSpace: "nowrap", minWidth: "0" }}
                  onClick={() => setFine((prev) => prev + 10000000)}
                >
                  +1000만원
                </button>
                <button
                  className="btn-secondary flex-1 text-xs md:text-base h-10 rounded"
                  style={{ whiteSpace: "nowrap", minWidth: "0" }}
                  onClick={() => setFine((prev) => prev + 1000000)}
                >
                  +100만원
                </button>
                <button
                  className="btn-secondary flex-1 text-xs md:text-base h-10 rounded"
                  style={{ whiteSpace: "nowrap", minWidth: "0" }}
                  onClick={() => setFine((prev) => prev + 100000)}
                >
                  +10만원
                </button>
              </div>
              <div className="w-[98%] h-14 md:h-14 flex justify-center items-center gap-1 md:gap-2">
                <button
                  className="btn-secondary flex-1 text-xs md:text-base h-10 rounded"
                  style={{ whiteSpace: "nowrap", minWidth: "0" }}
                  onClick={() => setFine((prev) => (prev - 100000000 < 0 ? 0 : prev - 100000000))}
                >
                  -1억
                </button>
                <button
                  className="btn-secondary flex-1 text-xs md:text-base h-10 rounded"
                  style={{ whiteSpace: "nowrap", minWidth: "0" }}
                  onClick={() => setFine((prev) => (prev - 10000000 < 0 ? 0 : prev - 10000000))}
                >
                  -1000만원
                </button>
                <button
                  className="btn-secondary flex-1 text-xs md:text-base h-10 rounded"
                  style={{ whiteSpace: "nowrap", minWidth: "0" }}
                  onClick={() => setFine((prev) => (prev - 1000000 < 0 ? 0 : prev - 1000000))}
                >
                  -100만원
                </button>
                <button
                  className="btn-secondary flex-1 text-xs md:text-base h-10 rounded"
                  style={{ whiteSpace: "nowrap", minWidth: "0" }}
                  onClick={() => setFine((prev) => (prev - 100000 < 0 ? 0 : prev - 100000))}
                >
                  -10만원
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="sentencePart flex justify-center items-center w-[90%] md:w-[50%] mx-auto h-45">
          {isSentenced ? (
            <div className="w-[90%] md:w-[50%] flex gap-10">
              <div
                className="flex flex-col w-[50%] p-2 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-secondary)",
                }}
              >
                <div
                  className="w-full text-center pb-2 text-xl font-semibold"
                  style={{
                    borderBottom: "1px solid var(--border-primary)",
                    color: "var(--text-emphasis)",
                  }}
                >
                  실제 판결
                </div>
                <div className="w-full text-center py-2" style={{ color: "var(--text-primary)" }}>
                  {caseData?.caseResult}
                </div>
                {caseData?.caseResult2 !== "" && (
                  <div className="w-full text-center py-2" style={{ color: "var(--text-secondary)" }}>
                    집행유예 {caseData?.caseResult2}
                  </div>
                )}
              </div>
              <div className="flex flex-col w-[50%] p-2 rounded-lg" style={{ border: "1px solid var(--accent-primary)" }}>
                <div
                  className="w-full text-center pb-2 text-xl font-semibold"
                  style={{
                    borderBottom: "1px solid var(--border-primary)",
                    color: "var(--accent-primary)",
                  }}
                >
                  나의 판결
                </div>
                <div className="w-full text-center py-2" style={{ color: "var(--text-primary)" }}>
                  {mode === 0 ? "징역" + " " + year + "년" + " " + (month !== 0 ? month + "개월" : "") : "벌금" + " " + fine + "원"}
                </div>
                {suspend !== 0 && (
                  <div className="w-full text-center py-2" style={{ color: "var(--text-secondary)" }}>
                    집행유예 {suspend}년
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <div className="blankSpace h-10"></div>
              <MdGavel
                size={60}
                className="cursor-pointer transition-all duration-150"
                style={{ color: "var(--accent-primary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--accent-secondary)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--accent-primary)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => verdict()}
              />
              <div className="blankSpace h-4"></div>
              <div className="w-full flex justify-center my-4 cursor-default text-sm" style={{ color: "var(--text-tertiary)" }}>
                선고 후에 실제 판결을 확인할 수 있습니다
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-[50%] mx-auto h-10 mb-20 flex justify-between items-center mt-4">
          <button
            className={`text-sm md:text-base transition-all duration-150 ${caseNumber === 1 ? "" : "hover:font-semibold"}`}
            style={{
              color: caseNumber === 1 ? "var(--text-tertiary)" : "var(--text-secondary)",
              cursor: caseNumber === 1 ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (caseNumber !== 1) e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              if (caseNumber !== 1) e.currentTarget.style.color = "var(--text-secondary)";
            }}
            onClick={async () => pastCase()}
          >
            이전 사건
          </button>
          <button
            className={`text-sm md:text-base transition-all duration-150 ${caseNumber === latestCaseNumber ? "" : "hover:font-semibold"}`}
            style={{
              color: caseNumber === latestCaseNumber ? "var(--text-tertiary)" : "var(--text-secondary)",
              cursor: caseNumber === latestCaseNumber ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (caseNumber !== latestCaseNumber) e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              if (caseNumber !== latestCaseNumber) e.currentTarget.style.color = "var(--text-secondary)";
            }}
            onClick={async () => nextCase()}
          >
            다음 사건
          </button>
        </div>
      </div>
    </div>
  );
};
export default CasePage;
