import {
    Bridge,
    Driver,
    Credentials,
    Store,
    Product
} from "../../";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {
    PriceRange,
    ProductCategory,
    SearchFilters,
    SearchQuery
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Req} from "se-workshop-20-interfaces"
import {Rating} from "se-workshop-20-interfaces/dist/src/Enums";
import * as utils from "../../utils"
 

describe("Guest Search, UC: 2.5", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testProduct1: Product;
    let _testProduct2: Product;
    let _testProduct3: Product;
    let _testProduct4: Product;
    let _testSearchData: Req.SearchRequest;
    let _testSearchQuery: SearchQuery;
    let _testFilters: SearchFilters;
    let _priceRange: PriceRange;
    let _credentials: Credentials;

    beforeEach(async() => {
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults();
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()
        _serviceBridge = await _driver.getBridge();
        
            

        _credentials = {userName: "", password: "",};
        _testProduct1 = new ProductBuilder()
            .withName("testProduct1")
            .withCatalogNumber(123)
            .withPrice(60)
            .getProduct();
        _testProduct2 = new ProductBuilder()
            .withName("testProduct2")
            .withCatalogNumber(456)
            .withPrice(99)
            .getProduct();
        _testProduct3 = new ProductBuilder()
            .withCategory(ProductCategory.ELECTRONICS)
            .withName("testProduct3")
            .withPrice(15)
            .withCatalogNumber(789).getProduct();
        _testProduct4 = new ProductBuilder()
            .withCategory(ProductCategory.ELECTRONICS)
            .withName("testProduct4")
            .withPrice(25)
            .withCatalogNumber(555).getProduct();


        _testStore1 = {name: "testStore1Name"};
        _testStore2 = {name: "testStore2Name"};

        await _serviceBridge.createStore(_testStore1);
        await _serviceBridge.createStore(_testStore2);

        await _serviceBridge.addProductsToStore(_testStore1, [_testProduct1, _testProduct3, _testProduct4]);
        await _serviceBridge.addProductsToStore(_testStore2, [_testProduct1, _testProduct2]);

        await _serviceBridge.logout();

        _priceRange = {min: 0, max: Number.MAX_SAFE_INTEGER};
        _testFilters = {
            productCategory: ProductCategory.ELECTRONICS,
            priceRange: _priceRange,
            storeRating: Rating.LOW,
            productRating: Rating.MEDIUM
        };
        _testSearchQuery = {productName: "blabla"};
        _testSearchData = {
            token: "123",
            body: {
                searchQuery: {productName: "test-input"},
                filters: _testFilters,
            }
        }
    });

    afterAll(() => {
        //utils.terminateSocket();
        _driver.dropDB();

    });

    test("Valid search input, no filters", async () => {
        _testSearchData.body.filters = {};
        _testSearchQuery.productName = _testProduct1.name;
        _testSearchData.body.searchQuery = _testSearchQuery;

        const {data, error} = await _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const productsInStore = data.products;
        const stores: string[] = productsInStore.map(p => p.storeName);
        const products: Product[] = productsInStore.map(p => p.product);

        expect(stores.length).toEqual(2);
        expect(stores).toContainEqual(_testStore1.name);
        expect(stores).toContainEqual(_testStore2.name);

        expect(products.length).toEqual(2);
        expect(products[0].catalogNumber).toEqual(_testProduct1.catalogNumber);
    });

    test("Valid search input, category filter", async() => {
        _testSearchData.body.filters = {productCategory: ProductCategory.ELECTRONICS};
        _testSearchQuery = {};
        _testSearchData.body.searchQuery = _testSearchQuery;

        const {data, error} = await _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const productsInStore = data.products;
        const stores: string[] = productsInStore.map(p => p.storeName);
        const products: Product[] = productsInStore.map(p => p.product);

        expect(stores.length).toEqual(2);
        expect(stores).toContainEqual(_testStore1.name);

        expect(products.length).toEqual(2);
        const catalogNumbers = products.map(p => p.catalogNumber);
        expect(catalogNumbers).toContainEqual(_testProduct3.catalogNumber);
        expect(catalogNumbers).toContainEqual(_testProduct4.catalogNumber);
    });

    test("Valid search input, price range filter", async() => {
        _testSearchData.body.filters = {priceRange: {min: 4, max: 20}};
        _testSearchQuery = {};
        _testSearchData.body.searchQuery = _testSearchQuery;

        const {data, error} = await _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const productsInStore = data.products;
        const stores: string[] = productsInStore.map(p => p.storeName);
        const products: Product[] = productsInStore.map(p => p.product);

        expect(stores.length).toEqual(1);
        expect(stores).toContainEqual(_testStore1.name);

        expect(products.length).toEqual(1);
        expect(products[0].catalogNumber).toEqual(_testProduct3.catalogNumber);
    });

    test("Invalid search input, no filters", async() => {
        _testSearchData.body.filters = {};
        _testSearchData.body.searchQuery = _testSearchQuery;

        const {data, error} =await _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const productsInStore = data.products;
        expect(productsInStore.length).toEqual(0);
    });

    test("Valid search input, all filter", async () => {
        _testSearchData.body.filters = {
            priceRange: {min: 0, max: 40},
            productCategory: ProductCategory.ELECTRONICS
        };
        _testSearchQuery = {};
        _testSearchData.body.searchQuery = _testSearchQuery;

        const {data, error} = await _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const productsInStore = data.products;
        const stores: string[] = productsInStore.map(p => p.storeName);
        const products: Product[] = productsInStore.map(p => p.product);

        expect(stores.length).toEqual(2);
        expect(stores).toContainEqual(_testStore1.name);

        expect(products.length).toEqual(2);
        const catalogNumbers = products.map(p => p.catalogNumber);
        expect(catalogNumbers).toContainEqual(_testProduct3.catalogNumber);
        expect(catalogNumbers).toContainEqual(_testProduct4.catalogNumber);
    });
 });
