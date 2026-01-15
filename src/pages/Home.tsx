import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PrivacyForm from "../components/PrivacyForm";
import TermsForm from "../components/TermsForm";
import AskForm from "../components/AskForm";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const navigate = useNavigate();
  const [showPrivacyForm, setShowPrivacyForm] = useState(false);
  const [showTermsForm, setShowTermsForm] = useState(false);
  const [showAskForm, setShowAskForm] = useState(false);

  return (
    <div className="w-full h-dvh flex justify-center cursor-default" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>나의 판결 | 실제 판결문 기반 형량 판단 서비스</title>
        <meta
          name="description"
          content="나의 판결은 실제 판결문을 바탕으로 사용자가 직접 형량을 판단하고 실제 법원의 판결과 비교할 수 있는 법 판단 체험 플랫폼입니다."
        />
        <link rel="canonical" href="https://mejudge.com/" />
      </Helmet>
      {showPrivacyForm && <PrivacyForm setShowPrivacyForm={setShowPrivacyForm} />}
      {showTermsForm && <TermsForm setShowTermsForm={setShowTermsForm} />}
      {showAskForm && <AskForm setShowAskForm={setShowAskForm} />}
      <div className="w-[85%] md:w-[60%] md:min-w-[800px] md:min-h-[600px] flex flex-col items-center">
        <div className="blankSpace h-[120px] md:h-[150px]"></div>
        <span className="homeTitle text-5xl md:text-8xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-emphasis)' }}>
          나의 판결
        </span>
        <div className="blankSpace h-[100px]"></div>
        <span className="homeSub1 w-[320px] md:w-[550px] text-base md:text-xl flex justify-center text-center leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          실제로 발생했던 범죄 사건을 직접 판결하고,
          <br />
          실제 판결과 비교할 수 있는 플랫폼입니다.
        </span>
        <div className="blankSpace h-8"></div>
        <span className="homeSub2 text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
          ※본 플랫폼은 국가 기관과 무관한 독립적인 서비스입니다.
        </span>
        <div className="blankSpace h-18"></div>
        <button
          className="homeButton md:rounded-xl rounded-lg p-2 md:p-4 text-base md:text-2xl font-semibold transition-all duration-150"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--text-emphasis)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-secondary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => navigate("/main")}
        >
          참여하기
        </button>
        <div className="blankSpace h-3"></div>
        <span className="homeSub2 text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
          15세 이상 권장
        </span>
        <div className="blankSpace h-12"></div>
        <div className="flex w-[96%] md:w-[50%] justify-between text-sm md:text-base">
          <button
            className="transition-all duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.textDecoration = 'none';
            }}
            onClick={() => navigate("/about")}
          >
            서비스 소개
          </button>
          <button
            className="transition-all duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.textDecoration = 'none';
            }}
            onClick={() => setShowPrivacyForm(true)}
          >
            개인정보처리방침
          </button>
          <button
            className="transition-all duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.textDecoration = 'none';
            }}
            onClick={() => setShowTermsForm(true)}
          >
            이용약관
          </button>
          <button
            className="transition-all duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.textDecoration = 'none';
            }}
            onClick={() => setShowAskForm(true)}
          >
            문의
          </button>
        </div>
        <div className="mt-10" style={{ color: 'var(--text-tertiary)' }}>
          © 2026 MeJudge. All rights reserved.
        </div>
      </div>
    </div>
  );
};
export default Home;
