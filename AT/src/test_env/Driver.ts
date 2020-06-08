import { Bridge, Proxy, Adapter } from "../..";

import { Credentials, User, Store, Product } from "./types";
import { Res } from "se-workshop-20-interfaces"



class Driver {
  private mutant: { p: Product[]; s: Store; u: User };
  private refMe: any;
  private _pi;
  private initDefCredentials: Credentials = {
    userName: "admin",
    password: "admin123",
  };
  constructor() {
    this.bridge = Adapter;
    this.refMe = this.given;
    this._pi = {
      payment: {  
        cardDetails: {
          holderName: "Mr Cat",
          number: "4242424242424242",
          expMonth: "12",
          expYear: "28",
          cvv: "123",
        },
        address: "St. Cats 123",
        city: "Cat City",
        country: "CatZone",
      },
    };
  }

  private loginDefCredentials: Credentials = {
    userName: "ron",
    password: "avishay",
  };
  private sessionToken: string;
  private bridge: Partial<Bridge>;

  getBridge(): Partial<Bridge> {
    return this.bridge;
  }

  getSessionToken(): string {
    return this.sessionToken;
  }

  getLoginDefaults(): Credentials {
    return this.loginDefCredentials;
  }

  getInitDefaults(): Credentials {
    return this.initDefCredentials;
  }

  getPaymentInfo() {
    return this._pi;
  }

  async initWithDefaults(): Promise<Driver> {
    await this.bridge.init(this.initDefCredentials);
    return this;
  }

  async initWith(cred: Credentials): Promise<Driver> {
    await this.bridge.init(cred);
    return this;
  }

  async startSession(): Promise<Driver> {
    const res = await this.bridge.startSession();
    const x = res.data
    // this.sessionToken =  res.data.token
    this.bridge.setToken(this.sessionToken);
    return this;
  }

  async loginWith(cred: Credentials): Promise<Driver> {
    await this.bridge.login(cred);
    return this;
  }

  async loginWithDefaults(): Promise<Driver> {
    await this.bridge.login(this.loginDefCredentials);
    return this;
  }

  async registerWith(cred: Credentials): Promise<Driver> {
    await this.bridge.register(cred);
    return this;
  }

  async registerWithDefaults(): Promise<Driver> {
    await this.bridge.register(this.loginDefCredentials);
    return this;
  }

  given: IGiven = {
    shopper: (u: User) => {
      this.mutant = { ...this.mutant, u: u };
      return this.given;
    },
    store: (s: Store) => {
      this.mutant = { ...this.mutant, s: s };
      return this.given;
    },
    products: (p: Product[]) => {
      this.mutant = { ...this.mutant, p: p };
      return this;
    },
  };

  // makeABuy(amount: number = 1): Res.PurchaseResponse {
  //   this.mutant.p.map((p) =>
  //     this.bridge.saveProductToCart({
  //       body: {
  //         storeName: this.mutant.s.name,
  //         catalogNumber: p.catalogNumber,
  //         amount,
  //       },
  //     })
  //   );

    // return this.bridge.purchase({ body: this._pi });
  // }

  // resetState() {
  //   this.bridge.reset();
  //   return this;
  // }
}
interface IGiven {
  shopper: (u: User) => IGiven;
  store: (s: Store) => IGiven;
  products: (p: Product[]) => Driver;
}
export { Driver };
