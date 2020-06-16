import {DeliverySystem} from "./delivery_system/DeliverySystem"
import {PaymentSystem} from "./payment_system/PaymentSystem"
import {SecuritySystem} from "./security_system/SecuritySystem"
import {errorMsg, ExternalSystems, loggerW} from "../api-int/internal_api"
import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";
const logger = loggerW(__filename)

export class ExternalSystemsManager {
    private _paymentSystem: PaymentSystem;
    private _deliverySystem: DeliverySystem;
    private _securitySystem: SecuritySystem

    constructor() {
        this._deliverySystem = new DeliverySystem();
        this._paymentSystem = new PaymentSystem();
        this._securitySystem = new SecuritySystem();
    }

    async connectSystem(system: ExternalSystems): Promise<BoolResponse> {
        logger.debug(`trying to connect to ${system}`);
        switch (system) {
            case (ExternalSystems.DELIVERY):
                return this._deliverySystem.connect();
            case (ExternalSystems.PAYMENT):
                return this._paymentSystem.connect();
            case (ExternalSystems.SECURITY):
                return this._securitySystem.connect();
        }
    }

    get paymentSystem(): PaymentSystem {
        return this._paymentSystem;
    }

    get deliverySystem(): DeliverySystem {
        return this._deliverySystem;
    }

    get securitySystem(): SecuritySystem {
        return this._securitySystem;
    }

}



