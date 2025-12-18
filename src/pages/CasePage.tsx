import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { FaMedal } from "react-icons/fa";
import { MdGavel } from "react-icons/md";
import MasterForm from "../components/MasterForm";

interface ICaseItem {
  _id: string;
  caseNumber: number;
  caseTitle: string;
  caseText: string;
  caseResult: string;
}
interface IComment {
  _id: String;
  userNickname: string;
  comment: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
}

const CasePage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { caseId } = useParams(); // id가 바로 caseItem._id 값
  const [caseData, setCaseData] = useState<ICaseItem | null>(null);
  const [isSentenced, setIsSentenced] = useState(false);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [mode, setMode] = useState(0); // 0: 징역형, 1: 벌금형
  const [fine, setFine] = useState(0);
  const Ymax = 50;
  const Ymin = 0;
  const Mmax = 11;
  const Mmin = 0;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Array<IComment>>([]);
  const [commentLimit, setCommentLimit] = useState(3);
  const [commentCount, setCommentCount] = useState(0);
  // useEffect에서 해야하나?
  const token = localStorage.getItem("MJKRtoken");
  const { userId } = token ? jwtDecode<{ userId: string }>(token) : {};
  const userNickname = localStorage.getItem("MJKRnickname") || "";
  const caseNumber = caseData?.caseNumber;
  const [latestCaseNumber, setLatestCaseNumber] = useState<number>(0);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [masterKey, setMasterKey] = useState(false);
  const [commentForMaster, setCommentForMaster] = useState<IComment | null>(null);

  const fetchCase = async () => {
    const res = await fetch(`${apiUrl}/api/case/${caseId}`, {
      method: "GET",
    });
    const data = await res.json();
    setCaseData(data);
  };
  const makeComment = async () => {
    //도배 방지 localStorage
    const lastCommentTime = localStorage.getItem("lastCommentTime");
    const now = Date.now();
    if (lastCommentTime && now - parseInt(lastCommentTime) < 30000) {
      alert("댓글은 30초에 한 번만 작성할 수 있습니다.");
      return;
    }

    if (comment.trim() === "" || isCommenting) return;
    setIsCommenting(true);
    const res = await fetch(`${apiUrl}/api/comment/${userId}/${caseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}` },
      body: JSON.stringify({ userNickname, comment }),
    });
    if (res.ok) {
      setComment("");
      alert("댓글이 등록되었습니다.");
      localStorage.setItem("lastCommentTime", now.toString());
      fetchComment();
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
  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");

    const formatted = `${year}. ${month}. ${day} ${hour}:${min}`;
    return formatted;
  };
  const makeLike = async ({ comment }: { comment: IComment }) => {
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}` },
        body: JSON.stringify({ userId }),
      });
      if (res.status !== 200) {
        //실패 시 프론트 롤백
        fetchComment();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
  const makeDislike = async ({ comment }: { comment: IComment }) => {
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}` },
        body: JSON.stringify({ userId }),
      });
      if (res.status !== 200) {
        //실패 시 프론트 롤백
        fetchComment();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
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
        body: JSON.stringify({ mode, year, month, fine }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("선고가 완료되었습니다.");
      } else {
        alert(data.message || "선고 실패");
      }
    } catch (error) {
      console.error("Error submitting sentence:", error);
    }
    window.location.reload();
  };
  const openMasterKey = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/check-admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
        },
      });
      const data = await res.json();
      if (data.isAdmin) {
        setMasterKey(!masterKey);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  useEffect(() => {
    if (!caseId) return;
    fetchCase();
    fetchAllComments();
    window.scrollTo(0, 0);
  }, [caseId]);

  useEffect(() => {
    if (!userId || !caseId) return;
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
            setFine(typeof data.judgement.fine === "number" ? data.judgement.fine : 0);
          } else {
            // 선고 기록이 없으면 기본값으로 초기화
            setIsSentenced(false);
            setMode(0);
            setYear(0);
            setMonth(0);
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

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-[90%] md:w-[60%] flex flex-col">
        <div className="w-full h-10 flex justify-between">
          <button className={`hover:font-bold text-sm md:text-base ${caseNumber === 1 ? "text-gray-500" : ""}`} onClick={async () => pastCase()}>
            이전 사건
          </button>
          <button className={`hover:font-bold text-sm md:text-base ${caseNumber === latestCaseNumber ? "text-gray-500" : ""}`} onClick={async () => nextCase()}>
            다음 사건
          </button>
        </div>
        <div className="titlePart w-full max-h-14 flex justify-center items-center font-bold px-2 py-4 mb-6 text-xl cursor-default">{caseData?.caseTitle}</div>
        <div className="webtoonPart w-full"></div>
        <div className="textPart w-full whitespace-pre-line min-h-[450px] md:min-h-[500px] px-1 cursor-default">{caseData?.caseText}</div>
        <div className="commentPart w-full mt-6">
          <div className="commentUpPart h-8 text-lg my-2 cursor-default">댓글({commentCount})</div>
          <div className="commentMiddlePart flex flex-col items-center p-2 border">
            <div className="idPart w-full mb-1 cursor-default">{userNickname}</div>
            <textarea
              className="textPart w-full h-24 mx-auto"
              spellCheck={false}
              placeholder={`${userId ? "댓글을 입력하세요" : "로그인이 필요합니다."}`}
              maxLength={300}
              value={comment}
              onClick={() => {
                if (!userId) {
                  alert("로그인이 필요합니다.");
                  navigate("/login");
                }
              }}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="buttonPart w-full flex justify-end">
              <button className="bg-gray-500 py-1 px-2" onClick={async () => makeComment()}>
                전송
              </button>
            </div>
          </div>
          <div className="commentDownPart">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="commentItem flex flex-col border-b px-2 py-4"
                onClick={async () => {
                  setCommentForMaster(comment);
                  openMasterKey();
                }}
              >
                {masterKey ? (
                  <MasterForm setMasterKey={setMasterKey} comment={commentForMaster} setCommentForMaster={setCommentForMaster} />
                ) : (
                  <div className="commentUser text-sm md:text-base flex gap-1">
                    <span className="flex justify-center items-center">
                      {index === 0 ? (
                        <FaMedal color="#FFD700" size={12} />
                      ) : index === 1 ? (
                        <FaMedal color="#C0C0C0" size={12} />
                      ) : index === 2 ? (
                        <FaMedal color="#CD7F32" size={12} />
                      ) : null}
                    </span>
                    <span className="cursor-default">{comment.userNickname}</span>
                    <span className="text-xs md:text-sm flex items-center text-gray-500 cursor-default">{formattedDate(comment.createdAt)}</span>
                  </div>
                )}
                <div className="commentText text-sm md:text-base cursor-default pb-3">{comment.comment}</div>
                <div className="flex justify-end gap-2">
                  <button
                    className={`border p-1 flex justify-center items-center ${
                      userId && comment.likes && comment.likes.includes(userId) ? "text-blue-600" : ""
                    }`}
                    onClick={async () => makeLike({ comment })}
                  >
                    <span className="pl-1">
                      <FaThumbsUp />
                    </span>
                    <span className="px-1">{comment.likes ? comment.likes.length : 0}</span>
                  </button>
                  <button
                    className={`border p-1 flex justify-center items-center ${
                      userId && comment.dislikes && comment.dislikes.includes(userId) ? "text-blue-600" : ""
                    }`}
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
            {commentCount === comments.length ? (
              ""
            ) : (
              <button className="my-2 p-2 flex justify-center items-center gap-2 w-[60%] mx-auto" onClick={() => setCommentLimit((prev) => prev + 10)}>
                <span>더보기</span>{" "}
                <span>
                  <IoIosArrowDown size={18} />
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="footerPart w-full pb-2 flex flex-col border mt-2">
          <div className="w-full min-h-8 md:min-h-10 flex justify-center">
            <button
              disabled={isSentenced}
              className={`flex-1 min-h-full ${mode === 0 ? (isSentenced ? "bg-gray-500" : "bg-blue-600") : ""}`}
              onClick={() => setMode(0)}
            >
              징역형
            </button>
            <button
              disabled={isSentenced}
              className={`flex-1 min-h-full ${mode === 1 ? (isSentenced ? "bg-gray-500" : "bg-blue-600") : ""}`}
              onClick={() => setMode(1)}
            >
              벌금형
            </button>
          </div>
          {mode === 0 ? (
            <div className="flex flex-col">
              <div className="w-full h-20 md:h-30 flex justify-center items-center text-2xl font-bold cursor-default">
                {year === 50 && month === 11 ? "무기징역" : year > 0 ? year + "년" + " " + month + "개월" : month + "개월"}
              </div>
              <div className="w-[90%] h-12 md:h-25 flex flex-col mx-auto gap-3 md:gap-5">
                <input type="range" disabled={isSentenced} min={Ymin} max={Ymax} value={year} onChange={(e) => setYear(Number(e.target.value))} />
                <input type="range" disabled={isSentenced} min={Mmin} max={Mmax} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full h-20 md:h-30 flex justify-center items-center text-2xl font-bold cursor-default">{(fine ?? 0).toLocaleString()}원</div>
              <div className="w-[98%] md:h-12 flex justify-center items-center gap-2 mb-1">
                <button disabled={isSentenced} className="border flex-1 text-xs md:text-base h-10" onClick={() => setFine((prev) => prev + 100000000)}>
                  +1억
                </button>
                <button disabled={isSentenced} className="border flex-1 text-xs md:text-base h-10" onClick={() => setFine((prev) => prev + 10000000)}>
                  +1000만원
                </button>
                <button disabled={isSentenced} className="border flex-1 text-xs md:text-base h-10" onClick={() => setFine((prev) => prev + 1000000)}>
                  +100만원
                </button>
                <button disabled={isSentenced} className="border flex-1 text-xs md:text-base h-10" onClick={() => setFine((prev) => prev + 100000)}>
                  +10만원
                </button>
                <button disabled={isSentenced} className="border flex-1 text-xs md:text-base h-10" onClick={() => setFine((prev) => prev + 10000)}>
                  +1만원
                </button>
              </div>
              <div className="w-[98%] md:h-12 flex justify-center items-center gap-2">
                <button
                  disabled={isSentenced}
                  className="border flex-1 text-xs md:text-base h-10"
                  onClick={() => setFine((prev) => (prev - 100000000 < 0 ? 0 : prev - 100000000))}
                >
                  -1억
                </button>
                <button
                  disabled={isSentenced}
                  className="border flex-1 text-xs md:text-base h-10"
                  onClick={() => setFine((prev) => (prev - 10000000 < 0 ? 0 : prev - 10000000))}
                >
                  -1000만원
                </button>
                <button
                  disabled={isSentenced}
                  className="border flex-1 text-xs md:text-base h-10"
                  onClick={() => setFine((prev) => (prev - 1000000 < 0 ? 0 : prev - 1000000))}
                >
                  -100만원
                </button>
                <button
                  disabled={isSentenced}
                  className="border flex-1 text-xs md:text-base h-10"
                  onClick={() => setFine((prev) => (prev - 100000 < 0 ? 0 : prev - 100000))}
                >
                  -10만원
                </button>
                <button
                  disabled={isSentenced}
                  className="border flex-1 text-xs md:text-base h-10"
                  onClick={() => setFine((prev) => (prev - 10000 < 0 ? 0 : prev - 10000))}
                >
                  -1만원
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="sentencePart flex justify-center items-center w-full h-16">
          <button disabled={isSentenced} className="cursor-pointer hover:font-bold mt-4 p-2" onClick={async () => verdict()}>
            {isSentenced ? <span className="text-blue-700 text-xl">{caseData?.caseResult}</span> : <MdGavel size={40} />}
          </button>
        </div>
        <div className="blankSpace h-2"></div>
        {!isSentenced && <div className="w-full h-10 flex justify-center cursor-default">선고 후에 실제 판결을 확인할 수 있습니다</div>}
        <div className="w-full h-10 flex justify-between">
          <button className={`hover:font-bold text-sm md:text-base ${caseNumber === 1 ? "text-gray-500" : ""}`} onClick={async () => pastCase()}>
            이전 사건
          </button>
          <button className={`hover:font-bold text-sm md:text-base ${caseNumber === latestCaseNumber ? "text-gray-500" : ""}`} onClick={async () => nextCase()}>
            다음 사건
          </button>
        </div>
      </div>
    </div>
  );
};
export default CasePage;
