import CaseList from "../components/CaseList";

const Main = () => {
  const isLoggedIn = !!localStorage.getItem("MJKRtoken");

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="blankSpace h-16 md:h-28"></div>
      {isLoggedIn ? (
        <div className="caseContainerForLoggedIn flex flex-col md:flex-row gap-10 justify-center">
          <CaseList read={0} sort="선고완료" />
          <CaseList read={1} sort="미선고" />
        </div>
      ) : (
        <div className="caseContainerForLoggedOut">
          <CaseList read={2} sort="전체" />
        </div>
      )}
    </div>
  );
};
export default Main;
