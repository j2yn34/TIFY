import Notice from "../components/common/Notice";

const PreparingPage = () => {
  return (
    <div className="full-height flex-center flex-col pt-28">
      <Notice
        isSad={true}
        title={"서비스 준비중이에요."}
        text={"조금만 기다려 주세요."}
        nav="/"
        btnName="홈으로 가기"
      />
    </div>
  );
};

export default PreparingPage;
