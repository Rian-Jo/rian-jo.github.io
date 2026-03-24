export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatYear(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
