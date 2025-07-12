import type { EventStatus } from "src/enum/EventStatus";

export interface IEvent {
  id: number;
  schoolId: number;
  eventTypeId: number;
  organizerUserId: number;
  name: string;
  description?: string;
  objective?: string;
  targetAudience?: string;
  status: EventStatus;
  isPublic: boolean;
  school?: {
    id: number;
    name: string;
  };
  eventType?: {
    id: number;
    name: string;
  };
  organizer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface IEventCreate {
  schoolId: number;
  eventTypeId: number;
  name: string;
  description?: string;
  objective?: string;
  targetAudience?: string;
  status?: EventStatus;
  isPublic?: boolean;
}