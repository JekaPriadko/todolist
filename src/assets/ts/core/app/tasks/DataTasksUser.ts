import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
  Firestore,
  Timestamp,
  query,
  where,
  Query,
} from 'firebase/firestore';

import firebase from '../../../firebase';
import { Task } from '../../../entity/task';
import { FilterData } from '../../../entity/filter';

import generateDateFilter from '../../../utils/generateDateFilter';

class DataTasksUser {
  private readonly db: Firestore;

  private userId: string | null;

  private allItems: Array<Task>;

  constructor(userId:string) {
    this.userId = userId;

    this.db = getFirestore(firebase);
  }

  public async getAllItems(
    filterData: FilterData
  ): Promise<Array<Task>> | null {
    const queryRequest = this.prepareQuery(filterData);
    if (!queryRequest) return null;

    const querySnapshot = await getDocs(queryRequest);

    this.allItems = querySnapshot.docs.map((task) => {
      const dueDate = task.data()?.dueDate;
      const dueDateFormat = dueDate ? task.data()?.dueDate.toDate() : null;

      return {
        id: task.id,
        title: task.data()?.title,
        description: task.data()?.description,
        completed: task.data()?.completed,
        trash: task.data()?.trash,
        list: task.data()?.list,
        createdAt: task.data()?.createdAt.toDate(),
        dueDate: dueDateFormat,
        priority: task.data()?.priority,
      };
    });

    return this.allItems.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  private prepareQuery(filterData: FilterData): Query | null {
    const baseQuery = collection(this.db, this.userId);
    const filterMap = {
      inbox: [where('trash', '==', false), where('completed', '==', false)],
      completed: [where('completed', '==', true), where('trash', '==', false)],
      trash: [where('trash', '==', true)],
      listId: [where('list', '==', filterData.listId)],
      today: [...generateDateFilter(new Date(), 0, 1)],
      tomorrow: [...generateDateFilter(new Date(), 1, 1)],
      week: [...generateDateFilter(new Date(), 0, 7)],
    };

    const filters = filterMap[filterData.filter];

    return filters ? query(baseQuery, ...filters) : null;
  }

  public getOneItem(id: string): Task {
    return this.allItems.find((item) => item.id === id);
  }

  public async createItem(task: Task): Promise<boolean> {
    try {
      await addDoc(collection(this.db, this.userId), {
        createdAt: Timestamp.fromDate(task.createdAt),
        dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
        ...task,
      });
    } catch (event) {
      console.error('Error adding task: ', event);
      return false;
    }

    return true;
  }

  public async updateItem(task: Task): Promise<boolean> {
    try {
      await setDoc(doc(this.db, this.userId, task.id), {
        ...task,
        dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
      });
    } catch (event) {
      console.error('Error update task: ', event);
      return false;
    }

    return true;
  }

  public async getTasksByList(listId: string): Promise<number> {
    const q = query(
      collection(this.db, this.userId),
      where('list', '==', listId),
      where('trash', '==', false),
      where('completed', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length;
  }
}

export default DataTasksUser;
