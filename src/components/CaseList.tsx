import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { IoIosArrowDown } from "react-icons/io";

interface ICaseItem {
  _id: string;
  caseNumber: number;
  caseTitle: string;
  caseText: string;
  readUsers: string[];
  sentencedUsers: string[];
}
const CaseList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [cases, setCases] = useState<ICaseItem[]>([]);
  const token = localStorage.getItem("MJKRtoken");
  const { userId } = token ? jwtDecode<{ userId: string }>(token) : {};
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState("사건 분류중");
  const [caseLimit, setCaseLimit] = useState<number>(10);
  const [bottomNumber, setBottomNumber] = useState<number>(0);

  const fetchCases = async () => {
    const res = await fetch(`${apiUrl}/api/cases?limit=${caseLimit}`, { method: "GET" });
    const data = await res.json();
    if (res.status === 200) {
      setCases(data.cases);
      setTimeout(() => setLoading(false), 1500);
    }
    setBottomNumber(data.cases && data.cases.length > 0 ? data.cases[data.cases.length - 1].caseNumber : 0);
  };

  useEffect(() => {
    fetchCases();
  }, [caseLimit]);

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText("사건 분류중" + ".".repeat((i % 3) + 1));
      i++;
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  return loading ? (
    <div className="w-full h-full flex justify-center items-center text-sm">{loadingText}</div>
  ) : (
    <div className={`caseContainer w-[95%] md:w-[600px] mx-auto h-[400px] border-white/70 flex flex-col`}>
      <div className="w-full min-h-7 md:min-h-8 text-sm md:text-base flex justify-center items-center rounded bg-white/70 text-black">
        <div className="w-[20%] md:w-[15%] h-full flex justify-center items-center">사건번호</div>
        <div className="w-[65%] md:w-[70%] h-full flex justify-center items-center">제목</div>
        <div className="w-[15%] h-full flex justify-center items-center">상태</div>
      </div>
      <div className={`w-full h-full overflow-y-auto overflow-x-hidden`}>
        {cases.map((caseItem, index) => (
          <div
            key={index}
            className="w-full h-10 text-sm md:text-lg flex hover:bg-gray-400 active:bg-gray-400 cursor-pointer border-b border-gray-600"
            onClick={() => navigate(`/case/${caseItem._id}`)}
          >
            <div className="w-[20%] md:w-[15%] h-full text-sm flex justify-center items-center">{caseItem.caseNumber}</div>
            <div className="w-[65%] md:w-[70%] h-full text-sm flex items-center pl-5">
              {caseItem.caseTitle?.length > 35 ? caseItem.caseTitle.slice(0, 35) + "..." : caseItem.caseTitle}
            </div>
            <div
              className={`w-[15%] h-full text-sm flex justify-center items-center ${
                userId && (caseItem.sentencedUsers ?? []).includes(userId)
                  ? "text-green-500"
                  : userId && (caseItem.readUsers ?? []).includes(userId)
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {userId ? ((caseItem.sentencedUsers ?? []).includes(userId) ? "선고" : (caseItem.readUsers ?? []).includes(userId) ? "읽음" : "미확인") : ""}
            </div>
          </div>
        ))}
      </div>
      {bottomNumber !== 1 ? (
        <button className="my-2 p-2 flex justify-center items-center gap-2 w-[60%] h-10 mx-auto" onClick={() => setCaseLimit((prev) => prev + 5)}>
          <span>
            <IoIosArrowDown size={18} />
          </span>
        </button>
      ) : (
        <div className="my-2 p-2 flex justify-center items-center gap-2 w-[60%] h-10 mx-auto"></div>
      )}
    </div>
  );
};

export default CaseList;
