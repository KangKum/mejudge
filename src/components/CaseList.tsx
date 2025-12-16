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

  useEffect(() => {
    const fetchCases = async () => {
      try {
        let res, data;
        if (read === 2) {
          res = await fetch(`${apiUrl}/api/cases`, { method: "GET" });
        } else if (read === 1) {
          res = await fetch(`${apiUrl}/api/cases?type=undone&userId=${userId}`, { method: "GET" });
        } else if (read === 0) {
          res = await fetch(`${apiUrl}/api/cases?type=done&userId=${userId}`, { method: "GET" });
        }
        if (res) {
          data = await res.json();
          setCases(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div className="caseContainer w-[340px] md:min-w-[430px] h-[400px] md:h-[500px] border-2 flex flex-col">
      <div className="w-full min-h-10 md:min-h-12 text-sm md:text-lg flex bg-white text-black">
        <div className="w-[20%] h-full text-sm md:text-lg flex justify-center items-center">사건번호</div>
        <span className="w-[80%] h-full text-sm md:text-lg flex justify-center items-center">{sort}</span>
      </div>
      <div className="overflow-y-auto overflow-x-hidden">
        {cases.map((caseItem, index) => (
          <div
            key={index}
            className="w-full h-12 px-1 text-sm md:text-lg flex hover:bg-gray-400 cursor-pointer"
            onClick={() => navigate(`/case/${caseItem._id}`)}
          >
            <div className="w-[20%] h-full text-sm md:text-lg flex justify-center items-center border-b">{caseItem.caseNumber}</div>
            <span className="w-[80%] h-full text-sm md:text-lg flex items-center border-b pl-3">
              {caseItem.caseTitle?.length > 18 ? caseItem.caseTitle.slice(0, 18) + "..." : caseItem.caseTitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CaseList;
