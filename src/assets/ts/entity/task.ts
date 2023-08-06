export enum Priority {
  High = 3,
  Medium = 2,
  Low = 1,
  Off = 0,
}

export interface Task {
  id?: string;
  title: string;
  description: string | null;
  completed: boolean | null;
  trash: boolean | null;
  list: string | null;
  createdAt: Date | null;
  dueDate: Date | null;
  priority: Priority;
}
