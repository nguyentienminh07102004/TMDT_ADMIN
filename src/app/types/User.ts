export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface UserResponse {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  isLock: boolean;
}

export interface UserRequest {
  cinemaId: number | null;
  email: string;
  phone: string;
  fullName: string;
  password: string;
  role: Role | null;
}

export interface UserSearch {
  page: number;
  size: number;
  keyword?: string;
  role?: Role | null;
  isLock?: boolean;
}

export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  fullName: string;
  avatar: string | null;
}