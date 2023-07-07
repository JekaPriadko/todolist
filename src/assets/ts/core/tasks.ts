class TasksUser {
  private userId: string | null;
  private readyResolver: any;
  private readyPromise: Promise<void>;

  constructor(userId) {
    this.userId = userId;
    this.readyPromise = new Promise((resolve) => {
      this.readyResolver = resolve;
    });
    this.prepareContent();
  }

  public isReadyTasks() {
    return this.readyPromise;
  }

  private prepareContent() {
    console.log(this.userId);
    this.readyResolver();
  }
}

export default TasksUser;
