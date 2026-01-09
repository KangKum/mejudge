import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { FaMedal } from "react-icons/fa";
import { MdGavel } from "react-icons/md";

interface ICaseItem {
  _id: string;
  caseNumber: number;
  caseTitle: string;
  caseText: string;
  caseResult: string;
  caseResult2: string;
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
  const Ymax = 50;
  const Ymin = 0;
  const Mmax = 11;
  const Mmin = 0;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Array<IComment>>([]);
  const [commentLimit, setCommentLimit] = useState(3);
  const [commentCount, setCommentCount] = useState(0);
  const token = localStorage.getItem("MJKRtoken");
  const { userId } = token ? jwtDecode<{ userId: string }>(token) : {};
  const userNickname = localStorage.getItem("MJKRnickname") || "";
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}` },
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
      } else {
        alert(data.message || "선고 실패");
      }
    } catch (error) {
      console.error("Error submitting sentence:", error);
    }
    window.location.reload();
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
    const adminId = import.meta.env.VITE_ADMIN_ID;
    if (userId === adminId) {
      setIsAdmin(true);
    }
  }, [userId]);

  useEffect(() => {
    if ((year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4) {
      setSuspend(0);
    }
  }, [year, month]);

  useEffect(() => {
    //'읽음'처리
    markAsRead();
  }, [userId, caseId]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center ">
      <div className="w-[90%] md:w-[55%] flex flex-col overflow-y-auto">
        <div className="w-full h-8 mb-2 flex justify-between items-center mt-4">
          <button className={`text-sm md:text-base ${caseNumber === 1 ? "text-gray-500" : "active:font-bold"}`} onClick={async () => pastCase()}>
            이전 사건
          </button>
          {isAdmin && (
            <button
              className="text-sm md:text-base font-bold text-red-600 flex justify-center items-center"
              onClick={() => {
                confirm("정말로 사건을 삭제하시겠습니까? 삭제된 사건은 복구할 수 없습니다.") && deleteCase();
              }}
            >
              DELETE
            </button>
          )}
          <button className={`text-sm md:text-base ${caseNumber === latestCaseNumber ? "text-gray-500" : "active:font-bold"}`} onClick={async () => nextCase()}>
            다음 사건
          </button>
        </div>
        <div className="titlePart w-full h-8 flex justify-center items-center font-bold px-2 py-4 mb-2 text-xl cursor-default">{caseData?.caseTitle}</div>
        <div className="webtoonPart w-full">
          {caseData?.caseNumber && <img src={`${imgUrl}/cases/${caseData.caseNumber}/case${caseData.caseNumber}_1.webp`} alt="case image" />}
        </div>
        <div className="blankSpace h-4"></div>
        <div className="textPart w-full whitespace-pre-line text-lg">{caseData?.caseText}</div>
        <div className="commentPart w-full mt-6">
          <div className="commentUpPart h-8 text-lg my-2">댓글({commentCount})</div>
          <div className="commentMiddlePart flex flex-col items-center p-2 border mb-4">
            <div className="idPart w-full mb-1">{userNickname}</div>
            <textarea
              className={`textPart w-full h-24 mx-auto ${userId ? "" : "cursor-default"}`}
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
            <div className="buttonPart w-full flex justify-end mt-2">
              <button className="bg-gray-500 py-1 px-2" onClick={async () => makeComment()}>
                전송
              </button>
            </div>
          </div>
          <div className="commentDownPart">
            {comments.map((comment, index) => (
              <div key={index} className="commentItem flex flex-col border-b px-2 mt-2 pb-2">
                <div className="commentUser text-sm md:text-base flex">
                  <span className="flex justify-center items-center">
                    {index === 0 && comment.likes.length > 2 ? (
                      <FaMedal color="#FFD700" size={12} />
                    ) : index === 1 && comment.likes.length > 2 ? (
                      <FaMedal color="#C0C0C0" size={12} />
                    ) : index === 2 && comment.likes.length > 2 ? (
                      <FaMedal color="#CD7F32" size={12} />
                    ) : null}
                  </span>
                  <span className="mr-3 font-bold">{comment.userNickname}</span>
                  <span className="text-xs md:text-sm flex items-center text-gray-500">{formattedDate(comment.createdAt)}</span>
                  {isAdmin && (
                    <div>
                      <button
                        className="ml-3 text-red-600 border"
                        onClick={() => {
                          confirm("해당 유저의 닉네임을 변경하시겠습니까?") && changeNickname({ comment });
                        }}
                      >
                        닉변
                      </button>
                      <button
                        className="ml-3 text-red-600 border"
                        onClick={() => {
                          confirm("정말로 댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.") && deleteComment({ comment });
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                <div className="commentText text-sm md:text-base">{comment.comment}</div>
                <div className="flex justify-end gap-2 mt-3">
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
            <button
              className={`my-2 p-2 flex justify-center items-center gap-2 w-[60%] mx-auto mb-10 ${commentCount <= commentLimit ? "hidden" : ""}`}
              onClick={() => setCommentLimit((prev) => prev + 10)}
            >
              <span>
                <IoIosArrowDown size={18} />
              </span>
            </button>
            {commentCount <= commentLimit ? <div className="h-10 w-full"></div> : null}
          </div>
        </div>
        <div className={`footerPart w-[90%] pb-2 flex flex-col mx-auto mt-2 ${isSentenced ? "hidden" : ""}`}>
          <div className="w-[60%] md:w-[50%] mx-auto min-h-8 md:min-h-10 flex justify-center">
            <button className={`flex-1 min-h-full rounded-l ${mode === 0 ? "bg-blue-600" : "bg-gray-400"}`} onClick={() => setMode(0)}>
              징역형
            </button>
            <button className={`flex-1 min-h-full rounded-r ${mode === 1 ? "bg-blue-600" : "bg-gray-400"}`} onClick={() => setMode(1)}>
              벌금형
            </button>
          </div>
          {mode === 0 ? (
            <div className="flex flex-col h-40 md:h-50">
              <div className="w-full h-20 md:h-30 flex justify-center items-center text-xl md:text-2xl font-bold">
                {year === 50 && month === 11 ? "무기징역" : year > 0 ? "징역" + " " + year + "년" + " " + month + "개월" : "징역" + " " + month + "개월"}
              </div>
              <div className="w-[95%] h-12 md:h-25 flex flex-col mx-auto gap-3 md:gap-5">
                <input type="range" min={Ymin} max={Ymax} value={year} onChange={(e) => setYear(Number(e.target.value))} />
                <input type="range" min={Mmin} max={Mmax} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
              </div>
              <div
                className={`h-14 mt-4 w-[95%] mx-auto flex flex-row my-auto ${
                  (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4 ? "text-gray-500" : ""
                }`}
              >
                <div className="w-[25%] h-full flex justify-center items-center text-base md:text-lg">집행유예</div>
                <div className="w-[75%] h-full flex justify-center items-center text-sm md:text-base">
                  <div className="w-full h-[95%] flex mx-auto gap-2">
                    <button
                      disabled={isSentenced || (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4}
                      className={`border rounded p-1 w-[20%] h-[80%] md:h-full my-auto flex justify-center items-center ${
                        isSentenced && suspend === 1 ? "bg-gray-300" : suspend === 1 ? "bg-blue-600" : ""
                      }`}
                      onClick={() => {
                        if (suspend === 1) {
                          setSuspend(0);
                        } else {
                          setSuspend(1);
                        }
                      }}
                    >
                      1년
                    </button>
                    <button
                      disabled={isSentenced || (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4}
                      className={`border rounded p-1 w-[20%] h-[80%] md:h-full my-auto flex justify-center items-center ${
                        isSentenced && suspend === 2 ? "bg-gray-300" : suspend === 2 ? "bg-blue-600" : ""
                      }`}
                      onClick={() => {
                        if (suspend === 2) {
                          setSuspend(0);
                        } else {
                          setSuspend(2);
                        }
                      }}
                    >
                      2년
                    </button>
                    <button
                      disabled={isSentenced || (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4}
                      className={`border rounded p-1 w-[20%] h-[80%] md:h-full my-auto flex justify-center items-center ${
                        isSentenced && suspend === 3 ? "bg-gray-300" : suspend === 3 ? "bg-blue-600" : ""
                      }`}
                      onClick={() => {
                        if (suspend === 3) {
                          setSuspend(0);
                        } else {
                          setSuspend(3);
                        }
                      }}
                    >
                      3년
                    </button>
                    <button
                      disabled={isSentenced || (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4}
                      className={`border rounded p-1 w-[20%] h-[80%] md:h-full my-auto flex justify-center items-center ${
                        isSentenced && suspend === 4 ? "bg-gray-300" : suspend === 4 ? "bg-blue-600" : ""
                      }`}
                      onClick={() => {
                        if (suspend === 4) {
                          setSuspend(0);
                        } else {
                          setSuspend(4);
                        }
                      }}
                    >
                      4년
                    </button>
                    <button
                      disabled={isSentenced || (year >= 3 && month !== 0) || (year === 0 && month === 0) || year >= 4}
                      className={`border rounded p-1 w-[20%] h-[80%] md:h-full my-auto flex justify-center items-center ${
                        isSentenced && suspend === 5 ? "bg-gray-300" : suspend === 5 ? "bg-blue-600" : ""
                      }`}
                      onClick={() => {
                        if (suspend === 5) {
                          setSuspend(0);
                        } else {
                          setSuspend(5);
                        }
                      }}
                    >
                      5년
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center h-40 md:h-50">
              <div className="w-full h-20 md:h-30 flex justify-center items-center text-xl md:text-2xl font-bold">벌금 {(fine ?? 0).toLocaleString()}원</div>
              <div className="w-[98%] md:h-12 flex justify-center items-center gap-2 mb-1">
                <button className="border flex-1 text-xs md:text-base h-10 rounded" onClick={() => setFine((prev) => prev + 100000000)}>
                  +1억
                </button>
                <button className="border flex-1 text-xs md:text-base h-10 rounded" onClick={() => setFine((prev) => prev + 10000000)}>
                  +1000만원
                </button>
                <button className="border flex-1 text-xs md:text-base h-10 rounded" onClick={() => setFine((prev) => prev + 1000000)}>
                  +100만원
                </button>
                <button className="border flex-1 text-xs md:text-base h-10 rounded" onClick={() => setFine((prev) => prev + 100000)}>
                  +10만원
                </button>
              </div>
              <div className="w-[98%] md:h-12 flex justify-center items-center gap-2">
                <button
                  className="border flex-1 text-xs md:text-base h-10 rounded"
                  onClick={() => setFine((prev) => (prev - 100000000 < 0 ? 0 : prev - 100000000))}
                >
                  -1억
                </button>
                <button
                  className="border flex-1 text-xs md:text-base h-10 rounded"
                  onClick={() => setFine((prev) => (prev - 10000000 < 0 ? 0 : prev - 10000000))}
                >
                  -1000만원
                </button>
                <button
                  className="border flex-1 text-xs md:text-base h-10 rounded"
                  onClick={() => setFine((prev) => (prev - 1000000 < 0 ? 0 : prev - 1000000))}
                >
                  -100만원
                </button>
                <button className="border flex-1 text-xs md:text-base h-10 rounded" onClick={() => setFine((prev) => (prev - 100000 < 0 ? 0 : prev - 100000))}>
                  -10만원
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="sentencePart flex justify-center items-center w-full h-45">
          {isSentenced ? (
            <div className="w-[90%] md:w-[50%] flex gap-10">
              <div className="flex flex-col w-[50%] bg-gray-200 text-black p-2">
                <div className="w-full text-center border-b pb-2 text-xl">실제 판결</div>
                <div className="w-full text-center py-2">{caseData?.caseResult}</div>
                {caseData?.caseResult2 !== "" && <div className="w-full text-center py-2">집행유예 {caseData?.caseResult2}</div>}
              </div>
              <div className="flex flex-col w-[50%] p-2 border">
                <div className="w-full text-center border-b pb-2 text-xl">나의 판결</div>
                <div className="w-full text-center py-2">
                  {mode === 0 ? "징역" + " " + year + "년" + " " + (month !== 0 ? month + "개월" : "") : "벌금" + " " + fine + "원"}
                </div>
                {suspend !== 0 && <div className="w-full text-center py-2">집행유예 {suspend}년</div>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <div className="blankSpace h-10"></div>
              <MdGavel size={60} className="cursor-pointer" onClick={() => verdict()} />
              <div className="blankSpace h-4"></div>
              <div className="w-full flex justify-center my-4 cursor-default text-gray-400 text-sm">선고 후에 실제 판결을 확인할 수 있습니다</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CasePage;
