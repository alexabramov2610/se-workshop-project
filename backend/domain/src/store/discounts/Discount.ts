import {v4 as uuid} from 'uuid';

export abstract class Discount {
    protected constructor(startDate: Date, percentage: number, duration: number) {
        this._id = uuid();
        this._percentage = percentage;
        this._duration = duration;
        this._startDate = startDate;
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    private _startDate: Date;

    get startDate(): Date {
        return this._startDate;
    }

    private _percentage: number;

    get percentage(): number {
        return this._percentage;
    }

    set percentage(value: number) {
        this._percentage = value;
    }

    private _duration: number;

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    isValid(): boolean {
        const today = new Date();
        const endDate = this.addMinutes(this.startDate, this.duration * 24 * 60);
        return today < endDate;
    }

    abstract calc(price: number): number;

    protected addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
}