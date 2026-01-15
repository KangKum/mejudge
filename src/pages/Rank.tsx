import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa6";

const Rank = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [rankings, setRankings] = useState<Array<{ userId: string; nickname: string; totalLikes: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState("랭킹 확인중");

  useEffect(() => {
    const fetchRankings = async () => {
      const res = await fetch(`${apiUrl}/api/ranking/user-likes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        setRankings(data);
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchRankings();
  }, []);

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText("랭킹 확인중" + ".".repeat((i % 3) + 1));
      i++;
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="md:w-[40%] w-[85%] h-full flex flex-col mx-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="blankSpace h-2 md:h-3"></div>
      <div className="w-full h-full flex flex-col items-center">
        <div
          className="flex w-full h-12 justify-center items-center gap-1 rounded-t-lg"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-secondary)'
          }}
        >
          <div
            className="w-[20%] h-full flex justify-center items-center md:text-lg cursor-default"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
          >
            순위
          </div>
          <div
            className="w-[60%] h-full flex justify-center items-center md:text-lg cursor-default"
            style={{ color: 'var(--text-primary)' }}
          >
            닉네임
          </div>
          <div
            className="w-[20%] h-full flex justify-center items-center md:text-lg cursor-default"
            style={{ color: 'var(--accent-primary)' }}
          >
            <FaThumbsUp />
          </div>
        </div>
        {loading ? (
          <>
            <h1
              className="my-20 text-xl font-bold cursor-default transition-all duration-150"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              오후 9시마다 갱신됩니다
            </h1>
            <div className="w-full flex justify-center" style={{ color: 'var(--text-secondary)' }}>
              {loadingText}
            </div>
          </>
        ) : (
          <div className="w-full overflow-y-auto overflow-x-hidden">
            {rankings.map((user, index) => (
              <div
                key={index}
                className="flex w-full h-10 justify-center items-center mt-2 rounded"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <div
                  className="w-[20%] h-full flex justify-center items-center"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
                >
                  {index + 1}위
                </div>
                <div
                  className="w-[60%] h-full flex justify-center items-center"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {user.nickname}
                </div>
                <div
                  className="w-[20%] h-full flex justify-center items-center"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
                >
                  {user.totalLikes}개
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Rank;
