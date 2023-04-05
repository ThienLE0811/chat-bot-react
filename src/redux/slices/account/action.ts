// import api from "@/services/api";

// import login from "#/services/auth";
// import services from "#/services";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";

import setUserInfo from "./index";

import type {
  AccountInfo,
  IRequestFetchTableData,
  IResponseFetchAccountData,
  IResponseFetchData,
} from "./data";

// import auth from "#/services/auth";

// export const fetchAccountTableData = createAsyncThunk<
//   IResponseFetchData<AccountInfo>,
//   IRequestFetchTableData
// >("accountData", async (params, { signal }) => {
//   try {
//     const { data, success, total } = await request
//       .get("", {
//         params,
//       })
//       .then((response:any) => ({
//         data: response.data,
//         total: response.data.length,
//         success: true,
//       }));

//     if (success) {
//       return Promise.resolve({
//         data,
//         total: total ?? 0,
//         success,
//       });
//     } else {
//       notification.error({ message: "Lỗi không lấy được dữ liệu" });
//       return Promise.reject();
//     }
//   } catch (error) {
//     notification.error({
//       message: `Lỗi không lấy được dữ liệu`,
//       //   description: error?.toString(),
//     });
//     return Promise.reject();
//   }
// });
