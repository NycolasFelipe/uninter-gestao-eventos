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

  async createRole(user: IRoleCreate): Promise<IRoleCreateResponse> {
    return this.post(endpoint, user);
  }

  async updateRole(user: IRoleCreate, id: number): Promise<IResponseGeneric> {
    return this.patch(`${endpoint}/${id}`, user);
  }

  async deleteRole(id: number): Promise<IResponseGeneric> {
    return this.delete(`${endpoint}/${id}`);
  }
}

export default new RoleController();