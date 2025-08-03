import type { EventStatus } from "src/enum/EventStatus";

export interface IEvent {
  id: number;
  name: string;
  description?: string;
  objective?: string;
  targetAudience?: string;
  status: EventStatus;
  isPublic: boolean;
  startDate: string;
  endDate: string;
  school: {
    id: number;
    name: string;
    address: string;
  }
  eventType: {
    id: number;
    name: string;
    description: string;
  }
  organizer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string;
    role: {
      roleName: string;
    }
  }
  venue: {
    id: number;
    schoolId: number;
    name: string;
    address: string;
    capacity: number;
    isInternal: boolean;
    venuePictures: Array<{
      id: number;
      venueId: number;
      pictureUrl: string;
    }>
  }
}

export interface IEventCreate {
  name: string;
  description?: string;
  objective?: string;
  targetAudience?: string;
  status: EventStatus;
  isPublic: boolean;
  schoolId: number;
  eventTypeId: number;
  venueId: number;
  startDate: string;
  endDate: string;
}
