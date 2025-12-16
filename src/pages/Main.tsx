import CaseList from "../components/CaseList";
import { useEffect, useState } from "react";

const Main = () => {
  const isLoggedIn = !!localStorage.getItem("MJKRtoken");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="blankSpace h-16 md:h-28"></div>
      {isLoggedIn ? (
        loading ? (
          <div>사건 분류중...</div>
        ) : (
          <div className="caseContainerForLoggedIn flex flex-col md:flex-row gap-10 justify-center">
            <CaseList read={0} sort="선고완료" />
            <CaseList read={1} sort="미선고" />
          </div>
        )
      ) : loading ? (
        <div>사건 가져오는중...</div>
      ) : (
        <div className="caseContainerForLoggedOut">
          <CaseList read={2} sort="전체" />
        </div>
      )}
    </div>
  );
};
export default Main;
