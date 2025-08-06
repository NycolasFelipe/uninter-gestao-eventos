import EventStatus from "src/enum/EventStatus";

type EventStatusType = typeof EventStatus[keyof typeof EventStatus];

const getStatusClass = (status: EventStatusType, styles: any) => {
  switch (status) {
    case EventStatus.Draft: return styles.statusDraft;
    case EventStatus.Planned: return styles.statusPlanned;
    case EventStatus.Published: return styles.statusPublished;
    case EventStatus.Ongoing: return styles.statusOngoing;
    case EventStatus.Completed: return styles.statusCompleted;
    case EventStatus.Cancelled: return styles.statusCancelled;
    case EventStatus.Archived: return styles.statusArchived;
    default: return '';
  }
}

export default getStatusClass;