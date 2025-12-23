const AskForm = ({ setShowAskForm }: { setShowAskForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="overlay" onClick={() => setShowAskForm(false)}>
      <div className="bg-black border-4 flex flex-col justify-center items-center w-[85%] h-[150px] md:w-[30%] md:h-[200px] mx-auto mt-70 p-4 rounded-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">문의</h2>
        <h2 className="text-2xl font-bold mb-4">askmejudge@google.com</h2>
      </div>
    </div>
  );
};

export default AskForm;
