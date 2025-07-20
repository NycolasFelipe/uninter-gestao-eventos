// Interfaces
import type { IVenue, IVenueCreate, IVenueCreateResponse } from "src/interfaces/IVenue";

// Controller
import BaseController from "./BaseController";

const endpoint = "/venues";

class VenueController extends BaseController {
  async getVenues(): Promise<IVenue[]> {
    return this.get(endpoint);
  }

  async getVenuesSchool(id: number): Promise<IVenue[]> {
    return this.get(`${endpoint}/school/${id}`);
  }

  async createVenue(venue: IVenueCreate): Promise<IVenueCreateResponse> {
    return this.post(endpoint, venue);
  }

  async updateVenue(venue: any, id: number): Promise<IVenue> {
    return this.patch(`${endpoint}/${id}`, venue);
  }

  async deleteVenue(id: number): Promise<void> {
    return this.delete(`${endpoint}/${id}`);
  }
}

export default new VenueController();