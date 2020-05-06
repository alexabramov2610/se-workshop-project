import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";
import {CreditCard} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {errorMsg, loggerW} from "../../api-int/internal_api";

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

    pay(price: number, creditCard: CreditCard): boolean {
        if (!this._isConnected && !this.connect().data.result) {
            return false;
        }
        let isPaid: boolean = false;
        if (this._paymentSys) {
            try {
                this._paymentSys.validateCreditCard(creditCard);
                this._paymentSys.validateBalance(creditCard, price);
                isPaid = this._paymentSys.pay(price, creditCard);
            } catch (e) {
                isPaid = false;
                const error: string = `${errorMsg.E_CON}. message: ${e}`;
                logger.error(error);
            }
        } else {
            isPaid = this.validateCreditCard(creditCard)
            if (!isPaid) {
                logger.error("payment failed - invalid credit card")
                return isPaid
            }
            isPaid = this.validateBalance(creditCard, price);
            if (!isPaid) {
                logger.error("payment failed - Not enough money")
                return isPaid
            }
        }
        return isPaid;

    }

    private validateCreditCard(creditCard: CreditCard) {
        if (this._paymentSys) {
            return this._paymentSys.validateCreditCard();
        } else {
            const today: Date = new Date();
            const expOk: boolean = (Number.parseInt(creditCard.expYear, 10) > today.getFullYear() || (parseInt(creditCard.expYear, 10) === today.getFullYear() && parseInt(creditCard.expMonth, 10) >= today.getMonth() + 1))
            return creditCard.holderName && creditCard.number && creditCard.cvv && expOk;
        }
    }

    private validateBalance(creditCard: CreditCard, amountToCharge: number) {
        if (this._paymentSys) {
            return this._paymentSys.validateBalance();
        } else {
            return amountToCharge < 1000;
        }
    }
}
