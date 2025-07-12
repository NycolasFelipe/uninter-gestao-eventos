// Interfaces
import type { IUser, IUserCreate, IUserCreateResponse, IUserDetail } from "src/interfaces/IUser";
import type { IResponseGeneric } from "src/interfaces/IResponseGeneric";

// Controller
import BaseController from "./BaseController";

const endpoint = "/users";

class UserController extends BaseController {
  async getUserDetail(id: number): Promise<IUserDetail> {
    const url = `${endpoint}/${id}/detail`;
    return this.get(url);
  }

  async getUsers(): Promise<IUser[]> {
    return this.get(endpoint);
  }

  async createUser(user: IUserCreate): Promise<IUserCreateResponse> {
    return this.post(endpoint, user);
  }

  async updateUser(user: IUserCreate, id: number): Promise<IResponseGeneric> {
    return this.patch(`${endpoint}/${id}`, user);
  }

  async deleteUser(id: number): Promise<IResponseGeneric> {
    return this.delete(`${endpoint}/${id}`);
  }
}

export default new UserController();