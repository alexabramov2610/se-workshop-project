import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";
import {errorMsg, loggerW} from "../../api-int/internal_api";
import {DeliverySystemAdapter} from "./DeliverySystemAdapter";

const logger = loggerW(__filename)


export class DeliverySystem {
    private _deliverySys: any;
    private _name: string;
    private _isConnected: boolean;

    constructor() {
        this._name = "Delivery System"
        this._deliverySys = new DeliverySystemAdapter();
        this._isConnected = false;
    }

    setDeliverySys(real: any): void {
        this._deliverySys = real;
    }

    async connect(): Promise<BoolResponse> {
        logger.info("connecting to delivery system...");
        const connectSuccess: BoolResponse = {data: {result: true}};
        if (this._deliverySys) {
            try {
                const isConnected: BoolResponse = await this._deliverySys.connect();
                this._isConnected = isConnected.data.result ? true : false;
                isConnected ? logger.info("successfully connected delivery system") :
                    logger.warn("failed connecting delivery system");
                return isConnected.data.result ? connectSuccess :
                    {error: {message: errorMsg.E_CON + " : " + this._name}, data: {result: false}};
            } catch (e) {
                const error: string = `${errorMsg.E_CON}. message: ${e}`;
                logger.error(error);
                return {error: {message: error}, data: {result: false}};
            }
        } else {
            return connectSuccess;
        }
    }

    async deliver(name: string, country: string, city: string, address: string, zip: string): Promise<number> {
        if (!this._isConnected) {
            const connectSuccess : BoolResponse = await this.connect()
            if(!connectSuccess.data.result){
                logger.info("payment system is not connected");
                return -1;
            }
        }
        let isDelivered: boolean = false;
        if (this._deliverySys) {
            return this._deliverySys.deliver()
        } else {
            isDelivered = this.validateDelivery(country, city, address)
            if (!isDelivered)
                logger.error("delivery failed")
        }
        return Math.random() * (1000 - 1) + 1;
    }

    async cancelDeliver(deliveryID: number): Promise<boolean> {
        if (!this._isConnected) {
            const connectSuccess: BoolResponse = await this.connect()
            if (!connectSuccess.data.result) {
                logger.info("payment system is not connected");
                return false;
            }
        }
        if (this._deliverySys) {
            return this._deliverySys.cancelDeliver(deliveryID)
        } else {
            return true;
        }
    }

    private validateDelivery(country: string, city: string, address: string) {
        logger.info(`validating delivery to: ${address}, ${city}`);
        const invalid = country.length <= 0 || city.length <= 0 || address.length <= 0;
        return !invalid;
    }
}