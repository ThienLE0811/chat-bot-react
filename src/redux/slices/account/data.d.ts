import { LoginResponseSuccessData } from "#/lib/openapi";
import { SortOrder } from "antd/es/table/interface";

export interface AccountState {
  accountInfo: LoginResponseSuccessData;
  dataModel: {};
  storiesData: {};
  train: boolean;
  showTrain: boolean;
  loadingTrain: boolean;
}

export interface IRequestFetchTableData {
  params: {
    pageSize?: number;
    current?: number;
    keyword?: string;
  };
  sort: Record<string, SortOrder>;
  filter: Record<string, (string | number)[] | null>;
}
export interface IResponseFetchData<T> {
  data: T[];
  total: number;
  success: boolean;
}

export interface AccountInfo {
  email: string;
  createdAt: Date;
  updateAt: Date;
  firstName: string;
  lastName: string;
  userName: string;
  userRoleName: string;
  userRole: {};
}

export interface LoginResponseSuccessData {
  /**
   * token user
   * @type {string}
   * @memberof LoginResponseSuccessData
   */
  accessToken?: string;
  /**
   * userId của người dùng
   * @type {string}
   * @memberof LoginResponseSuccessData
   */
  userId?: string;
  /**
   * Refresh token
   * @type {string}
   * @memberof LoginResponseSuccessData
   */
  refreshToken?: string;
  /**
   *
   * @type {string}
   * @memberof LoginResponseSuccessData
   */
  tokenType?: string;
  /**
   *
   * @type {number}
   * @memberof LoginResponseSuccessData
   */
  expires?: number;
}

export interface IResponseFetchAccountData<T> {
  data: T[];
  // total: number;
  success: boolean;
}

export interface IResponseFetchAccountData<T> {
  data: T[];
  success: boolean;
}

export interface IRequestCreateData<T> {
  record: T;
  caseId: string;
}

export interface IRequestUpdateData<T> {
  record: T;
  caseId: string;
}

export interface IRequestDeleteOneData {
  id: string | number;
  caseId: string;
}

export interface IResponseDeleteOneData {
  id: string | number;
}

export interface IRequestDeleteManyData {
  caseId: string;
}
