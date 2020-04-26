import {v4 as uuid} from 'uuid';
export abstract class Discount {
    private _id: string;
    private _startDate: Date;
    private _percentage: number;
    private _duration: number;

    protected constructor(startDate:Date,percentage: number, duration: number) {
        this._id = uuid();
        this._percentage = percentage;
        this._duration = duration;
        this._startDate = startDate;
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

    get id(): string {
        return this._id;
    }

    get startDate(): Date {
        return this._startDate;
    }

    abstract calc(price: number) :number;

}