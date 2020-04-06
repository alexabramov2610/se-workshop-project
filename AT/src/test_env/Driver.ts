import { ServiceBridge, ProxyBridge } from "./exports";
class Driver {
  public static makeBridge() {
    const bridge: ProxyBridge = new ProxyBridge();
    //when its ready:
    // bridge.setReal(new ServiceAdapter());
    return bridge;
  }
}
export { Driver };
