import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { IResponseFetchData, StoriesState } from "./data";
import { fetchStoriesTableData, updateStoriesData } from "./action";

const initialState: StoriesState = {
  dataStories: [],
  dataModel: {},
  storiesData: {},
  showDataStories: false,
};

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setStoriesData(state, action) {
      state.dataStories = action.payload;
    },
    setDataModel(state, action) {
      state.dataModel = action.payload;
    },

    setShowDataStories(state, action) {
      state.showDataStories = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchStoriesTableData.pending, (state) => {})
      .addCase(fetchStoriesTableData.fulfilled, (state, action) => {
        state.dataStories = action.payload;
      })
      .addCase(updateStoriesData.fulfilled, (state, action) => {
        const updateStoriesData: any = action.payload || {};

        const { _id: newId } = updateStoriesData;

        const updatedData = state.dataStories.map((stories: any) =>
          stories._id === newId ? updateStoriesData : stories
        );
        console.log("update:: ", updatedData);
        state.dataStories = updatedData;
      });
  },
});

const { actions, reducer } = storiesSlice;
export const { setDataModel, setStoriesData, setShowDataStories } = actions;
export default reducer;

// .addCase(createConnectors.fulfilled, (state, action) => {
//   const data: any = action.payload;
//   const Ids = data?._id;
//   console.log('id:: ', Ids);
//   state.connectorsTableData = {
//     ...state.connectorsTableData,
//     data: [...state.connectorsTableData.data, data].sort(
//       (a: any, b: any) => b._id - a._id
//     ),
//   };
// })
// .addCase(deleteConnectors.fulfilled, (state, action) => {
//   const deletedIds = action.payload || [];
//   console.log('delete:: ', deletedIds);
//   state.connectorsTableData = {
//     ...state.connectorsTableData,
//     data: state.connectorsTableData.data.filter(
//       (value) => value?._id !== deletedIds
//     ),
//   };
// })
