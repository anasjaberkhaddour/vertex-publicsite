export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface UserInfo {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    permissions: string[];
  }
  
  export interface LoginResponse {
    token: string;
    expiresAt: string;
    user: UserInfo;
  }