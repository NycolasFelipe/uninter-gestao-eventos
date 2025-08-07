// Interfaces
import type { IResponseGeneric } from "src/interfaces/IResponseGeneric";
import type { ISubscription, ISubscriptionCreate, ISubscriptionCreateResponse } from "src/interfaces/ISubscription";

// Controller
import BaseController from "./BaseController";

const endpoint = "/subscriptions";

class SubscriptionController extends BaseController {
  async getSubscriptions(): Promise<ISubscription[]> {
    return this.get(`${endpoint}/my-subscriptions`);
  }

  async createSubscription(subscription: ISubscriptionCreate): Promise<ISubscriptionCreateResponse> {
    return this.post(endpoint, subscription);
  }

  async cancelSubscription(id: number): Promise<IResponseGeneric> {
    return this.get(`${endpoint}/cancel/${id}`);
  }
}

export default new SubscriptionController();