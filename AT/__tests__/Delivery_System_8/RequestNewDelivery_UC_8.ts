// import {
//     Bridge,
//     Driver,
// } from "../../";
// import {DeliveryRequest} from "se-workshop-20-interfaces/dist/src/Request";
// import * as utils from "../../utils"


// describe("Guest buy items, UC: 2.8", () => {
//     let _driver = new Driver();
//     let _serviceBridge: Bridge;
//     let _testDeliveryInfo: DeliveryRequest;

//     beforeEach(() => {
//         _serviceBridge = _driver
//             .startSession()
//             .initWithDefaults()
//             .registerWithDefaults()
//             .loginWithDefaults()
//             .getBridge();

//         const {country, city, address} = _driver.getPaymentInfo().payment;
//         _testDeliveryInfo = {
//             token: "123",
//             body: {
//                 userDetails: {
//                     country: country,
//                     city: city,
//                     address: address
//                 }
//             }
//         }

//     });


//     afterAll(() => {
//         utils.terminateSocket();
//     });

//     test("Valid delivery", () => {
//         const {data, error} = _serviceBridge.deliver(_testDeliveryInfo);
//         expect(data).toBeDefined();
//         expect(error).toBeUndefined();
//     });

//     test("Invalid delivery - missing address", () => {
//         _testDeliveryInfo.body.userDetails.address = "";
//         const {data, error} = _serviceBridge.deliver(_testDeliveryInfo);
//         expect(error).toBeDefined();
//         expect(data).toBeUndefined();
//     });

//     test("Invalid request - missing location details - city", () => {
//         _testDeliveryInfo.body.userDetails.city = "";
//         const {data, error} = _serviceBridge.deliver(_testDeliveryInfo);
//         expect(error).toBeDefined();
//         expect(data).toBeUndefined();
//     });

//     test("Invalid request - missing location details - country", () => {
//         _testDeliveryInfo.body.userDetails.country = "";
//         const {data, error} = _serviceBridge.deliver(_testDeliveryInfo);
//         expect(error).toBeDefined();
//         expect(data).toBeUndefined();
//     });
// });