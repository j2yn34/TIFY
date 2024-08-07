import { IoChevronBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  keywordListState,
  giftListState,
  userInfoState,
  transcriptState,
} from "../state/recoil";
import KeywordList from "../components/KeywordList";
import { ProductListType } from "../type";
import { useEffect, useState } from "react";
import LoadingFull from "../components/common/LoadingFull";
import { UserInfoState } from "../state/recoilType";
import ConfirmModal from "../components/common/ConfirmModal";
import { accessTokenState } from "../state/recoil";

const KeywordListPage = () => {
  const token = useRecoilValue<string>(accessTokenState);
  const keywordList = useRecoilValue<string[]>(keywordListState);
  const transcript = useRecoilValue<string>(transcriptState);
  const userInfo = useRecoilValue<UserInfoState>(userInfoState);
  const setGiftList = useSetRecoilState<ProductListType[]>(giftListState);
  const setKeywordList = useSetRecoilState(keywordListState);
  const [isReloaded, setIsReloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [showKeywordErrModal, setShowKeywordErrModal] =
    useState<boolean>(false);
  const [showGistListErrModal, setShowGistListErrModal] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const nickname = userInfo.nickname;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const submitKeywords = () => {
    setIsLoading(true);
    const queryString = keywordList
      .map((keyword: string) => `keyword=${keyword.trim()}`)
      .join("&");
    const url = `/api/api/v1/product/recommend?${queryString}`;

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Response:", res.data.data.items);
        setGiftList(res.data.data.items);
        setIsLoading(false);
        navigate("/giftlist");
      })
      .catch((err) => {
        console.error("Error:", err);
        setGiftList([]);
        setIsLoading(false);
        openGiftListErrModal();
      });
  };

  const reloadKeyword = () => {
    setIsLoading(true);
    setIsReloaded(true);
    console.log(transcript);
    axios
      .get(`/api/api/v1/ai/parsing/keyword?text=${transcript}`)
      .then((res) => {
        console.log("Response:", res.data);
        setKeywordList(res.data.data.keywordList);
        if (res.data.data.keywordList.length === 0) {
          setIsLoading(false);
          openKeywordErrModal();
        }
        console.log("keywordList: ", res.data.data.keywordList);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setKeywordList([]);
        setIsLoading(false);
        openKeywordErrModal();
      });
  };

  if (isLoading) {
    return <LoadingFull />;
  }
  const openKeywordErrModal = () => {
    setShowKeywordErrModal(true);
    document.body.style.overflow = "hidden";
  };

  const openGiftListErrModal = () => {
    setShowGistListErrModal(true);
    document.body.style.overflow = "hidden";
  };

  const goVoice = () => {
    setShowKeywordErrModal(false);
    document.body.style.overflow = "auto";
    navigate("/voice");
  };

  const goHome = () => {
    setShowKeywordErrModal(false);
    setShowGistListErrModal(false);
    document.body.style.overflow = "auto";
    navigate("/");
  };

  const onGoBackward = () => {
    setKeywordList([]);
    navigate("/voice");
  };

  return (
    <>
      <div className="px-5 full-height flex flex-col justify-between">
        <div className="absolute z-40 pt-8 -ml-1">
          <button onClick={onGoBackward}>
            <IoChevronBackSharp size={24} />
          </button>
        </div>
        <h1 className="pt-[84px] text-center font-semibold text-xl leading-8">
          {nickname ? `${nickname}` : "게스트"}님이
          <br />
          원하시는 선물은
        </h1>
        <div className="flex-center h-full mt-8 mb-9">
          <KeywordList />
        </div>
        <div className="relative">
          {showMessage && (
            <div className="absolute -top-9 w-fit bg-black px-2 rounded">
              <span className="text-center text-xs text-white">
                키워드가 아쉽다면 다시 불러와 보세요.
              </span>
            </div>
          )}
          <div className="flex-center mb-8">
            <button
              onClick={reloadKeyword}
              className={`basic-button border mr-2 ${
                isReloaded
                  ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white border-black"
              }`}
              disabled={isReloaded}
            >
              아니에요
            </button>
            <button
              onClick={submitKeywords}
              className="basic-button bg-black text-white"
            >
              맞아요
            </button>
          </div>
        </div>
      </div>
      {(keywordList.length === 0 || showKeywordErrModal) && (
        <div className="full-height">
          <ConfirmModal
            isSad={true}
            title={"키워드를 불러올 수 없어요."}
            text={"더 자세히 이야기해 보세요."}
            leftBtn={goVoice}
            confirm={goHome}
            leftName={"다시 할래요"}
            rightName={"홈으로"}
          />
        </div>
      )}
      {showGistListErrModal && (
        <div className="full-height">
          <ConfirmModal
            isSad={true}
            title={"딱 맞는 선물을 찾지 못했어요."}
            text={"더 자세히 이야기해 보세요."}
            leftBtn={goVoice}
            confirm={goHome}
            leftName={"다시 할래요"}
            rightName={"홈으로"}
          />
        </div>
      )}
    </>
  );
};

export default KeywordListPage;
