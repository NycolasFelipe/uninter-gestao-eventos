// Interfaces
import type { IEventType, IEventTypeCreate } from "../interfaces/IEventType";
import type { IResponseGeneric } from "../interfaces/IResponseGeneric";

// Controller
import BaseController from "./BaseController";

const endpoint = "/event-types";

class EventTypeController extends BaseController {
  async getEventTypes(): Promise<IEventType[]> {
    return this.get(endpoint);
  }

  async getEventTypeById(id: number): Promise<IEventType> {
    return this.get(`${endpoint}/${id}`);
  }

  async createEventType(eventType: IEventTypeCreate): Promise<IEventType> {
    return this.post(endpoint, eventType);
  }

  async updateEventType(eventType: IEventTypeCreate, id: number): Promise<IResponseGeneric> {
    return this.patch(`${endpoint}/${id}`, eventType);
  }

  async deleteEventType(id: number): Promise<IResponseGeneric> {
    return this.delete(`${endpoint}/${id}`);
  }
}

export default new EventTypeController();