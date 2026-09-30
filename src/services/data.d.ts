/** `data` của POST /auth/login (sau khi bóc envelope { status, data }). */
export interface LoginResponseSuccessData {
  /** JWT gửi kèm header Authorization. */
  accessToken?: string;
  userInfo?: {
    _id: string;
    userName: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roleCode?: string;
    createdAt?: string;
    updateAt?: string;
  };
}

export interface PostsInfo {}

export interface IntentInfo {}
