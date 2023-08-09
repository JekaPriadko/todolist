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
} from 'firebase/firestore';

import firebase from '../../firebase';
import { Task } from '../../entity/task';

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

    this.allItems = this.allItems.filter((item) => item.trash !== true);

    return this.allItems.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  public getCountAllItems(): number {
    return this.allItems.length;
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
      where('trash', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length;
  }
}

export default DataTasksUser;
