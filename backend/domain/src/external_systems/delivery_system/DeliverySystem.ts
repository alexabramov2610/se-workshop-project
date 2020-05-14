import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";
import { errorMsg, loggerW} from "../../api-int/internal_api";
const logger = loggerW(__filename)


export class DeliverySystem {
    private _deliverySys: any;
    private _name: string;
    private _isConnected: boolean;

    constructor() {
        this._name = "Delivery System"
        this._deliverySys = null;
        this._isConnected = false;
    }

    setDeliverySys(real: any): void {
        this._deliverySys = real;
    }

    connect(): BoolResponse {
        logger.info("connecting to delivery system...");
        const succ: BoolResponse = {data: {result: true}};
        if (this._deliverySys) {
            try {
                const isConnected = this._deliverySys.connect();
                this._isConnected = isConnected ? true : false;
                isConnected ? logger.info("successfully connected delivery system") :
                    logger.warn("failed connecting delivery system");
                return isConnected ? succ :
                    {error: {message: errorMsg.E_CON + " : " + this._name}, data: {result: false}};
            } catch (e) {
                const error: string = `${errorMsg.E_CON}. message: ${e}`;
                logger.error(error);
                return {error: {message: error}, data: {result: false}};
            }
        } else {
            return succ;
        }
    }

    deliver(country: string, city: string, address: string): boolean {
        if (!this._isConnected && !this.connect().data.result) {
            logger.info("delivery system is not connected");
            return false;
        }
        let isDelivered: boolean = false;
        if (this._deliverySys) {
            try {
                isDelivered = this._deliverySys.deliver(country, city, address);
                isDelivered ? logger.info(`delivery has successfully set to ${address}, ${city}`) :
                    logger.warn(`failed setting delivery to ${address}, ${city}`)
            } catch (e) {
                isDelivered = false;
                const error: string = `${errorMsg.E_CON}. message: ${e}`;
                logger.error(error);
            }
        } else {
            isDelivered = this.validateDelivery(country, city, address)
            if (!isDelivered)
                logger.error("delivery failed")
        }
        return isDelivered
    }

    private validateDelivery(country: string, city: string, address: string) {
        logger.info(`validating delivery to: ${address}, ${city}`);
        const invalid = country.length <= 0 || city.length <= 0 || address.length <= 0;
        return !invalid;
    }
}