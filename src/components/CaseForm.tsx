import { useState } from "react";

const CaseForm = ({ setShowCaseForm }: { setShowCaseForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const registerCase = async () => {
    const res = await fetch(`${apiUrl}/api/case`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
      },
      body: JSON.stringify({ caseTitle: title, caseText: text, caseResult: result }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("사건이 등록되었습니다.");
    } else {
      alert(data.message || "사건 등록에 실패했습니다.");
    }
    setShowCaseForm(false);
  };

  return (
    <div className="overlay overflow-y-auto" onClick={() => setShowCaseForm(false)}>
      <div className="w-[380px] md:w-[800px] mx-auto mt-20 border-white bg-black" onClick={(e) => e.stopPropagation()}>
        <div className="webtoonPart"></div>
        <input type="text" value={title} placeholder="제목" onChange={(e) => setTitle(e.target.value)} className="bg-white w-full my-1 h-10 text-black" />
        <input
          type="text"
          value={result}
          placeholder="실제 선고 결과"
          onChange={(e) => setResult(e.target.value)}
          className="bg-white w-full my-1 h-10 text-black"
        />
        <textarea
          className="textPart w-full min-h-[700px] bg-gray-100 text-black"
          placeholder="사건 내용"
          spellCheck={false}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button className="w-full hover:bg-gray-500 cursor-pointer py-1 mb-2" onClick={registerCase}>
          등록
        </button>
      </div>
    </div>
  );
};
export default CaseForm;
