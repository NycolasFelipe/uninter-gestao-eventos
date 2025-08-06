export interface ISubscription {
  id: number;
  event: {
    id: number;
    name: string;
    objective: string;
    status: string;
    targetAudience: string;
    isPublic: boolean;
    startDate: string;
    endDate: string;
    eventType: {
      id: number;
      name: string;
      description: string;
    }
    school: {
      id: number;
      name: string;
      address: string;
    }
    venue: {
      id: number;
      address: string;
      capacity: number;
      isInternal: boolean;
      name: string;
      schoolId: number;
    }
  }
  createdAt: string;
}

export interface ISubscriptionCreate {
  eventId: number;
}

export interface ISubscriptionCreateResponse extends ISubscription { }