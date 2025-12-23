const TermsForm = ({ setShowTermsForm }: { setShowTermsForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="overlay" onClick={() => setShowTermsForm(false)}>
      <div
        className="bg-black border-4 w-[90%] h-[700px] md:w-[45%] md:h-[700px] mx-auto mt-20 p-4 rounded-lg overflow-y-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2 className="text-2xl font-bold mb-4 w-full text-center">이용약관</h2>
        <div>본 약관은 MeJudge에서 제공하는 웹서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</div>
        <div className="text-lg mt-4">제1조 (목적)</div>
        <div className="ml-5">본 약관은 회원이 서비스를 이용함에 있어 필요한 기본적인 사항을 규정합니다.</div>
        <div className="text-lg mt-4">제2조 (회원가입)</div>
        <div className="pl-5">
          <li className="ml-5">이용자는 서비스가 정한 절차에 따라 회원가입을 신청할 수 있습니다.</li>
          <li className="ml-5">회원가입 시 제공한 정보는 정확해야 하며, 허위 정보로 인한 책임은 이용자 본인에게 있습니다.</li>
        </div>
        <div className="text-lg mt-4">제3조 (회원의 의무)</div>
        <div className="ml-5">이용자는 다음 행위를 하여서는 안 됩니다.</div>
        <div className="pl-5">
          <li className="ml-5">타인의 계정 정보 도용</li>
          <li className="ml-5">서비스 운영을 방해하는 행위</li>
          <li className="ml-5">불법적이거나 부적절한 콘텐츠 게시</li>
          <li className="ml-5">관련 법령을 위반하는 행위</li>
        </div>
        <div className="text-lg mt-4">제4조 (서비스의 제공 및 변경)</div>
        <div className="pl-5">
          <li className="ml-5">서비스는 안정적인 제공을 위해 노력합니다.</li>
          <li className="ml-5">서비스의 내용은 운영상 또는 기술상 필요에 따라 변경될 수 있습니다.</li>
        </div>
        <div className="text-lg mt-4">제5조 (서비스 이용 제한)</div>
        <div className="ml-5">서비스는 다음의 경우 사전 통지 없이 이용을 제한하거나 회원 자격을 정지할 수 있습니다.</div>
        <div className="pl-5">
          <li className="ml-5">본 약관을 위반한 경우</li>
          <li className="ml-5">법령을 위반하거나 사회 질서에 반하는 행위를 한 경우</li>
          <li className="ml-5">서비스의 정상적인 운영을 방해한 경우</li>
        </div>
        <div className="text-lg mt-4">제6조 (책임의 제한)</div>
        <div className="pl-5">
          <li className="ml-5">서비스는 이용자가 작성한 콘텐츠에 대한 책임을 지지 않습니다.</li>
          <li className="ml-5">서비스는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
        </div>
        <div className="text-lg mt-4">제7조 (약관의 변경)</div>
        <div className="ml-5">본 약관은 필요 시 변경될 수 있으며, 변경 사항은 서비스 내 공지를 통해 안내합니다.</div>
        <div className="text-lg mt-4">제8조 (준거법 및 관할)</div>
        <div className="ml-5">본 약관은 대한민국 법령을 따르며, 서비스와 이용자 간 분쟁은 대한민국 법원을 관할로 합니다.</div>
        <div className="w-full flex justify-center h-10 mt-8">
          <button className="bg-gray-500 px-4 rounded" onClick={() => setShowTermsForm(false)}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsForm;
