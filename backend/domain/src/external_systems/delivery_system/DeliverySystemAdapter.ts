import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";
import {CreditCard} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {loggerW} from "../../api-int/internal_api";

import axios from 'axios'
import * as querystring from "querystring";

const logger = loggerW(__filename)

export class DeliverySystemAdapter {
    EXTERNAL_URL: string;

    constructor(url?: string) {
        this.EXTERNAL_URL = url;
    }

    async connect(): Promise<BoolResponse> {
        try {
            const connectRes = await axios.post(this.EXTERNAL_URL, querystring.stringify({action_type: 'handshake'}),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
            if (connectRes.data === "OK") {
                return {data: {result: true}}
            }
            return {data: {result: false}}
        } catch (e) {
            logger.warn(`ERROR connect to external system ${e}`)
            return {data: {result: false}}
        }
    }

    async deliver(name:string, country: string, city: string, address: string, zip: string): Promise<number> {
        try {
            const payRes = await axios.post(this.EXTERNAL_URL, querystring.stringify({
                    action_type: 'supply',
                    name,
                    address,
                    city,
                    country,
                    zip
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
            return payRes.data;
        } catch (e) {
            logger.warn(`ERROR pay via external system ${e}`)
            return -1
        }
    }


    async cancelDeliver(transactionID: number): Promise<boolean> {
        try {
            const payRes = await axios.post(this.EXTERNAL_URL, querystring.stringify({
                    action_type: 'cancel_supply',
                    transaction_id: transactionID,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
            return payRes.data === 1 ? true : false;
        } catch (e) {
            logger.warn(`ERROR pay via external system ${e}`)
            return false
        }
    }

}