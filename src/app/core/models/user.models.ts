export interface UserListItem {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
    createdAt: string;
    roles: string[];
  }
  
  export interface UserDetails extends UserListItem {
    permissions: string[];
  }
  
  export interface CreateUserRequest {
    email: string;
    password: string;
    fullName: string;
    roles: string[];
  }
  
  export interface UpdateUserRequest {
    fullName: string;
    isActive: boolean;
  }
  
  export interface UpdateUserRolesRequest {
    roles: string[];
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
  }

  export interface ResetPasswordRequest {
    newPassword: string;
  }