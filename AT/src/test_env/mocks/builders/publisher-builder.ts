import {IPublisher} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Event} from "se-workshop-20-interfaces/dist/src/Event";
import {EventCode} from "se-workshop-20-interfaces/dist/src/Enums";
// export interface IPublisher {
//     subscribe(username: string, eventCode: EventCode, key: string, storeName: string): void;
//     unsubscribe(username: string, subscriptionEvent: EventCode, key: string): void;
//     notify(event: Event): string[];
//     terminateSocket(): void;
//     removeClient(username: string);
//      Map
// }

// jest.mock(calledwith(Event) => eve.username == b)

 export interface PublisherMock extends  IPublisher{
    subscribed: string[];
    notified: Map<EventCode,Map<string,number>>;
 }


export class PublisherBuilder {
    _publisher: PublisherMock;
    constructor() {
        this._publisher = {
            notified: new Map<EventCode,Map<string,number>>(),
            subscribed: [],
            subscribe: (username: string, subscriptionEvent: EventCode, key: string) =>
                        {this._publisher.subscribed.push(username);},
            unsubscribe: (username: string, subscriptionEvent: EventCode, key: string) =>
                        {this._publisher.subscribed = this._publisher.subscribed.filter(name => name !== username);},
            notify: (event: Event)=>{
                const userEventsCount = this._publisher.notified.get(event.code);
                if(userEventsCount && userEventsCount.has(event.username)) {
                    const oldCount = userEventsCount.get(event.username);
                    userEventsCount.set(event.username,oldCount+1);
                } else{
                    this._publisher.notified.set(event.code,new Map<string,number>().set(event.username,1))
                }
                return [event.username];
            },
            terminateSocket: () => {},
            removeClient:(username: string) => {}
        };

    }
    // withId(id: number): ItemBuilder {
    //     this._publisher = id;
    //     return this;
    // }
    //
    // withCatalogNumber(num: number): ItemBuilder {
    //     this._item.catalogNumber = num;
    //     return this;
    // }
    //
    // getItem(): Item {
    //     return this._item;
    // }
}

