import { useEffect, useState } from "react";

const Rank = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [rankings, setRankings] = useState<Array<{ userId: string; nickname: string; totalLikes: number }>>([]);

  useEffect(() => {
    const fetchRankings = async () => {
      const res = await fetch(`${apiUrl}/api/ranking/user-likes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        setRankings(data);
      }
    };
    fetchRankings();
  }, []);
  return (
    <div className="md:w-[40%] w-[85%] flex flex-col mx-auto items-center">
      <div className="blankSpace h-8 md:h-12"></div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className="text-sm md:text-base font-bold mb-4 text-gray-600">오전 3시마다 갱신됩니다</h1>
        <div className="flex w-full h-12 justify-center items-center">
          <div className="w-[15%] h-full flex justify-center items-center md:text-xl text-lg border">순위</div>
          <div className="w-[50%] h-full flex justify-center items-center md:text-xl text-lg border">닉네임</div>
          <div className="w-[35%] h-full flex justify-center items-center md:text-xl text-lg border">좋아요 수</div>
        </div>
        {rankings.map((user, index) => (
          <div key={index} className="flex w-full h-10 justify-center items-center">
            <div className="w-[15%] h-full flex justify-center items-center">{index + 1}</div>
            <div className="w-[50%] h-full flex justify-center items-center">{user.nickname}</div>
            <div className="w-[35%] h-full flex justify-center items-center">{user.totalLikes}개</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Rank;
