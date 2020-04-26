export class ContactUsMessage {

    private readonly _question: string;
    private readonly _date: Date;
    private _response: string;
    private _responderName: string;
    private _responseDate: string;

    constructor(question: string) {
        this._question = question;
        this._date = new Date();
    }

    get question(): string {
        return this._question;
    }

    get date(): Date {
        return this._date;
    }

    get responderName(): string {
        return this._responderName;
    }

    set responderName(value: string) {
        this._responderName = value;
    }

    get responseDate(): string {
        return this._responseDate;
    }

    set responseDate(value: string) {
        this._responseDate = value;
    }

    get response(): string {
        return this._response;
    }

    set response(value: string) {
        this._response = value;
    }

}