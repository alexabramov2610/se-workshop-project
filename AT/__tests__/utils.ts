import { ServiceFacade } from "service_layer";


export const terminateSocket = (): void => {
    ServiceFacade.tradingSystem.terminateSocket();
}
