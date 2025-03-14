export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Format as "Month Year" (e.g. "January 2023")
  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}