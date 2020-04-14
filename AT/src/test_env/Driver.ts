import {Bridge, Proxy} from "../";

class Driver {
    public static makeBridge() {
        const bridge: Bridge = new Proxy();
        //when its ready:
        // bridge.setReal(new Adapter());
        return bridge;
    }
}

export {Driver};
