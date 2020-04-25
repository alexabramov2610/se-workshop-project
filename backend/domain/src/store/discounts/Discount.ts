import {ProductCatalogNumber} from "../../api-ext/CommonInterface";

export abstract class Discount {
    protected _startDate: Date;
    private _percentage: number;
    private _duration: number;

    protected constructor(percentage: number, duration: number) {
        this._percentage = percentage;
        this._duration = duration;
        this._startDate = new Date();
    }


    get percentage(): number {
        return this._percentage;
    }

    set percentage(value: number) {
        this._percentage = value;
    }

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }
}