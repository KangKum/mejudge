import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ICaseItem {
  _id: string;
  caseNumber: number;
  caseTitle: string;
  caseText: string;
}
const CaseList = ({ read, sort }: { read: number; sort: string }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [cases, setCases] = useState<ICaseItem[]>([]);
  const token = localStorage.getItem("MJKRtoken");
  const { userId } = token ? jwtDecode<{ userId: string }>(token) : {};
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState("사건 분류중");

  useEffect(() => {
    const fetchCases = async () => {
      let res;
      let data = [];
      if (read === 2) {
        res = await fetch(`${apiUrl}/api/cases`, { method: "GET" });
        data = await res.json();
      } else if (read === 1) {
        res = await fetch(`${apiUrl}/api/cases?type=undone&userId=${userId}`, { method: "GET" });
        data = await res.json();
      } else if (read === 0) {
        res = await fetch(`${apiUrl}/api/cases?type=done&userId=${userId}`, { method: "GET" });
        data = await res.json();
      }
      if (res) {
        setCases(data);
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchCases();
  }, []);

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
    <div className={`caseContainer w-[340px] md:min-w-[430px] ${read === 2 ? "h-[580px]" : "h-[400px]"} md:h-[500px] border-4 border-white/90 flex flex-col`}>
      <div className="w-full min-h-10 md:min-h-12 text-sm md:text-lg flex bg-white/90 text-black">
        <div className="w-[20%] h-full text-sm md:text-lg flex justify-center items-center">사건번호</div>
        <span className="w-[80%] h-full text-sm md:text-lg flex justify-center items-center">{sort}</span>
      </div>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">{loadingText}</div>
      ) : (
        <div className={`overflow-y-auto overflow-x-hidden ${read === 1 ? "text-gray-500" : ""}`}>
          {cases.length > 0 ? (
            cases.map((caseItem, index) => (
              <div
                key={index}
                className="w-full h-12 px-1 text-sm md:text-lg flex hover:bg-gray-400 cursor-pointer"
                onClick={() => navigate(`/case/${caseItem._id}`)}
              >
                <div className="w-[20%] h-full text-sm md:text-lg flex justify-center items-center border-b">{caseItem.caseNumber}</div>
                <span className="w-[80%] h-full text-sm md:text-lg flex items-center border-b pl-5">
                  {caseItem.caseTitle?.length > 20 ? caseItem.caseTitle.slice(0, 20) + "..." : caseItem.caseTitle}
                </span>
              </div>
            ))
          ) : (
            <div className="w-full mt-40 md:mt-46 flex justify-center items-center text-gray-500">해당되는 사건이 없습니다</div>
          )}
        </div>
      )}
    </div>
  );
};
export default CaseList;
