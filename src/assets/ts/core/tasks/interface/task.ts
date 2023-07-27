export interface Task {
  id?: string;
  title: string;
  description: string | null;
  completed: boolean | null;
  trash: boolean | null;
  list: string | null;
  createdAt: Date | null;
  dueDate: Date | null;
  priority: 'high' | 'medium' | 'low' | 'none';
}
