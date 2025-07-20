export default function getFormattedDate(baseDate: Date, options: {
  startOfDay?: boolean;
  daysOffset?: number;
  hoursOffset?: number;
} = {}): string {
  const date = new Date(baseDate);
  const hoursOffset = -3;

  if (options.startOfDay) {
    date.setHours(0, 0, 0, 0);
  }

  if (options.daysOffset) {
    date.setDate(date.getDate() + options.daysOffset);
  }

  if (options.hoursOffset) {
    date.setHours(date.getHours() + options.hoursOffset);
  }

  // Aplica o offset de fuso horário
  date.setHours(date.getHours() + hoursOffset);

  return date.toISOString().slice(0, 16);
}
