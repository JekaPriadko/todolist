// eslint-disable-next-line
class EventEmitter<T = any> {
  private listeners: Record<string, ((data: T) => void)[]> = {};

  constructor() {
    this.listeners = {};
  }

  public subscribe(event: string, callback: (data: T) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  public emit(event: string, data?: T): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

export default EventEmitter;
