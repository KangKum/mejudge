import { useEffect } from "react";
import CaseList from "../components/CaseList";

const Main = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center cursor-default">
      <div className="blankSpace h-16 md:h-28"></div>
      <div className="caseContainerForLoggedOut w-full">
        <CaseList />
      </div>
    </div>
  );
};
export default Main;
