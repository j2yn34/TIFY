import Lottie from "lottie-react";
import LottieListen from "../assets/lottie/wait.json";

const DoneRequest = ({ transcript }: { transcript: string }) => {
  return (
    <div>
      <>
        <div className="pt-8">
          <div className="w-full flex justify-center -mb-4">
            <Lottie
              className="w-[120px] h-[120px]"
              animationData={LottieListen}
            />
          </div>
          <h1 className="text-center font-semibold text-xl leading-8">
            조금만 기다려주세요!
          </h1>
          <div className="flex-center pt-3.5">
            <div className="flex-center w-max px-4 h-7 bg-white border rounded-full border-orange-200">
              <span className="text-sm text-orange-500">
                딱 맞는 선물을 골라올게요.
              </span>
            </div>
          </div>
        </div>
      </>
      <div className="flex-center my-9 mx-auto min-w-[320px] max-w-72 min-h-[270px] max-h-80 border border-2 border-orange-500 bg-orange-0 rounded-lg overflow-hidden">
        <p className="py-8 text-center px-7 text-black font-medium leading-7 text-overflow">
          {transcript}
        </p>
      </div>
    </div>
  );
};

export default DoneRequest;
