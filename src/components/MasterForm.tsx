interface IComment {
  _id: String;
  userNickname: string;
  comment: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
}

const MasterForm = ({
  setMasterKey,
  comment,
  setCommentForMaster,
}: {
  setMasterKey: React.Dispatch<React.SetStateAction<boolean>>;
  comment: IComment | null;
  setCommentForMaster: React.Dispatch<React.SetStateAction<IComment | null>>;
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const deleteComment = async () => {
    const res = await fetch(`${apiUrl}/api/comment/delete/${comment?._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
      },
    });
    if (res.status === 200) {
      alert("댓글이 삭제되었습니다.");
      setCommentForMaster(null);
      setMasterKey(false);
      window.location.reload();
    } else {
      alert("댓글 삭제에 실패했습니다.");
    }
  };
  return (
    <div
      className="overlay"
      onClick={() => {
        setCommentForMaster(null);
        setMasterKey(false);
      }}
    >
      <div
        className="flex flex-col justify-center items-center gap-2 bg-green-200 w-[300px] h-[200px] border-4 rounded mx-auto mt-70"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="w-[90%] h-[40%] border rounded-xl active:scale-98"
          onClick={async () => {
            const res = await fetch(`${apiUrl}/api/change-nickname`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`,
              },
              body: JSON.stringify({
                nickname: comment?.userNickname,
              }),
            });
            if (res.status === 200) {
              alert("닉네임이 변경되었습니다.");
              setCommentForMaster(null);
              setMasterKey(false);
            } else if (res.status === 404) {
              alert("해당 닉네임의 유저를 찾을 수 없습니다.");
            } else {
              alert("닉네임 변경에 실패했습니다.");
            }
          }}
        >
          닉네임 <span className="text-blue-600">{comment?.userNickname}</span> 변경
        </button>
        <button className="w-[90%] h-[40%] border rounded-xl active:scale-98" onClick={() => deleteComment()}>
          댓글 <span className="text-blue-600">{comment?.comment.slice(0, 5) + "..."}</span> 삭제
        </button>
      </div>
    </div>
  );
};
export default MasterForm;
