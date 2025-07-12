export interface IEventType {
  id: number;
  name: string;
  description?: string;
}

export interface IEventTypeCreate {
  name: string;
  description?: string;
}