import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CaseForm from "../components/CaseForm";
import CaseList from "../components/CaseList";

const Master = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [showCaseForm, setShowCaseForm] = useState(false);

  const navigate = useNavigate();
  const adminValidate = async () => {
    const res = await fetch(`${apiUrl}/api/check-admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
      },
    });
    const data = await res.json();
    if (data.isAdmin) {
      // 관리자 기능 활성화
      setShowCaseForm(true);
    } else {
      // 일반 유저 기능
      alert("관리자만 접근할 수 있습니다.");
      localStorage.removeItem("MJKRtoken");
      localStorage.removeItem("MJKRnickname");
      navigate("/login");
    }
  };
  return showCaseForm ? (
    <CaseForm setShowCaseForm={setShowCaseForm} />
  ) : (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="blankSpace w-full h-20"></div>
      <div className="w-[80%] md:w-full flex md:flex-row flex-col justify-center items-center gap-10">
        <button
          className="w-[340px] h-[200px] md:min-w-[400px] md:h-[500px] md:text-4xl bg-gray-600 hover:cursor-pointer hover:font-bold"
          onClick={() => adminValidate()}
        >
          사건등록
        </button>

        <CaseList />
      </div>
    </div>
  );
};
export default Master;
