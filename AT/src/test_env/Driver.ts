import {Bridge, Proxy} from "../";

class Driver {
    public static makeBridge() {
        const bridge: Bridge = Proxy;
        return bridge;
    }
}

export {Driver};
