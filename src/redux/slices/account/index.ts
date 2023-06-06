import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { IResponseFetchData, AccountState } from "./data";

const initialState: AccountState = {
  accountInfo: {},
  dataModel: {},
  storiesData: {},
  train: false,
  showTrain: false,
  showError: false,
  loadingTrain: true,
  // showDataStories: false,
  currentParse: {},
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountInfo(state, action) {
      state.accountInfo = action.payload;
    },
    setDataModel(state, action) {
      state.dataModel = action.payload;
    },
    setStoriesData(state, action) {
      state.storiesData = action.payload;
    },
    setTrain(state, action) {
      state.train = action.payload;
    },
    setShowTrain(state, action) {
      state.showTrain = action.payload;
    },
    setLoadingTrain(state, action) {
      state.loadingTrain = action.payload;
    },
    setCurrentParse(state, action) {
      state.currentParse = action.payload;
    },
    setShowError(state, action) {
      state.showError = action.payload;
    },
    // setShowDataStories(state, action) {
    //   state.showDataStories = action.payload;
    // },
  },
  // extraReducers: {
  //   [accountLoginData.pending.type]: (state: AccountState) => {

  //   },
  //   [accountLoginData.fulfilled.type]: (
  //     state: AccountState,
  //     action: PayloadAction<IResponseFetchData<accountInfo>>
  //   ) => {
  //     notification.success({
  //     message: `Lấy dữ liệu thành công`,
  //   });
  //   console.log("payload::: ",action)
  //     state.accountInfo = action.payload
  //   },
  //   [accountLoginData.rejected.type]: (state: AccountState) => {
  //     notification.error({
  //     message: `Lỗi không lấy được dữ liệu khi đăng nhập`,
  //   });
  //   },
  // },
});

const { actions, reducer } = accountSlice;
export const {
  setAccountInfo,
  setDataModel,
  setStoriesData,
  setTrain,
  setShowTrain,
  setLoadingTrain,
  setCurrentParse,
  setShowError,
} = actions;
export default reducer;
