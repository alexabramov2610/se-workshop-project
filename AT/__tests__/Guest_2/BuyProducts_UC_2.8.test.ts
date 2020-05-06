import {
    Bridge,
    Driver,
    Store,
    Product, Item
} from "../../";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import {IDiscount, Purchase} from "se-workshop-20-interfaces/dist/src/CommonInterface";


describe("Guest buy items, UC: 2.8", () => {
    let _driver = new Driver();
    let _serviceBridge: Bridge;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testProduct1: Product;
    let _testProduct2: Product;
    let _testProduct3: Product;
    let _testProduct4: Product;
    let _testExpensiveProduct: Product
    let _testItem1: Item;
    let _testItem2: Item;
    let _testItem3: Item;
    let _testExpensiveItem: Item;
    let _testDiscount: IDiscount;

    beforeEach(() => {
        _serviceBridge = _driver
            .resetState()
            .startSession()
            .initWithDefaults()
            .registerWithDefaults()
            .loginWithDefaults()
            .getBridge();

        _testProduct1 = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).getProduct();
        _testProduct2 = new ProductBuilder().withName("testProduct2").withCatalogNumber(456).getProduct();
        _testProduct3 = new ProductBuilder().withName("testProduct3").withCatalogNumber(789).getProduct();
        _testProduct4 = new ProductBuilder().withName("testProduct4").withCatalogNumber(555).getProduct();
        _testExpensiveProduct = new ProductBuilder().withName("testExpensiveProduct").withCatalogNumber(777).withPrice(999999).getProduct();

        _testItem1 = new ItemBuilder().withId(1).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        _testItem2 = new ItemBuilder().withId(2).withCatalogNumber(_testProduct2.catalogNumber).getItem();
        _testItem3 = new ItemBuilder().withId(3).withCatalogNumber(_testProduct1.catalogNumber).getItem();

        _testStore1 = {name: "testStore1Name"};
        _testStore2 = {name: "testStore2Name"};

        _serviceBridge.createStore(_testStore1);
        _serviceBridge.createStore(_testStore2);

        _serviceBridge.addProductsToStore(_testStore1, [_testProduct1, _testProduct3, _testProduct4]);
        _serviceBridge.addProductsToStore(_testStore2, [_testProduct1, _testProduct2]);

        _serviceBridge.addItemsToStore(_testStore1, [_testItem1, _testItem3]);
        _serviceBridge.addItemsToStore(_testStore2, [_testItem3, _testItem2]);

        _serviceBridge.logout();

        _testDiscount = {startDate: new Date(), percentage: 20, duration: 5};
    });

    test("Non empty cart, items in stock, no discount",() => {
        const {data, error} = _driver.given.store(_testStore1).products([_testProduct1]).makeABuy();
        expect(data).toBeDefined();
        expect(error).toBeUndefined();

        const {receipt} = data;
        const today = new Date();
        receipt.date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        expect(receipt.date).toEqual(today);

        const purchases: Purchase[] = receipt.purchases;
        expect(purchases.length).toEqual(1);
        expect(purchases[0].storeName).toEqual(_testStore1.name);
        expect(purchases[0].price).toEqual(_testProduct1.price);
        expect(purchases[0].item.id).toEqual(_testItem1.id);
        expect(purchases[0].item.catalogNumber).toEqual(_testProduct1.catalogNumber);

        const {lastCC4, totalCharged} = receipt.payment;
        const last4IdxStart = _driver.getPaymentInfo().payment.cardDetails.number.length - 4;
        const last4: string = _driver.getPaymentInfo().payment.cardDetails.number.substring(last4IdxStart, last4IdxStart + 4);
        expect(lastCC4).toEqual(last4);
        expect(totalCharged).toEqual(_testProduct1.price);
    });

    test(" empty cart, no discount",() => {
        const req = {token: "123", body: {payment: _driver.getPaymentInfo().payment}};
        const {error} = _serviceBridge.purchase(req);
        expect(error).toBeDefined();
    });

    test("Non empty cart, items in stock, with discount" ,() => { 
        const storeName = "testStore1Name";
        const catalogNumber = 123;
        const startDate = new Date();
        const duration = 3; 
        const simpleDiscount = {
            startDate,
            duration,
            products: [123],
            percentage: 50
        };
        const discountReq = {
            body: { catalogNumber, storeName, discount: simpleDiscount }, token: "123"
        }

        // const discount={startDate:new Date(),duration:3}
        // const req = {token: "123", body: {storeName: _testStore1.name, catalogNumber: _testProduct1.catalogNumber, discount: _testDiscount}};
        
        _driver.loginWithDefaults();
        const res=_serviceBridge.addDiscountPolicy( discountReq);
        _serviceBridge.logout();

        expect(res.data.result).toBeTruthy()

        const {data, error} = _driver.given.store(_testStore1).products([_testProduct1]).makeABuy();
        expect(data).toBeDefined();
        expect(error).toBeUndefined();

        const {receipt} = data;
        const today = new Date();
        receipt.date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        expect(receipt.date).toEqual(today);

        const purchases: Purchase[] = receipt.purchases;
        expect(purchases.length).toEqual(1);
        expect(purchases[0].storeName).toEqual(_testStore1.name);
        expect(purchases[0].item.id).toEqual(_testItem1.id);
        expect(purchases[0].item.catalogNumber).toEqual(_testProduct1.catalogNumber);

        const {lastCC4, totalCharged} = receipt.payment;
        const last4IdxStart = _driver.getPaymentInfo().payment.cardDetails.number.length - 4;
        const last4: string = _driver.getPaymentInfo().payment.cardDetails.number.substring(last4IdxStart, last4IdxStart + 4);
        expect(lastCC4).toEqual(last4);

        const reducedPrice: number = _testProduct1.price - (_testProduct1.price * 50 / 100);
        expect(totalCharged).toEqual(reducedPrice);
    });

    test('Non empty cart, items not stock',()=>{
     const res=_driver.given.store(_testStore2).products([_testProduct2]).makeABuy();
     expect(res.data.result).toBeTruthy()
     expect(res.data.receipt).toBeDefined()
     expect(res.error).toBeUndefined()
     const res2 = _driver.given.store(_testStore2).products([_testProduct2]).makeABuy();
     
     expect(res2.error.message).toEqual('The cart is empty')
     expect(res2.data.result).toBeFalsy()
     expect(res2.data.receipt).toBeUndefined()
     
    })
    test('Non empty cart, items in stock,card expaired,check stock ',()=>{

        
        const ItemStockBefore=_serviceBridge.viewProduct(_testStore1,_testProduct1).data.info.quantity
         
        _serviceBridge.addToCart(_testStore1,_testProduct1,1);
        const req={body:{   
                payment: {  
                  cardDetails: {
                    holderName: "Mr Cat",
                    number: "4242424242424242",
                    expMonth: "12",
                    expYear: "2008",
                    cvv: "123",
                  },
                  address: "St. Cats 123",
                  city: "Cat City",
                  country: "CatZone",
                }
                }};

        const res=_serviceBridge.purchase(req);
        expect(res.data.result).toBeFalsy()
        expect(res.error.message).toEqual('Payment failure.')

        const ItemStockAfter=_serviceBridge.viewProduct(_testStore1,_testProduct1).data.info.quantity
        expect(ItemStockBefore).toEqual(ItemStockAfter)
         
    })

    test('Non empty cart, items in stock,no money',()=>{
        const {data,error}=_driver.given.store(_testStore1).products([_testExpensiveProduct]).makeABuy();
        expect(error).toBeDefined
        expect(data.result).toBeFalsy()
    })

    test('logged in user, Non empty cart, items in stock',()=>{
        
        _driver.loginWithDefaults()
        const res=_driver.given.store(_testStore1).products([_testProduct1]).makeABuy();
        expect(res.data.result).toBeTruthy()
        expect(res.error).toBeUndefined();
        expect(res.data.receipt.purchases.length).toEqual(1)
    })

    test('Non empty cart, items in stock,valid buying pollicy',()=>{

    })

    test('Non empty cart, items in stock,invalid buying pollicy',()=>{
        
    })
});