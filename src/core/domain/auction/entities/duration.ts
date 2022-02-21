import { Expose } from 'class-transformer';

export class DomainDuration {
  @Expose()
  private initial: number;

  @Expose()
  private current: number;

  constructor(duration: number) {
    this.current = duration;
    this.initial = duration;
  }

  public increaseCurrentDuration(amount: number) {
    this.current += amount;
  }

  public getCurrent(): number {
    return this.current;
  }

  public setCurrent(current: number): void {
    this.current = current;
  }

  public getInitial(): number {
    return this.initial;
  }

  public setInitial(initial: number): void {
    this.initial = initial;
  }
}
