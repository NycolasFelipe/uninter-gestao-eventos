export interface IPermission {
  id: number;
  permissionName: string;
  description?: string;
}

export interface IPermissionCreate {
  permissionName: string;
  description?: string;
}