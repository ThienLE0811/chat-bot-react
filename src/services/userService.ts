import { notification } from "antd";
import axios from "axios";
import { API_URL } from "./trainService";

const handleLoginApi = async (userName: string, password: string) => {
  return await axios.post(`${API_URL}/auth/login`, {
    userName,
    password,
  });
};

const handleLogoutApi = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
    localStorage.clear();
  } catch (error) {
    console.error(error);
  }
};

/** Đăng ký công khai: tài khoản mới luôn thuộc nhóm VIEWER. */
const handleSingUpApi = async (data: any) => {
  return await axios.post(`${API_URL}/auth/register`, data);
};

export interface Me {
  user: any;
  role: { code: string; name: string } | null;
  permissions: string[];
}

/** Người đang đăng nhập và quyền hiện tại của họ. */
const getMe = async (): Promise<Me> => {
  const response = await axios.get<Me>(`${API_URL}/auth/me`);
  return response.data;
};

export interface UpdateMeInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  /** Chỉ gửi khi đổi mật khẩu, kèm currentPassword. */
  newPassword?: string;
  currentPassword?: string;
}

/** Tự sửa tài khoản của mình: ai đăng nhập cũng được, không đổi được nhóm quyền. */
const updateMe = async (values: UpdateMeInput): Promise<Me> => {
  const response = await axios.put<Me>(`${API_URL}/auth/me`, values);
  return response.data;
};

const getUser = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/users/getList`, {});
    if (response?.statusText === "OK") {
      return Promise.resolve(response);
    } else {
      notification.error({ message: "Không lấy được dữ liệu" });
      return Promise.reject();
    }
  } catch (error) {
    notification.error({ message: "Không lấy được dữ liệu" });
    return Promise.reject();
  }
};

const getUserId = async (userId: any) => {
  return await axios.get(`${API_URL}/users/${userId}`, {});
};

const deleteUser = async (userId: string) => {
  return await axios.delete(`${API_URL}/users/delete/${userId}`, {});
};

/** Admin tạo tài khoản và chọn nhóm quyền (roleCode). */
const createUser = async (formValues: any) => {
  return await axios.post(`${API_URL}/users/create`, formValues);
};

const updateUser = async (id: string, formValues: any) => {
  return await axios.put(`${API_URL}/users/update/${id}`, formValues);
};

export {
  handleLoginApi,
  handleLogoutApi,
  handleSingUpApi,
  getMe,
  updateMe,
  getUser,
  deleteUser,
  updateUser,
  createUser,
  getUserId,
};
