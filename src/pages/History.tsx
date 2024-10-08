import { useState, useEffect } from "react";
import axios from "axios";
import HistoryList from "../components/HistoryList";
import { HistoryListType } from "../type";
import { useRecoilValue } from "recoil";
import { accessTokenState } from "../state/recoil";
import formatDate from "../hooks/formatDate";
import Notice from "../components/common/Notice";
import HistoryLoad from "../components/skeletonUI/HistoryLoad";
import ScrollToTopButton from "../components/buttons/ScrollToTopBtn";
import TitleHeader from "../components/common/TitleHeader";
import { useNavigate } from "react-router-dom";

const History = () => {
  const token = useRecoilValue<string>(accessTokenState);
  const [historyList, setHistoryList] = useState<HistoryListType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const getHistoryData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: "/api/api/v1/user/history",
          headers: { Authorization: `Bearer ${token}` },
          responseType: "json",
        });
        // console.log(response.data.data.history);
        setHistoryList(response.data.data.history);
        setIsLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setIsLoading(false);
      }
    };

    getHistoryData();
  }, []);

  type GroupedHistoryType = {
    [key: string]: HistoryListType[];
  };

  const transformHistoryData = (
    historyList: HistoryListType[]
  ): GroupedHistoryType => {
    const transformedData: GroupedHistoryType = {};

    historyList.forEach((item) => {
      const formattedDate = formatDate(item.date);

      if (!transformedData[formattedDate]) {
        transformedData[formattedDate] = [];
      }

      transformedData[formattedDate].push(item);
    });

    return transformedData;
  };

  const groupedHistory = transformHistoryData(historyList);

  return (
    <div className="relative w-full full-height px-5 mx-auto bg-purple-50">
      <TitleHeader
        goBack={() => navigate("/mypage")}
        pageTitle={"최근 본 선물"}
      />
      {isLoading ? (
        <div className="pt-[54px]">
          <HistoryLoad />
        </div>
      ) : (
        <>
          {historyList.length === 0 ? (
            <div className="flex-center full-height -mt-16">
              <Notice
                isSad={false}
                title={"최근 본 선물이 없어요."}
                text={"선물을 추천 받고 구경해 보세요."}
                nav="/voice"
                btnName="선물 고르러 가기"
              />
            </div>
          ) : (
            <div>
              <div className="w-[calc(100%+40px)] h-[26px] mb-8 pl-5 -ml-5 bg-gray-100">
                <span className="text-xs text-gray-600 font-medium">
                  최근 7일 동안의 기록을 볼 수 있어요.
                </span>
              </div>
              <main>
                {Object.keys(groupedHistory).map((date) => (
                  <HistoryList
                    key={date}
                    date={date}
                    products={groupedHistory[date]}
                  />
                ))}
              </main>
            </div>
          )}
        </>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default History;
