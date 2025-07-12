// Interfaces
import type { IVenuePicture, IVenuePictureCreate } from "src/interfaces/IVenue";

// Controller
import BaseController from "./BaseController";

const endpoint = "/venues/picture";

class VenuePictureController extends BaseController {
  async getPicturesByVenue(venueId: number): Promise<IVenuePicture[]> {
    return this.get(`${endpoint}?venueId=${venueId}`);
  }

  async createVenuePicture(pictures: IVenuePictureCreate[]): Promise<void> {
    return this.post(endpoint, pictures);
  }

  async updateVenuePicture(picture: IVenuePictureCreate, id: number): Promise<IVenuePicture> {
    return this.patch(`${endpoint}/${id}`, picture);
  }

  async deleteVenuePicture(id: number): Promise<void> {
    return this.delete(`${endpoint}/${id}`);
  }
}

export default new VenuePictureController();