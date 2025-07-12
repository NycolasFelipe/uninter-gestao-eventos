// Interfaces
import type { IRole, IRoleCreate, IRoleCreateResponse } from "src/interfaces/IRole";
import type { IResponseGeneric } from "src/interfaces/IResponseGeneric";

// Controller
import BaseController from "./BaseController";

const endpoint = "/roles";

class RoleController extends BaseController {
  async getRoles(): Promise<IRole[]> {
    return this.get(endpoint);
  }

  async getRolesWithUsers(): Promise<IRole[]> {
    return this.get(`${endpoint}/users`);
  }

  async getRoleById(id: number): Promise<IRole> {
    return this.get(`${endpoint}/${id}`);
  }

  async createRole(role: IRoleCreate): Promise<IRoleCreateResponse> {
    return this.post(endpoint, role);
  }

  async updateRole(role: IRoleCreate, id: number): Promise<IResponseGeneric> {
    return this.patch(`${endpoint}/${id}`, role);
  }

  async deleteRole(id: number): Promise<IResponseGeneric> {
    return this.delete(`${endpoint}/${id}`);
  }

  async assignPermissions(roleId: number, permissionsIds: number[]): Promise<IResponseGeneric> {
    return this.post(`${endpoint}/${roleId}/permissions`, { permissionsIds });
  }
}

export default new RoleController();