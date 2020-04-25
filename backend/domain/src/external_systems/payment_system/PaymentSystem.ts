import {BoolResponse, errorMsg, loggerW} from "../../api-int/internal_api";
import {CreditCard} from "../../api-ext/CommonInterface";
const logger = loggerW(__filename)

export class PaymentSystem {
    private _paymentSys: any;
    private _name: string;

    constructor() {
        this._name = "Payment System"
        this._paymentSys = null;
    }

    setPaymentSys(real: any) {
        this._paymentSys = real;
    }

    connect(): BoolResponse {
        const succ: BoolResponse = {data: {result: true}};
        if (this._paymentSys) {
            const isConnected = this._paymentSys.connect();
            if (isConnected) {
                return succ;
            } else {
                return {
                    error: {message: errorMsg.E_CON + " : " + this._name},
                    data: {result: this._paymentSys.connect()}
                };
            }
        } else {
            return succ;
        }
    }

    pay(price: number, creditCard: CreditCard): boolean {
        let isPaid: boolean = false;
        if (this._paymentSys) {
            isPaid = this._paymentSys.pay(price, creditCard);
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

            return creditCard.holderName && creditCard.number && creditCard.ccv && creditCard.expYear > today.getFullYear() && creditCard.expMonth > today.getMonth()+1
        }
    }
}
