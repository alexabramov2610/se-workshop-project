interface IUserDemoFields {
  iName: string;
  iAge: number;
}

class UserDemo {
  name: string;
  age: number;
  constructor(fields: IUserDemoFields) {
    this.name = fields.iName;
    this.age = fields.iAge;
  }

  printMyName(): void {
    console.log(this.name);
  }
}


export { UserDemo, IUserDemoFields };
