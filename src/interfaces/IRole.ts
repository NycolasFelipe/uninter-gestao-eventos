import type { IPermission } from "./IPermission";
import type { IUser } from "./IUser";

export interface IRole {
  id: number;
  roleName: string;
  description?: string;
  permissions?: IPermission[];
  users?: IUser[];
}

export interface IRoleCreate {
  roleName: string;
  description?: string;
}

export interface IRoleCreateResponse {
  id: number;
  roleName: string;
  description?: string;
}