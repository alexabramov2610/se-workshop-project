import { Bridge, Proxy } from "../";
import { Credentials } from "./types";

class Driver {
  private initDefCredentials: Credentials = {
    userName: "admin",
    password: "admin",
  };
  private loginDefCredentials: Credentials = {
    userName: "ron",
    password: "avishay",
  };
  private sessionToken: string;
  private bridge: Bridge;
  constructor() {
    this.bridge = Proxy;
  }

  getBridge(): Bridge {
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

  initWithDefaults(): Driver {
    this.bridge.init(this.initDefCredentials);
    return this;
  }
  initWith(cred: Credentials): Driver {
    this.bridge.init(cred);
    return this;
  }
  startSession(): Driver {
    this.sessionToken = this.bridge.startSession().data.token;
    this.bridge.setToken(this.sessionToken);
    return this;
  }
  loginWith(cred: Credentials): Driver {
    this.bridge.login(cred);
    return this;
  }
  loginWithDefaults(): Driver {
    this.bridge.login(this.loginDefCredentials);
    return this;
  }
  registerWith(cred: Credentials): Driver {
    this.bridge.register(cred);
    return this;
  }
  registerWithDefaults(): Driver {
    this.bridge.register(this.loginDefCredentials);
    return this;
  }
}

export { Driver };
