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
    <div className="md:w-[40%] w-[85%] h-full flex flex-col mx-auto items-center">
      <div className="blankSpace h-4 md:h-8"></div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className="text-sm md:text-base font-bold text-gray-600 cursor-default hover:text-gray-400">오후 9시마다 갱신됩니다</h1>
        <div className="flex w-full h-12 justify-center items-center gap-1">
          <div className="w-[20%] h-full flex justify-center items-center md:text-lg cursor-default border-b">순위</div>
          <div className="w-[60%] h-full flex justify-center items-center md:text-lg cursor-default border-b">닉네임</div>
          <div className="w-[20%] h-full flex justify-center items-center md:text-lg cursor-default border-b">
            <FaThumbsUp />
          </div>
        </div>
        {loading ? (
          <div className="w-full mt-20 flex justify-center">{loadingText}</div>
        ) : (
          <div className="w-full overflow-y-auto overflow-x-hidden">
            {rankings.map((user, index) => (
              <div key={index} className="flex w-full h-10 justify-center items-center mt-2 rounded bg-gray-300 text-black">
                <div className="w-[20%] h-full flex justify-center items-center">{index + 1}위</div>
                <div className="w-[60%] h-full flex justify-center items-center">{user.nickname}</div>
                <div className="w-[20%] h-full flex justify-center items-center">{user.totalLikes}개</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Rank;
