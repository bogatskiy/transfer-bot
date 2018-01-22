module.exports = class Watcher {
  constructor(workers = [], timeout = 5000, timer) {
    this.workers = workers;
    this.timeout = timeout;
    this.timer = timer;
  }

  start() {
    this.timer = setTimeout(() => this._tick(), this.timeout)
  }

  stop() {
    clearTimeout(this.timer);
  }

  setTimeout(timeout = 5000) {
    this.timeout = timeout;
  }

  async _processing() {
    await Promise.all(
      this.workers.map(worker => {
        const { name, ...params } = worker;
        name.apply(this, [params]);
      }),
    );
  }

  _tick() {
    clearTimeout(this.timer);

    this._processing();

    this.timer = setTimeout(() => this._tick(), this.timeout);
  }
}
