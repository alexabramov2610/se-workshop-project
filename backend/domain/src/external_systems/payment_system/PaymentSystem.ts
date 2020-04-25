import {CreditCard} from "../../api-ext/CommonInterface";
import { BoolResponse, errorMsg, loggerW} from "../../api-int/internal_api";
const logger = loggerW(__filename)


export class PaymentSystem {
    private _paymentSys: any;
    private _name: string;
    private _isConnected: boolean;

    constructor() {
        this._name = "Payment System"
        this._paymentSys = null;
        this._isConnected = false;
    }

    setPaymentSys(real: any) {
        this._paymentSys = real;
    }

    connect(): BoolResponse {
        logger.info("connecting to connect payment system...");
        const succ: BoolResponse = {data: {result: true}};
        if (this._paymentSys) {
            try {
                const isConnected = this._paymentSys.connect();
                this._isConnected = isConnected ? true : false;
                return isConnected ? succ :
                    {error: {message: errorMsg.E_CON+" : " + this._name}, data: {result: false}};
            } catch (e) {
                const error: string = `${errorMsg.E_CON}. message: ${e}`;
                logger.error(error);
                return {error: {message: error}, data: {result: false}};
            }
        }
        else {
            return succ;
        }
    }

    pay(price: number, creditCard: CreditCard): boolean {
        if (!this._isConnected && !this.connect().data.result) {
           return false;
        }
        let isPaid: boolean = false;
        if (this._paymentSys) {
            try {
                isPaid = this._paymentSys.pay(price, creditCard);
            }
            catch (e) {
                isPaid = false;
                const error: string = `${errorMsg.E_CON}. message: ${e}`;
                logger.error(error);
            }
        } else {
            isPaid = this.validateCreditCard(creditCard)
            if(!isPaid)
                logger.error("payment failed")
        }
        return isPaid
    }

    private validateCreditCard(creditCard: CreditCard) {
        if (this._paymentSys) {
            return this._paymentSys.validateCreditCard();
        } else {
            const today: Date = new Date();
            const expOk: boolean = (creditCard.expYear > today.getFullYear()  || (creditCard.expYear === today.getFullYear() && creditCard.expMonth >= today.getMonth()+1))
            return creditCard.holderName && creditCard.number && creditCard.ccv && expOk;
        }
    }
}
