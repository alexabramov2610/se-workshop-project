import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";
import {CreditCard} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {errorMsg, loggerW} from "../../api-int/internal_api";
import {PaymentSystemAdapter} from "./PaymentSystemAdapter";
import exp from "constants";

const logger = loggerW(__filename)

export class PaymentSystem {
    private _paymentSys: any;
    private readonly _name: string;
    DEFAULT_URL: string = "https://cs-bgu-wsep.herokuapp.com/"

    constructor() {
        this._name = "Payment System"
        this._paymentSys = new PaymentSystemAdapter(this.DEFAULT_URL);
    }

    setPaymentSys(real: any): void {
        if (typeof real === 'string') {
            if (real === 'test') {
                this._paymentSys = null;
            } else if (real === 'default') {
                this._paymentSys = new PaymentSystemAdapter(this.DEFAULT_URL);
            } else {
                this._paymentSys = new PaymentSystemAdapter(real);
            }
        } else {
            this._paymentSys = real;
        }
    }

    async connect(): Promise<BoolResponse> {
        logger.info("connecting payment system...");
        const success: BoolResponse = {data: {result: true}};
        if (this._paymentSys) {
            try {
                const isConnected: boolean = await this.connectToExternal();
                isConnected ? logger.info("successfully connected payment system") :
                    logger.warn("failed connecting payment system");
                return isConnected ? success :
                    {error: {message: errorMsg.E_CON + " : " + this._name}, data: {result: false}};
            } catch (e) {
                const error: string = `${errorMsg.E_CON}. message: ${e}`;
                logger.error(error);
                return {error: {message: error}, data: {result: false}};
            }
        } else {
            return success;
        }
    }

    async connectToExternal(): Promise<boolean> {
        try {
            const isConnected = await this._paymentSys.connect();
            if (isConnected) // &&....        //TODO: change it to support external sys methods
                return true;
            return false;
        } catch (e) {
            const error: string = `${errorMsg.E_CON}. message: ${e}`;
            logger.error(error);
            return false;
        }
    }

    async pay(price: number, creditCard: CreditCard): Promise<number> {
        const connectSuccess: BoolResponse = await this.connect()
        if (!connectSuccess.data.result) {
            return -1;
        }
        logger.info("trying to charge");
        let isPaid: boolean = false;
        if (this._paymentSys) {
            try {
                const res = await this._paymentSys.pay(price, creditCard)
                return res && (typeof res === "number")? res : -1;
            } catch (e) {
                logger.error(`pay external system error: ${e}`)
                return -1;
            }
        } else {
            isPaid = this.validateCreditCard(creditCard)
            if (!isPaid) {
                logger.error("payment failed - invalid credit card")
                return -1;
            }
            isPaid = this.validateBalance(creditCard, price);
            if (!isPaid) {
                logger.error("payment failed - not enough money")
                return -1
            }
            return Math.random() * (1000 - 1) + 1;
        }
    }

    async cancelPay(transactionID: number): Promise<boolean> {
        const connectSuccess: BoolResponse = await this.connect()
        if (!connectSuccess.data.result) {
            return false;
        }
        logger.info("trying to charge");
        if (this._paymentSys) {
            return this._paymentSys.cancelPay(transactionID)
        } else {
            return true;
        }
    }

    private validateCreditCard(creditCard: CreditCard): boolean {
        logger.info(`validating credit card ending on: ${creditCard.number.substring(creditCard.number.length - 4)}`);
        const today: Date = new Date();
        let expOk: boolean = creditCard.expYear.length === 2 && ((parseInt('20' + creditCard.expYear, 10) > today.getFullYear() ||
            (parseInt(creditCard.expYear, 10) === today.getFullYear() % 100 && parseInt(creditCard.expMonth, 10) >= today.getMonth() + 1)))
        expOk = expOk && creditCard.holderName && creditCard.holderName.length > 0 &&
            creditCard.number && creditCard.number.length > 0 &&
            creditCard.cvv && creditCard.cvv.length > 0 && creditCard.id && creditCard.id.length > 0;
        expOk = expOk && /^\d+$/.test(creditCard.id) && /^\d+$/.test(creditCard.cvv) &&  /^\d+$/.test(creditCard.expYear) &&  /^\d+$/.test(creditCard.expMonth) && /^\d+$/.test(creditCard.number);
        return expOk;

    }

    private validateBalance(creditCard: CreditCard, amountToCharge: number) {
        logger.info(`validating balance on credit card ending on: ${creditCard.number.substring(creditCard.number.length - 4)} want to charge ${amountToCharge}`);
        return amountToCharge < 1000;
    }
}
