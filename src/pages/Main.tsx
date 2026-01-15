import { useEffect } from "react";
import CaseList from "../components/CaseList";
import { Helmet } from "react-helmet-async";

const Main = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full flex flex-col cursor-default" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>실제 판결문 사건 목록 | 나의 판결</title>
        <meta
          name="description"
          content="사기, 폭행, 강제추행 등 실제 형사 사건 판결문을 확인하고 직접 형량을 판단해보세요. 다양한 사건을 한눈에 볼 수 있습니다."
        />
        <link rel="canonical" href="https://mejudge.com/main" />
      </Helmet>
      <div className="blankSpace h-16 md:h-28"></div>
      <div className="caseContainerForLoggedOut w-full">
        <CaseList />
      </div>
    </div>
  );
};
export default Main;
