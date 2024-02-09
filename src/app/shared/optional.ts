/**
 * A container object which may or may not contain a non-null value.
 * If a value is present, `isPresent()` will return true and `get()` will return the value.
 *
 * @template T the type of value
 */
export class Optional<T> {
  private readonly value: T | null | undefined;

  /**
   * Constructs an instance of Optional.
   *
   * @param {T | null | undefined} value The value to be stored in this Optional
   */
  private constructor(value: T | null | undefined) {
    this.value = value;
  }

  /**
   * Returns an Optional with the specified present non-null value.
   *
   * @template T the type of value
   * @param {T | null} value the value to be present
   * @return {Optional<T>} an Optional with the value present
   */
  public static of<T>(value: T | null): Optional<T> {
    return new Optional(value);
  }

  /**
   * Returns an empty Optional instance.
   *
   * @template T the type of value
   * @return {Optional<T>} an empty Optional
   */
  public static empty<T>(): Optional<T> {
    return new Optional<T>(undefined);
  }

  /**
   * If a value is present in this Optional, returns the value, otherwise throws an error.
   *
   * @return {T} the non-null value held by this Optional
   */
  public get(): T {
    if (this.value === null || this.value === undefined) {
      throw new Error("No value present");
    }
    return this.value;
  }

  /**
   * Returns true if there is a value present, otherwise false.
   *
   * @return {boolean} true if there is a value present, otherwise false
   */
  public isPresent(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  public isEmpty(): boolean {
    return !this.isPresent();
  }

  /**
   * If a value is present, performs the given action with the value, otherwise does nothing.
   *
   * @param {(value: T) => void} consumer block to be executed if a value is present
   */
  public ifPresent(consumer: (value: T) => void): void {
    if (this.value !== null && this.value !== undefined) {
      consumer(this.value);
    }
  }

  /**
   * If a value is present, performs the given action with the value, otherwise performs the given empty-based action.
   *
   * @param {(value: T) => void} consumer the action to be performed, if a value is present
   * @param {() => void} emptyAction the empty-based action to be performed, if no value is present
   */
  public ifPresentOrElse(consumer: (value: T) => void, emptyAction: () => void): void {
    if (this.value !== null && this.value !== undefined) {
      consumer(this.value);
    } else {
      emptyAction();
    }
  }

  /**
   * Returns the value if present, otherwise returns `other`.
   *
   * @param {T} other the value to be returned, if no value is present
   * @return {T} the value, if present, otherwise `other`
   */
  public orElse(other: T): T {
    return this.value !== null && this.value !== undefined ? this.value : other;
  }

  /**
   * If a value is present, applies the provided mapping function to it, and returns an Optional describing the result.
   *
   * @template R The type of the result of the mapping function
   * @param {(value: T) => R} fn a mapping function to apply to the value, if present
   * @return {Optional<R>} an Optional describing the result of applying a mapping function to the value of this Optional
   */
  public map<R>(fn: (value: T) => R): Optional<R> {
    if (this.isPresent()) {
      return Optional.of(fn(this.get()));
    } else {
      return Optional.empty();
    }
  }

  /**
   * If no value is present, performs the given action, otherwise does nothing.
   *
   * @param {() => void} action block to be executed if no value is present
   */
  public ifEmpty(action: () => void): void {
    if (this.isEmpty()) {
      action();
    }
  }

  orElseThrow(msg: string): T {
    if (!this.isPresent()) {
      throw new Error(msg);
    }
    return this.value as T;
  }

}
