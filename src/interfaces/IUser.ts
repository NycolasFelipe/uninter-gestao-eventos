import type { IRole } from "./IRole";
import type { ISchool } from "./ISchool";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  profilePictureUrl: string | null;
  phoneNumber: string;
  school: string | null;
  role: string | null;
}

export interface IUserDetail extends Omit<IUser, "role" | "school"> {
  role: IRole;
  school: ISchool;
}

export interface IUserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string
  profilePictureUrl?: string;
  isActive?: boolean;
  schoolId?: number;
  roleId?: number;
}

export interface IUserCreateResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  isActive: boolean;
  schoolId: number | null;
  roleId: number | null;
}