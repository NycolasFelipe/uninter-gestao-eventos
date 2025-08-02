// Interfaces
import type { IEvent, IEventCreate } from "../interfaces/IEvent";
import type { IResponseGeneric } from "../interfaces/IResponseGeneric";

// Controller
import BaseController from "./BaseController";

const endpoint = "/events";

class EventController extends BaseController {
  async getEvents(): Promise<IEvent[]> {
    return this.get(endpoint);
  }

  async getEventsByStatus(params: { status?: string[]; limit?: number }): Promise<IEvent[]> {
    const DEFAULT_STATUS = ["Draft", "Planned", "Published", "Ongoing"];
    const DEFAULT_LIMIT = 10;

    const statusParams = params?.status?.join(", ") || DEFAULT_STATUS.join(", ");
    const limitParams = params?.limit?.toString() || DEFAULT_LIMIT.toString();

    const query = `?status=${statusParams}&limit=${limitParams}`;

    return this.get(`${endpoint}${query}`);
  }

  async getEventById(id: number): Promise<IEvent> {
    return this.get(`${endpoint}/${id}`);
  }

  async createEvent(event: IEventCreate): Promise<IEvent> {
    return this.post(endpoint, event);
  }

  async updateEvent(event: IEventCreate, id: number): Promise<IResponseGeneric> {
    return this.patch(`${endpoint}/${id}`, event);
  }

  async deleteEvent(id: number): Promise<IResponseGeneric> {
    return this.delete(`${endpoint}/${id}`);
  }
}

export default new EventController();