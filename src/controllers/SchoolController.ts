// Interfaces
import type { ISchool, ISchoolCreate, ISchoolCreateResponse } from "src/interfaces/ISchool";
import type { IResponseGeneric } from "src/interfaces/IResponseGeneric";

// Controller
import BaseController from "./BaseController";

const endpoint = "/schools";

class SchoolController extends BaseController {
  async getSchools(): Promise<ISchool[]> {
    return this.get(endpoint);
  }

  async createSchool(school: ISchoolCreate): Promise<ISchoolCreateResponse> {
    return this.post(endpoint, school);
  }

  async updateUser(school: ISchoolCreate, id: number): Promise<IResponseGeneric> {
    return this.patch(`${endpoint}/${id}`, school);
  }

  async deleteSchool(id: number): Promise<IResponseGeneric> {
    return this.delete(`${endpoint}/${id}`);
  }
}

export default new SchoolController();