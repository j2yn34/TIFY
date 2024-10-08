import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { UserInfoState } from "./recoilType";
import { ProductListType } from "../type";

const { persistAtom } = recoilPersist({
  key: "user",
  storage: sessionStorage,
});

export const accessTokenState = atom<string>({
  key: "accessToken",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const userInfoState = atom<UserInfoState>({
  key: "userInfo",
  default: {
    id: 0,
    nickname: "",
  },
  effects_UNSTABLE: [persistAtom],
});

export const transcriptState = atom<string>({
  key: "transcriptState",
  default: "",
});

export const keywordListState = atom<string[]>({
  key: "keywordListState",
  default: [],
});

export const giftListState = atom<ProductListType[]>({
  key: "giftListState",
  default: [],
});

export const commentState = atom<string>({
  key: "commentState",
  default: "",
});

export const onboardingState = atom<boolean>({
  key: "onboardingState",
  default: false,
});

export const isKeywordLoadingState = atom<boolean>({
  key: "isKeywordLoadingState",
  default: false,
});
