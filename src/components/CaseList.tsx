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
  const [caseCount, setCaseCount] = useState(0);

  const fetchCases = async () => {
    const res = await fetch(`${apiUrl}/api/cases?limit=${caseLimit}`, { method: "GET" });
    const data = await res.json();
    console.log(data);
    if (res.status === 200) {
      setCaseCount(data.length);
      setCases(data.cases);
      setTimeout(() => setLoading(false), 1500);
    }
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

  return (
    <div className={`caseContainer w-[340px] md:min-w-[600px] md:h-[500px] bg-gray-800 border-white/90 flex flex-col`}>
      <div className="w-full min-h-8 md:min-h-10 text-sm md:text-base flex justify-center items-center bg-white/90 text-black">
        <div className="w-[20%] md:w-[15%] h-full flex justify-center items-center">사건번호</div>
        <div className="w-[65%] md:w-[70%] h-full flex justify-center items-center">제목</div>
        <div className="w-[15%] h-full flex justify-center items-center">상태</div>
      </div>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">{loadingText}</div>
      ) : (
        <div className={`w-full overflow-y-auto overflow-x-hidden`}>
          {cases.map((caseItem, index) => (
            <div key={index} className="w-full h-10 text-sm md:text-lg flex hover:bg-gray-400 cursor-pointer" onClick={() => navigate(`/case/${caseItem._id}`)}>
              <div className="w-[20%] md:w-[15%] h-full text-sm flex justify-center items-center border-b">{caseItem.caseNumber}</div>
              <div className="w-[65%] md:w-[70%] h-full text-sm flex items-center border-b pl-5">
                {caseItem.caseTitle?.length > 35 ? caseItem.caseTitle.slice(0, 35) + "..." : caseItem.caseTitle}
              </div>
              <div
                className={`w-[15%] h-full text-sm flex justify-center items-center border-b border-white ${
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

          {caseCount > cases.length && (
            <button className="my-2 p-2 flex justify-center items-center gap-2 w-[60%] mx-auto" onClick={() => setCaseLimit((prev) => prev + 3)}>
              <span>더보기</span>{" "}
              <span>
                <IoIosArrowDown size={18} />
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default CaseList;
