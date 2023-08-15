export type PossibleFilterStatus =
  | 'inbox'
  | 'today'
  | 'tomorrow'
  | 'week'
  | 'completed'
  | 'trash'
  | 'listId';

export type FilterData = {
  filter: PossibleFilterStatus;
  listId?: string;
};
