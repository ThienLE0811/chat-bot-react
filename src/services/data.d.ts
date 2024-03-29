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
  userInfo?: {
    userRoleName: string;
    
  };
  token?: string
}

export interface PostsInfo {}

export interface IntentInfo {}