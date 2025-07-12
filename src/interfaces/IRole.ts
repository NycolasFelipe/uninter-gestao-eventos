import type { IPermission } from "./IPermission";

export interface IRole {
  id: number;
  roleName: string;
  description: string | null;
  permissions: IPermission[];
}

export interface IRoleCreate {
  roleName: string;
  description?: string;
}

export interface IRoleCreateResponse extends Omit<IRole, "permissions"> { }