export class User {
  private _name: string;
  private password: string;

  constructor(name: string, password: string) {
    this._name = name;
    this.password = password;
  }
  get name(): string {
    return this._name;
  }
}
