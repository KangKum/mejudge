import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PrivacyForm from "../components/PrivacyForm";
import TermsForm from "../components/TermsForm";
import AskForm from "../components/AskForm";

const Home = () => {
  const navigate = useNavigate();
  const [showPrivacyForm, setShowPrivacyForm] = useState(false);
  const [showTermsForm, setShowTermsForm] = useState(false);
  const [showAskForm, setShowAskForm] = useState(false);

  return (
    <div className="w-full flex justify-center cursor-default">
      {showPrivacyForm && <PrivacyForm setShowPrivacyForm={setShowPrivacyForm} />}
      {showTermsForm && <TermsForm setShowTermsForm={setShowTermsForm} />}
      {showAskForm && <AskForm setShowAskForm={setShowAskForm} />}
      <div className="w-[85%] md:w-[60%] md:min-w-[800px] md:min-h-[600px] flex flex-col items-center">
        <div className="blankSpace h-[150px]"></div>
        <span className="homeTitle text-5xl md:text-8xl">내가 판사라면</span>
        <div className="blankSpace h-[120px]"></div>
        <span className="homeSub1 w-[300px] md:w-[550px] text-base md:text-xl md:text-center">
          실제 사건을 재구성한 가상 사건을 통해 직접 형량을 판단해보고, 이를 실제 판결과 비교할 수 있는 플랫폼입니다.
        </span>
        <div className="blankSpace h-[100px]"></div>
        <span className="homeSub2 text-xs md:text-sm">※본 플랫폼은 국가 기관과 무관한 독립적인 서비스입니다.</span>
        <div className="blankSpace h-[100px]"></div>
        <button
          className="homeButton md:rounded-xl rounded-lg bg-[#e5e0e0] p-2 md:p-4 text-base md:text-2xl text-black hover:cursor-pointer"
          onClick={() => navigate("/main")}
        >
          참여하기
        </button>
        <div className="blankSpace h-[100px]"></div>
        <div className="flex w-[85%] md:w-[35%] justify-between">
          <button onClick={() => setShowAskForm(true)}>고객센터</button>
          <button onClick={() => setShowPrivacyForm(true)}>개인정보처리방침</button>
          <button onClick={() => setShowTermsForm(true)}>이용약관</button>
        </div>
        <div className="mt-10">© 2025 MeJudge. All rights reserved.</div>
      </div>
    </div>
  );
};
export default Home;
