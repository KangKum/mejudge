const AskForm = ({ setShowAskForm }: { setShowAskForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="overlay" onClick={() => setShowAskForm(false)}>
      <div
        className="flex flex-col justify-center items-center w-[85%] h-[150px] md:w-[30%] md:h-[200px] mx-auto mt-70 p-4 rounded-xl overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)'
        }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-emphasis)' }}>
          문의
        </h2>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>
          askmejudge@google.com
        </h2>
      </div>
    </div>
  );
};

export default AskForm;
