
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";





const axiosIntance = axios.create();






const onResponse = (response: AxiosResponse): AxiosResponse => {
  console.info(`[response] [${JSON.stringify(response)}]`);
  // history.replaceState(undefined, undefined, CMS_POSTS_PATH);
  const cookies = document.cookie
  console.log("cookies:: ",)
//   if (response.data?.error?.code === 6|| response.data?.error?.code === 8) {

//     const refreshToken = Cookies.get("refreshToken");
//     if (!refreshToken) {
//       return response;
//     }
//     authApi.refreshToken({ refreshToken }).then((data) => {
//       if (isApiSuccess(data)) {
//         saveCredentialCookie(getDataApi(data));
//         axiosIntance.request(data.config);
//       } else {
//         history.replaceState(undefined, "", LOGIN_PATH);
//         window.location.replace(LOGIN_PATH);
//         return response;
//       }
//     });
//   }
  return response;
};



// axiosIntance.interceptors.request.use(onRequest, onRequestError);
axiosIntance.interceptors.response.use(onResponse);

export default axiosIntance;