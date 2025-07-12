// Interfaces
import type { IPermission, IPermissionCreate } from "src/interfaces/IPermission";
import type { IResponseGeneric } from "src/interfaces/IResponseGeneric";

// Controller
import BaseController from "./BaseController";

const endpoint = "/permissions";

class PermissionController extends BaseController {
  async getPermissions(): Promise<IPermission[]> {
    return this.get(endpoint);
  }

  async getPermissionById(id: number): Promise<IPermission> {
    return this.get(`${endpoint}/${id}`);
  }

  async createPermission(permission: IPermissionCreate): Promise<IPermission> {
    return this.post(endpoint, permission);
  }

  async updatePermission(permission: IPermissionCreate, id: number): Promise<IResponseGeneric> {
    return this.patch(`${endpoint}/${id}`, permission);
  }

  async deletePermission(id: number): Promise<IResponseGeneric> {
    return this.delete(`${endpoint}/${id}`);
  }
}

export default new PermissionController();