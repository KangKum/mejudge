import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div className="w-full h-full mx-auto px-6 py-16 text-white overflow-y-auto overscroll-contain touch-pan-y">
      <Helmet>
        <title>나의 판결 소개 | 판결문 기반 형량 판단 서비스</title>
        <meta
          name="description"
          content="나의 판결은 실제 판결문을 바탕으로 이용자가 직접 형량을 판단하고 실제 법원의 판결과 비교할 수 있는 법 판단 체험 서비스입니다."
        />
        <link rel="canonical" href="https://mejudge.com/about" />
      </Helmet>

      <h1 className="md:w-[50%] mx-auto text-3xl font-bold mb-6 text-center">판결문을 읽고 형량을 판단하는 서비스, 나의 판결</h1>

      <p className="w-[90%] md:w-[43%] mx-auto mb-8 leading-relaxed">
        나의 판결은 실제로 발생했던 형사 사건의 판결문을 바탕으로, 이용자가 사건의 사실관계를 읽고 직접 형량을 판단해볼 수 있는 법 판단 체험 플랫폼입니다.
        단순히 사건을 소비하는 것이 아니라, 왜 이런 판결이 내려졌는지를 스스로 고민해보는 경험을 제공합니다.
      </p>

      <h2 className="w-[90%] md:w-[43%] mx-auto text-xl font-semibold mb-3">실제 판결문 기반 판단 체험</h2>
      <p className="w-[90%] md:w-[43%] mx-auto mb-8 leading-relaxed">
        나의 판결에 수록된 사건들은 실제 법원에서 선고된 판결문을 바탕으로 구성되어 있습니다. 사기, 폭행, 강제추행, 공무집행방해 등 다양한 형사 사건을 통해
        형량이 결정되는 기준과 법원의 판단 과정을 자연스럽게 이해할 수 있습니다.
      </p>

      <h2 className="w-[90%] md:w-[43%] mx-auto text-xl font-semibold mb-3">나의 판결과 실제 판결의 비교</h2>
      <p className="w-[90%] md:w-[43%] mx-auto mb-8 leading-relaxed">
        사용자는 사건을 읽은 뒤 벌금, 집행유예, 징역 등 형량을 직접 선택할 수 있으며, 이후 실제 판사의 판결과 비교할 수 있습니다. 이를 통해 국민의 법 감정과
        사법 시스템 사이의 간극을 스스로 느껴보고 생각해볼 수 있습니다.
      </p>

      <h2 className="w-[90%] md:w-[43%] mx-auto text-xl font-semibold mb-3">법을 더 가깝게 만드는 목적</h2>
      <p className="w-[90%] md:w-[43%] mx-auto leading-relaxed mb-20">
        나의 판결은 법률 지식이 없는 일반 사용자도 부담 없이 접근할 수 있는 판결문 체험 서비스를 목표로 합니다. 사건을 판단하는 과정을 통해 법과 사회, 그리고
        개인의 책임에 대해 한 번 더 생각해보는 계기를 제공하고자 합니다.
      </p>
    </div>
  );
};

export default About;
