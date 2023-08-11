import { Timestamp, where } from 'firebase/firestore';

export default function generateDateFilter(
  date: Date,
  daysToAdd: number,
  daysRange: number
) {
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(0, 0, 0, 0);

  const startOfDay = Timestamp.fromDate(date);
  const endOfDay = Timestamp.fromDate(
    new Date(date.getTime() + daysRange * 24 * 60 * 60 * 1000)
  );

  return [where('dueDate', '>=', startOfDay), where('dueDate', '<=', endOfDay)];
}
