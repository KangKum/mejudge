const PrivacyForm = ({ setShowPrivacyForm }: { setShowPrivacyForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div
      className="overlay"
      style={{ overflowY: 'auto' }}
      onClick={() => setShowPrivacyForm(false)}
    >
      <div
        className="w-[90%] md:w-[45%] mx-auto mt-20 mb-20 p-4 rounded-xl overflow-y-auto overscroll-contain touch-pan-y"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-primary)'
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2
          className="text-2xl font-bold mb-4 w-full text-center"
          style={{ color: 'var(--text-emphasis)' }}
        >
          개인정보처리방침
        </h2>
        <div className="text-lg mt-4">1. 수집하는 개인정보 항목</div>
        <div className="pl-5">
          <li className="ml-5">아이디</li>
          <li className="ml-5">비밀번호</li>
          <li className="ml-5">닉네임</li>
          <p className="text-sm">※ 서비스 이용 과정에서 IP 주소, 접속 로그 등 일부 정보가 자동으로 생성·수집될 수 있습니다.</p>
        </div>
        <div className="text-lg mt-4">2. 개인정보 수집 및 이용 목적</div>
        <div className="pl-5">
          <li className="ml-5">회원 식별 및 로그인 기능 제공</li>
          <li className="ml-5">서비스 이용에 따른 본인 확인</li>
          <li className="ml-5">서비스 운영 및 관리</li>
          <li className="ml-5">부정 이용 방지 및 비인가 사용 방지</li>
        </div>
        <div className="text-lg mt-4">3. 개인정보 보유 및 이용 기간</div>
        <div className="pl-5">
          <li className="ml-5">회원 탈퇴 시, 수집된 개인정보는 지체 없이 파기됩니다.</li>
          <li className="ml-5">단, 관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.</li>
        </div>
        <div className="text-lg mt-4">4. 개인정보의 파기 절차 및 방법</div>
        <div className="pl-5">
          <li className="ml-5">전자적 파일 형태의 개인정보는 복구할 수 없는 방법으로 즉시 삭제합니다.</li>
          <li className="ml-5">종이 문서 형태로 보관된 개인정보는 파쇄 또는 소각을 통해 파기합니다.</li>
        </div>
        <div className="text-lg mt-4">5. 개인정보의 제3자 제공</div>
        <div className="pl-5">본 서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</div>
        <div className="text-lg mt-4">6. 개인정보 보호를 위한 조치</div>
        <div className="pl-5">
          <li className="ml-5">비밀번호 암호화 저장</li>
          <li className="ml-5">개인정보 접근 권한 최소화</li>
          <li className="ml-5">보안 취약점 점검 및 관리</li>
        </div>
        <div className="text-lg mt-4">7. 개인정보 보호책임자</div>
        <div className="pl-5">
          <div>askmejudge@google.com</div>
        </div>
        <div className="text-lg mt-4">8. 개인정보처리방침 변경</div>
        <div className="pl-5">본 개인정보처리방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지를 통해 안내합니다.</div>
        <div className="w-full flex justify-center h-10 mt-8">
          <button className="btn-secondary px-4" onClick={() => setShowPrivacyForm(false)}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyForm;
