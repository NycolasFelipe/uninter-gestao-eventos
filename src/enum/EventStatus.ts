const EventStatus = {
  Draft: "Draft",
  Planned: "Planned",
  Published: "Published",
  Ongoing: "Ongoing",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Archived: "Archived",
} as const;

export type EventStatus = typeof EventStatus[keyof typeof EventStatus];

export default EventStatus;