import { where } from 'firebase/firestore';

import generateDateFilter from '../utils/generateDateFilter';

export const filterInfo = {
  inbox: {
    title: 'Inbox',
  },
  today: {
    title: 'Today',
  },
  tomorrow: {
    title: 'Tomorrow',
  },
  week: {
    title: 'Week',
  },
  completed: {
    title: 'Completed',
  },
  trash: {
    title: 'Trash',
  },
};

export const filterMapForCount = {
  inbox: [where('trash', '==', false), where('completed', '==', false)],
  today: generateDateFilter(new Date(), 0, 1),
  tomorrow: generateDateFilter(new Date(), 1, 1),
  week: generateDateFilter(new Date(), 0, 7),
};
