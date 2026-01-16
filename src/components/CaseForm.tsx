import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const CaseForm = ({ setShowCaseForm }: { setShowCaseForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [result2, setResult2] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const registerCase = async () => {
    if (isRegistering) return;

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!text.trim()) {
      alert("사건 내용을 입력해주세요.");
      return;
    }

    if (!result.trim() || (result.trim().slice(0, 2) !== "징역" && result.trim().slice(0, 2) !== "벌금")) {
      alert("실제 선고 결과를 입력해주세요.");
      return;
    }

    if (
      result2.trim() !== "" &&
      result2.trim() !== "1년" &&
      result2.trim() !== "2년" &&
      result2.trim() !== "3년" &&
      result2.trim() !== "4년" &&
      result2.trim() !== "5년"
    ) {
      alert("집행유예 결과는 ' ', '1년', '2년', '3년', '4년', '5년' 중 하나로 입력해주세요.");
      return;
    }

    if (!imageFile) {
      alert("이미지를 선택해주세요.");
      return;
    }

    setIsRegistering(true);

    try {
      const formData = new FormData();
      formData.append("caseTitle", title);
      formData.append("caseText", text);
      formData.append("caseResult", result);
      formData.append("caseResult2", result2);
      formData.append("image", imageFile);

      const res = await fetch(`${apiUrl}/api/case`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("사건이 등록되었습니다.");
        setShowCaseForm(false);
      } else {
        alert(data.message || "사건 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div
      className="overlay overflow-y-auto overscroll-contain touch-pan-y"
      style={{ overflowY: 'auto' }}
      onClick={() => confirm("사건 등록을 취소하시겠습니까?") && setShowCaseForm(false)}
    >
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div
        className="w-[380px] md:w-[800px] mx-auto mt-20 mb-20 p-4 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="webtoonPart"></div>
        <input
          type="text"
          value={title}
          placeholder="제목"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full my-1 h-10 text-center rounded-lg transition-all duration-150"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
        />
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
          }}
        />

        <label
          htmlFor="imageInput"
          className="w-full my-1 h-10 cursor-pointer flex items-center justify-center rounded-lg transition-all duration-150"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
        >
          이미지 선택
        </label>
        {imagePreview && <img src={imagePreview} alt="Preview" className="w-full my-2 rounded-lg" style={{ border: '1px solid var(--border-primary)' }} />}
        <input
          type="text"
          value={result}
          placeholder="실제 선고 결과  ex) 징역 2년 6개월 / 벌금 500만원"
          onChange={(e) => setResult(e.target.value)}
          className="w-full my-1 h-10 text-center rounded-lg transition-all duration-150"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
        />
        <input
          type="text"
          value={result2}
          placeholder="집행유예 결과  ex) 3년 || 입력X"
          onChange={(e) => setResult2(e.target.value)}
          className="w-full my-1 h-10 text-center rounded-lg transition-all duration-150"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
        />
        <textarea
          className="textPart w-full min-h-[700px] text-center rounded-lg transition-all duration-150"
          placeholder="사건 내용"
          spellCheck={false}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
        ></textarea>
        <button
          disabled={isRegistering}
          className={`btn-primary w-full py-2 mb-2 ${isRegistering ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={registerCase}
        >
          {isRegistering ? "등록 중..." : "등록"}
        </button>
      </div>
    </div>
  );
};
export default CaseForm;
