import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Firestore,
} from 'firebase/firestore';

import firebase from '../../firebase';
import { Task } from './interface/task';

class DataTasksUser {
  private db: Firestore;

  private userId: string | null;

  private allItems: Array<Task>;

  constructor(userId) {
    this.userId = userId;

    this.db = getFirestore(firebase);
  }

  public async getAllItems(): Promise<Array<Task>> {
    const querySnapshot = await getDocs(collection(this.db, this.userId));

    this.allItems = querySnapshot.docs.map((task) => ({
      id: task.id,
      title: task.data()?.title,
      description: task.data()?.description,
      completed: task.data()?.completed,
      trash: task.data()?.trash,
      list: task.data()?.list,
      created: task.data()?.created,
      dueDate: task.data()?.dueDate,
      priority: task.data()?.priority,
    }));

    return this.allItems;
  }

  public getCountAllItems(): number {
    return this.allItems.length;
  }

  public async createItem(task: Task): Promise<boolean> {
    try {
      await addDoc(collection(this.db, this.userId), task);
    } catch (event) {
      console.error('Error adding task: ', event);
      return false;
    }

    return true;
  }
}

export default DataTasksUser;
