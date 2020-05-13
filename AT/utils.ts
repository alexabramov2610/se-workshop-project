import { ServiceFacade } from "service_layer";


export const terminateSocket =  () => {
     ServiceFacade.tradingSystem.terminateSocket()
}
