export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class Deferred<T> {
  readonly promise: Promise<T>;
  #resolve: (value: T) => void = Deferred.#promiseIsBroken;
  #reject: (reason?: unknown) => void = Deferred.#promiseIsBroken;

  static #promiseIsBroken = (): void => {
    throw new Error("Promise API is broken");
  };

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  resolve = (value: T): void => this.#resolve(value);
  reject = (reason: unknown): void => this.#reject(reason);
}
