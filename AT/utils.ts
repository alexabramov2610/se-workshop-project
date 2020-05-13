import { ServiceFacade } from "service_layer";


export const terminateSocket = async () => {
    await ServiceFacade.tradingSystem.terminateSocket()
}
