// import api from "@/services/api";

// import login from "#/services/auth";
// import services from "#/services";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";

import setUserInfo from "./index";

import type {
  StoriesData,
  IRequestFetchTableData,
  IResponseFetchAccountData,
  IResponseFetchData,
} from "./data";
import { getStories, updateStories } from "../../../services/stories";

export const fetchStoriesTableData = createAsyncThunk<any, any>(
  "storiesData",
  async ({ params, sort, filters }) => {
    try {
      const res = await getStories(params, sort, filters);
      console.log("res:: ", res);

      if (res.status === 200) {
        return Promise.resolve(res?.data);
      } else {
        notification.error({ message: "Lỗi không lấy được dữ liệu" });
        return Promise.reject();
      }
    } catch (error) {
      notification.error({
        message: `Lỗi không lấy được dữ liệu`,
        //   description: error?.toString(),
      });
      return Promise.reject();
    }
  }
);

export const updateStoriesData = createAsyncThunk<StoriesData, any>(
  "updateStoriesData",
  async (formValues) => {
    try {
      const res = await updateStories(formValues?.id, formValues?.data);
      if (res?.data?.statusCode === 200) {
        notification.success({ message: "Cập nhật thành công" });
        return Promise.resolve(res?.data?.Stories);
      } else {
        notification.error({ message: "Cập nhật không thành công" });
        return Promise.reject();
      }
    } catch (error) {
      notification.error({
        message: `Cập nhật không thành công`,
        //   description: error?.toString(),
      });
      return Promise.reject();
    }
  }
);
