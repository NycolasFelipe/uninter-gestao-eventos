import EventStatus from "./EventStatus";

const EventStatusTraduzido = {
  [EventStatus.Draft]: "Rascunho",
  [EventStatus.Planned]: "Planejado",
  [EventStatus.Published]: "Publicado",
  [EventStatus.Ongoing]: "Em Andamento",
  [EventStatus.Completed]: "Encerrado",
  [EventStatus.Cancelled]: "Cancelado",
  [EventStatus.Archived]: "Arquivado",
} as const;

export default EventStatusTraduzido;