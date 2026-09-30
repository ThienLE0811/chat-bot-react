import { notification } from "antd";
import axios from "axios";
import { API_URL } from "./trainService";

export interface PermissionModule {
  module: string;
  label: string;
  description: string;
  permissions: { key: string; label: string }[];
}

export interface Role {
  _id: string;
  code: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
}

export interface RoleInput {
  code?: string;
  name: string;
  description?: string;
  permissions: string[];
}

/** Nhóm quyền, trả nguyên response cho ProTable. */
const getRoles = async (): Promise<any> => {
  try {
    return await axios.get<Role[]>(`${API_URL}/roles`);
  } catch (error) {
    notification.error({ message: "Không lấy được danh sách nhóm quyền" });
    return Promise.reject(error);
  }
};

/** Danh mục quyền theo module, để dựng các ô chọn quyền. */
const getPermissionCatalog = async (): Promise<PermissionModule[]> => {
  const response = await axios.get<PermissionModule[]>(
    `${API_URL}/roles/permissions`
  );
  return response.data;
};

const createRole = async (values: RoleInput) => {
  return await axios.post<Role>(`${API_URL}/roles`, values);
};

const updateRole = async (id: string, values: RoleInput) => {
  const { code, ...rest } = values;
  return await axios.put<Role>(`${API_URL}/roles/${id}`, rest);
};

const deleteRole = async (id: string) => {
  return await axios.delete(`${API_URL}/roles/${id}`);
};

/** Lựa chọn nhóm quyền cho form người dùng. */
const getRoleOptions = async () => {
  const response = await axios.get<Role[]>(`${API_URL}/roles`);
  return response.data.map((role) => ({
    label: `${role.name} (${role.code})`,
    value: role.code,
  }));
};

export {
  getRoles,
  getPermissionCatalog,
  createRole,
  updateRole,
  deleteRole,
  getRoleOptions,
};
