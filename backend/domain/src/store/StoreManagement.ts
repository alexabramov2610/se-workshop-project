import {Store} from './internal_api'
import {RegisteredUser, StoreManager} from "../user/internal_api";
import {Req, Res} from 'se-workshop-20-interfaces'

import {
    BagItem, IDiscount, IItem, IPayment, IProduct, IReceipt, ProductCatalogNumber, ProductInStore,
    Purchase, SearchFilters, SearchQuery, IDiscountPolicy, IDiscountInPolicy, IConditionOfDiscount,
    IPurchasePolicy, StoreInfo, IPurchasePolicyElement, ISimplePurchasePolicy, ManagerNamePermission, AssignAgreement
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {ManagementPermission, Operators, ProductCategory, Rating} from "se-workshop-20-interfaces/dist/src/Enums";
import {ExternalSystemsManager} from "../external_systems/ExternalSystemsManager";
import {errorMsg as Error, errorMsg, loggerW, StringTuple, UserRole} from '../api-int/internal_api'
import {Discount} from "./discounts/Discount";
import {DiscountPolicy} from "./discounts/DiscountPolicy";
import {CondDiscount} from "./discounts/CondDiscount";
import {PurchasePolicy} from "./PurchasePolicy/PurchasePolicy";
import {PurchasePolicyImpl} from "./PurchasePolicy/PurchasePolicyImpl";
import {UserPolicy} from "./PurchasePolicy/Policies/UserPolicy";
import {ProductPolicy} from "./PurchasePolicy/Policies/ProductPolicy";
import {BagPolicy} from "./PurchasePolicy/Policies/BagPolicy";
import {SystemPolicy} from "./PurchasePolicy/Policies/SystemPolicy";
import {
    DiscountPolicyModel,
    ProductModel,
    ReceiptModel,
    StoreManagerModel,
    StoreModel,
    StoreOwnerModel,
    PurchasePolicyModel,
    AssignAgreementModel, UserModel
} from 'dal'
import * as StoreMapper from './StoreMapper'
import {productsMapperFromDB} from "./StoreMapper";
import {mapToJson} from "../api-int/utils";
import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";
import {type} from "os";

const logger = loggerW(__filename)


export class StoreManagement {
    private readonly DEFAULT_STORE_POPULATION: string[] = ["products", "storeOwners", "storeManagers", "receipts", "firstOwner", "discountPolicy", "purchasePolicy"];
    private _externalSystems: ExternalSystemsManager;
    locks: string[];
    private _storesCache: Map<string, any>;
    private MAX_CACHE_SIZE = 50;

    constructor(externalSystems: ExternalSystemsManager) {
        this._externalSystems = externalSystems;
        this.locks = []
        this._storesCache = new Map<string, any>();
    }

    async findStoreByName(storeName: string, populateWith = this.DEFAULT_STORE_POPULATION): Promise<Store> {
        const storeModel = await this.findStoreModelByName(storeName, populateWith);
        return StoreMapper.storeMapperFromDB(storeModel);
    }

    async findStoreModelByName(storeName: string, populateWith = this.DEFAULT_STORE_POPULATION): Promise<any> {
        try {
            const fromCache = this._storesCache.get(storeName)
            if (fromCache) {
                return fromCache
            }
            logger.debug(`findStoreModelByName trying to find store ${storeName} in DB`)
            const populateQuery = populateWith.map(field => {
                return {path: field}
            });
            const s = await StoreModel.findOne({storeName}).populate(populateQuery)
            return s;
        } catch (e) {
            logger.error(`findStoreModelByName DB ERROR: ${e}`);
            return undefined
        }
        return undefined;
    }


    async findStoresNamesByPrefix(prefix: string, limit): Promise<any> {
        try {
            logger.debug(`findStoresNamesByPrefix trying to find store match with prefix:${prefix} in DB`)
            const arr = await StoreModel.find({"storeName": {$regex: prefix, $options: 'i'}});
            const res = arr.map(st => st.storeName).slice(0, Math.min(limit, arr.length));
            return {data: {result: true, names: res}};
        } catch (e) {
            logger.error(`findStoresNamesByPrefix DB ERROR: ${e}`);
            return {data: {result: false, names: []}, error: {message: errorMsg.E_DB + `\n${e.message}`}};
        }
        return {data: {result: true, names: []}};
    }

    async findProductsNamesByPrefix(prefix: string, limit): Promise<Res.GetNamesResponse> {
        try {
            logger.debug(`findProductsNamesByPrefix trying to find product match with prefix:${prefix} in DB`)
            const arr = await ProductModel.find({"name": {$regex: prefix, $options: 'i'}});
            const notMoreThanLen = arr.map(p => p.name).slice(0, limit);
            const res = notMoreThanLen.filter((elem, pos) => {
                return notMoreThanLen.indexOf(elem) === pos;
            })
            return {data: {result: true, names: res}};
        } catch (e) {
            logger.error(`findProductsNamesByPrefix DB ERROR: ${e}`);
            return {data: {result: false, names: []}, error: {message: errorMsg.E_DB}};
        }
        return {data: {result: true, names: []}};
    }

    async findAllStores(populateWith = this.DEFAULT_STORE_POPULATION): Promise<Store[]> {
        try {
            logger.debug(`trying to find all stores in DB`)
            const populateQuery = populateWith.map(field => {
                return {path: field}
            });
            const s = await StoreModel.find().populate('products')
                .populate(populateQuery);
            return s.map(currStore => StoreMapper.storeMapperFromDB(currStore));
        } catch (e) {
            logger.error(`findAllStores DB ERROR: ${e}`);
            const storesFromCache = Array.from(this._storesCache.values())
            return storesFromCache.map(currStore => StoreMapper.storeMapperFromDB(currStore));
        }
        return [];
    }

    async addStore(storeName: string, description: string, owner: RegisteredUser): Promise<Res.BoolResponse> {
        const firstOwner = new StoreOwnerModel({name: owner.name})
        // const purchasePolicy = new PurchasePolicyModel()
        // const discountPolicy = new DiscountPolicyModel()
        try {
            const storeOwners = [firstOwner]
            const discountPolicy = await DiscountPolicyModel.create({children: [], storeName})
            const purchasePolicy = await PurchasePolicyModel.create({children: [], storeName})
            const newStore = await StoreModel.create({
                storeName,
                description,
                firstOwner,
                storeOwners,
                discountPolicy,
                purchasePolicy
            })
            await firstOwner.save();
            this.pushToStoreCache(storeName, newStore);
            logger.info(`successfully added store: ${storeName} with first owner: ${owner.name} to system`)
            return {data: {result: true}}
        } catch (e) {
            if (e.errors && e.errors.name && e.errors.name.kind === 'unique') {
                logger.warn(`fail to open store ,${storeName} already exist `);
                return {data: {result: false}, error: {message: errorMsg.E_STORE_EXISTS}}
            }
            return {data: {result: false}, error: {message: e.errors.name}}
        }
        return {data: {result: true}}
    }

    async verifyStoreExists(storeName: string): Promise<boolean> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        return storeModel ? true : false;
    }

    async getOwnersAssignedBy(storeName: string, user: RegisteredUser): Promise<Res.GetOwnersAssignedByResponse> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel)
            return {data: {result: false, owners: [], agreements: []}, error: {message: errorMsg.E_INVALID_STORE}}
        const storeOwner = this.findStoreOwner(storeModel, user.name);
        const agreements = await AssignAgreementModel.find({
            $or: [{storeName, requiredApprove: user.name, pending: true}, {
                storeName,
                assignedByOwner: user.name,
                pending: true
            }]
        })
        const filtered = agreements.filter((a) => a.requiredApprove.length !== a.approvedBy.length)
        return {
            data: {
                result: true,
                owners: storeOwner.ownersAssigned.map(curr => curr.name),
                agreements: filtered
            }
        };
    }

    async verifyStoreOperation(storeName: string, username: string, permission: ManagementPermission, storeModel?): Promise<Res.BoolResponse> {
        let error: string;
        const store = storeModel ? storeModel : await this.findStoreModelByName(storeName); // Document
        if (!store)
            error = errorMsg.E_INVALID_STORE;
        else if (!this.findStoreOwner(store, username) && !this.verifyManagerPermission(store.storeManagers, username, permission))
            error = errorMsg.E_PERMISSION;
        return error ? {data: {result: false}, error: {message: error}} : {data: {result: true}};
    }

    private findStoreOwner(storeModel, username: string) { // returns doc
        return storeModel.storeOwners.find((owner) => owner.name === username);
    }

    private findStoreManager(storeModel, username: string) { // returns doc
        return storeModel.storeManagers.find((owner) => owner.name === username);
    }

    private verifyManagerPermission(managers: StoreManager[], username: string, permissionToCheck: ManagementPermission): boolean {
        for (const manager of managers) {
            if (manager.name === username) {
                for (const permission of manager.managerPermissions) {
                    if (permission === permissionToCheck)
                        return true;
                }
            }
        }
        return false;
    }

    async changeProductName(username: string, catalogNumber: number, storeName: string, newProductName: string): Promise<Res.BoolResponse> {
        logger.debug(`changeProductName: ${username} changes product: ${catalogNumber} name in store: ${storeName} 
            to ${newProductName}`);
        if (!newProductName || !(newProductName.length > 0)) {
            logger.warn(`changeProductName: cant change name to ${newProductName}`);
            return {data: {result: false}, error: {message: errorMsg.E_MODIFY_PRODUCT}};
        }
        const store = await this.findStoreModelByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        // const product: IProduct = store.getProductByCatalogNumber(catalogNumber);
        const productToChange = store.products.find(p => p.catalogNumber === +catalogNumber)
        productToChange.name = newProductName;
        try {
            await productToChange.save()
            logger.info(`changeProductName: successfully changed name`);
            return {data: {result: true}};
        } catch (e) {
            logger.warn(`changeProductName: error ${e}`);
            this._storesCache.delete(storeName)
            return {data: {result: false}, error: {message: errorMsg.E_MODIFY_PRODUCT}};
        }
    }

    async changeProductPrice(username: string, catalogNumber: number, storeName: string, newPrice: number): Promise<Res.BoolResponse> {
        logger.debug(`changeProductPrice: ${username} changes product: ${catalogNumber} price in store: ${storeName} 
            to ${newPrice}`);
        // @ts-ignore
        if (!newPrice || !/^\d+$/.test(newPrice)) {
            logger.warn(`changeProductPrice: cant change price to ${newPrice}`);
            return {data: {result: false}, error: {message: errorMsg.E_MODIFY_PRODUCT}};
        }
        const store = await this.findStoreModelByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const productToChange = store.products.find((p) => p.catalogNumber === +catalogNumber)
        productToChange.price = newPrice;
        try {
            await productToChange.save()
            logger.info(`changeProductPrice: successfully changed price`);
            return {data: {result: true}};
        } catch (e) {
            logger.warn(`changeProductPrice: error ${e}`);
            this._storesCache.delete(storeName)
            return {data: {result: false}, error: {message: errorMsg.E_MODIFY_PRODUCT}};
        }
    }

    async addItems(username: string, storeName: string, itemsReq: IItem[]): Promise<Res.ItemsAdditionResponse> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        const store: Store = StoreMapper.storeMapperFromDB(storeModel);
        const res: Res.ItemsAdditionResponse = store.addItems(itemsReq);

        if (res.data.result) {
            try {
                res.data.itemsAdded.forEach(item => {
                    const product = storeModel.products.find((p) => p.catalogNumber === +item.catalogNumber);
                    product.items.push(item);
                })
                for (const product of storeModel.products) {
                    await product.save()
                }
                logger.info(`new items added into store: ${storeName}`)
            } catch (e) {
                logger.error(`addItems DB ERROR: ${e}`);
                return {
                    data: {result: false, itemsNotAdded: itemsReq},
                    error: {message: Error.E_ITEMS_ADD}
                }
            }
        }
        return res;
    }

    async removeItems(user: RegisteredUser, storeName: string, itemsReq: IItem[]): Promise<Res.ItemsRemovalResponse> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        const store: Store = StoreMapper.storeMapperFromDB(storeModel);
        const res: Res.ItemsRemovalResponse = store.removeItems(itemsReq);
        if (res.data.result) {
            try {
                res.data.itemsRemoved.forEach(item => {
                    const product = storeModel.products.find(p => p.catalogNumber === item.catalogNumber);
                    product.items.pull(item.db_id);
                })
                for (const product of storeModel.products) {
                    await product.save()
                }
                logger.info(`removed items from store: ${storeName}`)
            } catch (e) {
                logger.error(`removeItems DB ERROR: ${e}`);
                return {
                    data: {result: false, itemsNotRemoved: itemsReq},
                    error: {message: Error.E_ITEMS_REM}
                }
            }
        }
        return res;
    }

    async addNewProducts(username: string, storeName: string, productsReq: IProduct[]): Promise<Res.ProductAdditionResponse> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        const store: Store = StoreMapper.storeMapperFromDB(storeModel);
        const res: Res.ProductAdditionResponse = store.addNewProducts(productsReq);
        if (res.data.result) {
            try {
                const newProductsInserted = await ProductModel.insertMany(res.data.productsAdded);
                newProductsInserted.forEach((p) => storeModel.products.push(p));
                storeModel.markModified('products')
                await storeModel.save()
                this.pushToStoreCache(storeName, storeModel)
                logger.info(`new products updated success in DB`);
            } catch (e) {
                logger.error(`addNewProducts DB ERROR: ${e}`);
                return {data: {result: false, productsNotAdded: productsReq}, error: {message: errorMsg.E_PROD_ADD}}
            }
        }
        return res;
    }

    async removeProducts(username: string, storeName: string, productsReq: ProductCatalogNumber[]): Promise<Res.ProductRemovalResponse> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        const store: Store = StoreMapper.storeMapperFromDB(storeModel); // need to return IProduct[] so we can send them directly to DB
        const res: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(productsReq);
        if (res.data.result) {
            try {
                await ProductModel.deleteMany({_id: {$in: res.data.productsRemoved.map(p => p.db_id)}});
                res.data.productsRemoved.forEach(p => storeModel.products.pull(p.db_id));
                storeModel.markModified('products')
                await storeModel.save();
                this.pushToStoreCache(storeName, storeModel)
                logger.info(`removed products from store ${storeName}`);
            } catch (e) {
                logger.error(`removeProducts DB ERROR: ${e}`);
                return {data: {result: false, productsNotRemoved: productsReq}, error: {message: errorMsg.E_PROD_ADD}}
            }
        }
        return res;
    }

    async assignStoreOwner(storeName: string, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser): Promise<{ res: Res.BoolResponse, notify?: string[] }> {
        logger.debug(`user: ${userWhoAssigns.name} requested to assign user:
                ${userToAssign.name} as an owner in store: ${JSON.stringify(storeName)}`)

        const storeModel = await this.findStoreModelByName(storeName); // Document
        let error: string;
        if (!storeModel) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as an owner in store: ${storeName}. error: ${error}`);
            return {res: {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}}};
        }

        const userWhoAssignsOwner = this.findStoreOwner(storeModel, userWhoAssigns.name);
        if (!userWhoAssignsOwner) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as an owner in store: ${storeName}. error: ${error}`);
            return {res: {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}};
        }

        if (this.findStoreOwner(storeModel, userToAssign.name)) {   // already store manager
            error = errorMsg.E_AL;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as an owner in store: ${storeName}. error: ${error}`);
            return {res: {data: {result: false}, error: {message: error}}};
        }

        const alreadyAgreement = await AssignAgreementModel.findOne({storeName, newOwner: userToAssign.name})
        if (alreadyAgreement) {
            error = errorMsg.E_AL;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as an owner in store: ${storeName}. error: ${error}`);
            return {res: {data: {result: false}, error: {message: error}}};
        }

        const allOwners: string[] = storeModel.storeOwners.map((owner) => owner.name);
        const requiredApprove = allOwners.filter((name) => name !== userWhoAssigns.name)
        try {
            const newAgreement = await AssignAgreementModel.create({
                assignedByOwner: userWhoAssigns.name,
                newOwner: userToAssign.name,
                requiredApprove,
                approvedBy: [],
                storeName,
                pending: true
            });
            userWhoAssignsOwner.agreements.push(newAgreement);
            userWhoAssignsOwner.markModified('agreements')
            await userWhoAssignsOwner.save()
            this.pushToStoreCache(storeName, storeModel)
        } catch (e) {
            logger.error(`assignStoreOwner DB ERROR: ${e}`);
            return {res: {data: {result: false}, error: {message: errorMsg.E_DB}}}
        }
        return {res: {data: {result: true}}, notify: requiredApprove}
    }

    async removeStoreOwner(storeName: string, userToRemove: RegisteredUser, userWhoRemoves: RegisteredUser): Promise<Res.RemoveStoreOwnerResponse> {
        logger.debug(`user: ${JSON.stringify(userWhoRemoves.name)} requested to remove user:
                ${JSON.stringify(userToRemove.name)} as an owner in store: ${JSON.stringify(storeName)} `)
        let error: string;

        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false, owners: []}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoRemovesDoc = this.findStoreOwner(storeModel, userWhoRemoves.name);
        if (!userWhoRemovesDoc || userToRemove.name === userWhoRemoves.name) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false, owners: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        const userOwnerToRemoveDoc = this.findStoreOwner(storeModel, userToRemove.name);
        if (!userOwnerToRemoveDoc) {   // not store owner
            error = errorMsg.E_NOT_OWNER;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false, owners: []}, error: {message: error}};
        }

        if (!this.isAssignerOfOwner(userWhoRemovesDoc, userToRemove.name)) {
            error = errorMsg.E_NOT_ASSIGNER + userToRemove.name;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove owner:
                ${userToRemove.name}. error: ${error}`);
            return {data: {result: false, owners: []}, error: {message: error}};
        }

        const ownersToRemove: any[] = this.getStoreOwnersToRemove(userOwnerToRemoveDoc, storeModel);

        try {
            ownersToRemove.forEach(owner => {
                owner.managersAssigned.forEach(manager => storeModel.storeManagers.pull({_id: manager._id.toString()}))
                storeModel.storeOwners.pull({_id: owner.id})
            })
            userWhoRemovesDoc.ownersAssigned = userWhoRemovesDoc.ownersAssigned.filter(owner => owner.name !== userToRemove.name);
            storeModel.markModified('storeOwners')
            storeModel.markModified('storeManagers')
            await StoreOwnerModel.deleteMany({_id: {$in: ownersToRemove.map(owner => owner.id)}});
            await StoreManagerModel.deleteMany({
                _id: {
                    $in: ownersToRemove.reduce((acc, currOwner) =>
                        acc.concat(currOwner.managersAssigned.map(manager => manager._id.toString())), [])
                }
            });
            await userWhoRemovesDoc.save();
            await storeModel.save();
            this.pushToStoreCache(storeName, storeModel)
            logger.info(`successfully removed user: ${userToRemove.name} as an owner in store: ${storeName}, assigned by user ${userWhoRemoves.name}`)
        } catch (e) {
            logger.error(`removeStoreOwner DB ERROR: ${e}`);
            return {
                data: {result: false, owners: ownersToRemove.map(owner => owner.name)},
                error: {message: errorMsg.E_DB}
            }
        }
        return {data: {result: true, owners: ownersToRemove.map(owner => owner.name)}}
    }

    private getStoreOwnersToRemove(owner, storeModel): any[] {
        return [owner].concat(owner.ownersAssigned.reduce(
            (acc, curr) => acc.concat(this.getStoreOwnersToRemove(this.findStoreOwner(storeModel, curr.name), storeModel)), [])
        );
    }

    private isAssignerOfOwner(userWhoRemoves, username: string): boolean {
        return userWhoRemoves.ownersAssigned.find(manager => manager.name === username);
    }

    async assignStoreManager(storeName: string, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser): Promise<Res.BoolResponse> {
        logger.debug(`user: ${userWhoAssigns.name} requested to assign user:
                ${userToAssign.name} as a manager in store: ${storeName}`)
        let error: string;

        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoAssignsOwner = this.findStoreOwner(storeModel, userWhoAssigns.name);
        if (!userWhoAssignsOwner) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        if (this.findStoreManager(storeModel, userToAssign.name)) {   // already store manager
            error = errorMsg.E_AL;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        try {
            const managerToAdd: StoreManager = {
                name: userToAssign.name, managerPermissions:
                    [ManagementPermission.WATCH_PURCHASES_HISTORY, ManagementPermission.WATCH_USER_QUESTIONS, ManagementPermission.REPLY_USER_QUESTIONS]
            };
            const newManagerModel = new StoreManagerModel(managerToAdd);
            await newManagerModel.save();
            userWhoAssignsOwner.managersAssigned.push(newManagerModel);
            storeModel.storeManagers.push(newManagerModel);
            storeModel.markModified('storeOwners')
            storeModel.markModified('storeManagers')
            await userWhoAssignsOwner.save();
            await storeModel.save();
            this.pushToStoreCache(storeName, storeModel)
            logger.info(`successfully assigned user: ${userToAssign.name} as a manager in store: ${storeName}, assigned by user ${userWhoAssigns.name}`)
        } catch (e) {
            logger.error(`assignStoreOwner DB ERROR: ${e}`);
            return {data: {result: false}, error: {message: errorMsg.E_DB}}
        }
        return {data: {result: true}}
    }

    async removeStoreManager(storeName: string, userToRemove: RegisteredUser, userWhoRemoves: RegisteredUser): Promise<Res.BoolResponse> {
        logger.debug(`user: ${JSON.stringify(userWhoRemoves.name)} requested to remove user:
                ${JSON.stringify(userToRemove.name)} as a manager in store: ${JSON.stringify(storeName)} `)
        let error: string;

        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoRemovesDoc = this.findStoreOwner(storeModel, userWhoRemoves.name);
        if (!userWhoRemovesDoc || userToRemove.name === userWhoRemoves.name) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        const userManagerToRemoveDoc = this.findStoreManager(storeModel, userToRemove.name);
        if (!userManagerToRemoveDoc) {   // not store manager
            error = errorMsg.E_NOT_OWNER;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!this.isAssignerOfManager(userWhoRemovesDoc, userToRemove.name)) {
            error = errorMsg.E_NOT_ASSIGNER + userToRemove.name;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove manager:
                ${userToRemove.name}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        try {
            userWhoRemovesDoc.managersAssigned = userWhoRemovesDoc.managersAssigned.filter(manager => manager.name !== userToRemove.name);
            storeModel.storeManagers.pull({_id: userManagerToRemoveDoc.id});
            storeModel.markModified('storeOwners')
            storeModel.markModified('storeManagers')
            await StoreManagerModel.deleteOne({_id: userManagerToRemoveDoc.id})
            await userWhoRemovesDoc.save();
            await storeModel.save();
            this.pushToStoreCache(storeName, storeModel)
            logger.info(`successfully removed user: ${userToRemove.name} as a manager in store: ${storeName}, assigned by user ${userWhoRemoves.name}`)
        } catch (e) {
            logger.error(`assignStoreOwner DB ERROR: ${e}`);
            return {data: {result: false}, error: {message: errorMsg.E_DB}}
        }
        return {data: {result: true}}
    }

    private isAssignerOfManager(userWhoRemoves, username: string): boolean {
        return userWhoRemoves.managersAssigned.find(manager => manager.name === username);
    }

    async addManagerPermissions(userWhoChanges: RegisteredUser, storeName: string, usernameToChange: string, permissions: ManagementPermission[]): Promise<Res.BoolResponse> {
        logger.debug(`user: ${JSON.stringify(userWhoChanges.name)} requested to add permissions from user: ${usernameToChange} in store ${storeName}`)
        let error: string;

        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoAssignsOwnerDoc = this.findStoreOwner(storeModel, userWhoChanges.name);
        if (!userWhoAssignsOwnerDoc) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        const userManagerToAddDoc = this.findStoreManager(storeModel, usernameToChange);
        if (!userManagerToAddDoc) {   // not store owner
            error = errorMsg.E_NOT_MANAGER;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!this.isAssignerOfManager(userWhoAssignsOwnerDoc, usernameToChange)) {
            error = errorMsg.E_NOT_ASSIGNER + usernameToChange;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!this.verifyValidPermissions(permissions)) {
            error = errorMsg.E_INVALID_PERM;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        try {
            userManagerToAddDoc.managerPermissions = userManagerToAddDoc.managerPermissions.concat(permissions);
            userManagerToAddDoc.managerPermissions = [...new Set(userManagerToAddDoc.managerPermissions)];
            storeModel.markModified('storeManagers')
            await userManagerToAddDoc.save();
            await storeModel.save();
            this.pushToStoreCache(storeName, storeModel)
            logger.info(`successfully added permissions to user: ${usernameToChange}`)
        } catch (e) {
            logger.error(`addManagerPermissions DB ERROR: ${e}`);
            return {data: {result: false}, error: {message: errorMsg.E_DB}}
        }
        return {data: {result: true}};
    }

    async removeManagerPermissions(userWhoChanges: RegisteredUser, storeName: string, managerToChange: string, permissions: ManagementPermission[]): Promise<Res.BoolResponse> {
        logger.debug(`user: ${JSON.stringify(userWhoChanges.name)} requested to remove permissions from user: ${managerToChange} in store ${storeName}`)
        let error: string;

        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoChanges.name} failed to remove permissions to user:
                ${managerToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoAssignsOwnerDoc = this.findStoreOwner(storeModel, userWhoChanges.name);
        if (!userWhoAssignsOwnerDoc) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoChanges.name} failed to remove permissions to user:
                ${managerToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        const userManagerToAddDoc = this.findStoreManager(storeModel, managerToChange);
        if (!userManagerToAddDoc) {   // not store owner
            error = errorMsg.E_NOT_MANAGER;
            logger.warn(`user: ${userWhoChanges.name} failed to remove permissions to user:
                ${managerToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!this.isAssignerOfManager(userWhoAssignsOwnerDoc, managerToChange)) {
            error = errorMsg.E_NOT_ASSIGNER + managerToChange;
            logger.warn(`user: ${userWhoChanges.name} failed to remove permissions to user:
                ${managerToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!this.verifyValidPermissions(permissions)) {
            error = errorMsg.E_INVALID_PERM;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${userWhoChanges}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        try {
            userManagerToAddDoc.managerPermissions = userManagerToAddDoc.managerPermissions.filter(p => permissions.indexOf(p) === -1)
            storeModel.markModified('storeManagers')
            await userManagerToAddDoc.save();
            await storeModel.save();
            this.pushToStoreCache(storeName, storeModel)
            logger.info(`successfully removed permissions from user: ${managerToChange}`)
        } catch (e) {
            logger.error(`removeManagerPermissions DB ERROR: ${e}`);
            return {data: {result: false}, error: {message: errorMsg.E_DB}}
        }
        return {data: {result: true}};
    }

    private verifyValidPermissions(permissions: ManagementPermission[]): boolean {
        return permissions.reduce((acc, perm) => Object.values(ManagementPermission).includes(perm) || acc, false);
    }

    async getManagerPermissions(username: string, storeName: string): Promise<Res.ViewManagerPermissionResponse> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const isStoreOwner = this.findStoreOwner(storeModel, username);
        if (isStoreOwner)
            return {data: {result: true, permissions: this.getAllPermissions()}};
        const isStoreManager = this.findStoreManager(storeModel, username);
        if (!isStoreManager)
            return {data: {result: false}, error: {message: errorMsg.E_PERMISSION}};
        return {data: {result: true, permissions: isStoreManager.managerPermissions}}
    }

    private getAllPermissions(): ManagementPermission[] {
        return Object.values(ManagementPermission);
    }

    async search(filters: SearchFilters, query: SearchQuery): Promise<Res.SearchResponse> {
        let productsFound: ProductInStore[] = [];
        const DBSearchQuery = this.createSearchQuery(filters, query);
        try {
            const productsInDB = await ProductModel.find(DBSearchQuery)
            const productsInDomain: IProduct[] = productsMapperFromDB(productsInDB);
            productsFound = productsInDomain.map(product => {
                return {product, storeName: product.storeName}
            })
        } catch (e) {
            logger.error(`search DB ERROR: ${e}`);
        }
        return {data: {result: true, products: productsFound}};
    }

    private createSearchQuery(filters: SearchFilters, query: SearchQuery) {
        const searchQuery: Map<string, any> = new Map();
        // if (filters.storeRating && filters.storeRating as unknown !== "")
        //     searchQuery.set("rating", +filters.storeRating);
        if (filters.productRating && filters.productRating as unknown !== "")
            searchQuery.set("rating", +filters.productRating);
        if (filters.productCategory && filters.productCategory as unknown !== "")
            searchQuery.set("category", filters.productCategory);
        if (filters.priceRange) {
            const priceRange: Map<any, any> = new Map();
            if (filters.priceRange.min && filters.priceRange.min as unknown !== "")
                priceRange.set("$gte", +filters.priceRange.min);
            if (filters.priceRange.max && filters.priceRange.max as unknown !== "")
                priceRange.set("$lte", +filters.priceRange.max);
            if (priceRange.size > 0)
                searchQuery.set("price", mapToJson(priceRange));
        }
        if (query.productName && query.productName as unknown !== "")
            searchQuery.set("name", query.productName);
        if (query.storeName && query.storeName as unknown !== "")
            searchQuery.set("storeName", query.storeName);

        return mapToJson(searchQuery);
    }

    async viewStoreInfo(storeName: string): Promise<Res.StoreInfoResponse> {
        const store = await this.findStoreModelByName(storeName);
        if (store) {
            const storeInfo: StoreInfo = {
                storeName: store.storeName,
                description: store.description,
                storeRating: store.rating,
                storeOwnersNames: store.storeOwners.map(o => o.name),
                storeManagersNames: store.storeOwners.map(o => o.name),
                productsNames: store.products.map(p => p.name)
            }

            return {data: {result: true, info: storeInfo}}
        } else {   // store not found
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        }
    }

    async viewProductInfo(req: Req.ProductInfoRequest): Promise<Res.ProductInfoResponse> {
        const store = await this.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const product = store.getProductByCatalogNumber(req.body.catalogNumber)

        const quantity: number = store.getProductQuantity(product.catalogNumber);
        return {
            data: {
                result: true,
                info: {
                    name: product.name,
                    catalogNumber: product.catalogNumber,
                    price: product.price,
                    category: product.category,
                    quantity,
                    finalPrice: store.getProductFinalPrice(req.body.catalogNumber)
                }
            }
        }
    }

    async viewStorePurchaseHistory(user: RegisteredUser, storeName: string, isAdmin?: boolean): Promise<Res.ViewShopPurchasesHistoryResponse> {
        const storeModel = await this.findStoreModelByName(storeName);
        if (!storeModel)
            return {data: {result: false, receipts: []}, error: {message: errorMsg.E_NF}}

        let isPermitted: boolean = isAdmin;
        if (!isPermitted) {
            const permissionsVerification: Res.BoolResponse = await this.verifyStoreOperation(storeName, user.name, ManagementPermission.WATCH_PURCHASES_HISTORY, storeModel);
            isPermitted = permissionsVerification.data.result;
        }

        if (!isPermitted)
            return {
                data: {result: false, receipts: []},
                error: {message: errorMsg.E_PERMISSION}
            }

        const iReceipts: IReceipt[] = storeModel.receipts.map((r) => {
            return {
                purchases: r.purchases,
                date: r.date,
                payment: {
                    lastCC4: r.lastCC4 ? r.lastCC4 : r.payment.lastCC4,
                    totalCharged: r.totalCharged ? r.totalCharged : r.payment.totalCharged
                }
            }
        })
        return {data: {result: true, receipts: iReceipts}}
    }

    async verifyProductOnStock(req: Req.VerifyProductOnStock): Promise<Res.BoolResponse> {
        const store: Store = await this.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const product: IProduct = store.getProductByCatalogNumber(req.body.catalogNumber)
        if (!product) {
            return {data: {result: false}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}};
        }
        const stockAmount: number = store.getProductQuantity(req.body.catalogNumber)
        if (stockAmount < req.body.amount)
            return {data: {result: false}, error: {message: errorMsg.E_STOCK, options: {available: stockAmount}}};
        return {data: {result: true}}
    }

    async verifyProducts(req: Req.VerifyProducts): Promise<Res.BoolResponse> {
        const storeModel = await this.findStoreModelByName(req.body.storeName);
        const store: Store = StoreMapper.storeMapperFromDB(storeModel);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const productsNotExists = [];
        for (const catalogNumber of req.body.productsCatalogNumbers) {
            if (!store.getProductByCatalogNumber(+catalogNumber)) {
                logger.warn(`product ${catalogNumber} not found`)
                logger.warn(`products in store ${store.storeName} :` + Array.from(store.products.keys()).map((s) => s.catalogNumber))
                productsNotExists.push(catalogNumber)
            }
        }
        if (productsNotExists.length === 0) {
            return {data: {result: true}};
        } else {
            logger.warn(productsNotExists)
            return {
                data: {result: false},
                error: {message: errorMsg.E_PROD_DOES_NOT_EXIST, options: {productsNotExists}}
            }
        }
    }

    async getStoresWithOffset(limit: number, offset: number): Promise<Res.GetStoresWithOffsetResponse> {
        const storeInfos: StoreInfo[] = [];
        if (limit <= 0 || offset < 0)
            return {data: {stores: []}, error: {message: errorMsg.E_INVALID_PARAM}};

        const stores: Store[] = await this.findAllStores();

        const maxIndex = offset + limit >= stores.length ? stores.length : offset + limit;

        while (offset < maxIndex) {
            storeInfos.push(stores[offset].viewStoreInfo().data.info);
            offset++;
        }

        return {data: {stores: storeInfos}};
    }

    async getAllProductsInStore(storeName: string): Promise<Res.GetAllProductsInStoreResponse> {
        const productInStore: ProductInStore[] = [];
        const storeModel = await this.findStoreModelByName(storeName); // Document

        if (!storeModel)
            return {data: {products: []}};

        for (const currProd of storeModel.products) {
            const currProductInStore: ProductInStore = {
                storeName,
                storeRating: storeModel.rating,
                product: {
                    catalogNumber: currProd.catalogNumber,
                    price: currProd.price,
                    name: currProd.name,
                    category: currProd.category,
                    rating: currProd.rating
                }
            }
            productInStore.push(currProductInStore);
        }

        return {data: {products: productInStore}};
    }

    async getAllCategoriesInStore(storeName: string): Promise<Res.GetCategoriesResponse> {
        const categoriesInStore: ProductCategory[] = [];
        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel)
            return {data: {categories: []}};

        for (const currProd of storeModel.products) {
            categoriesInStore.push(currProd.category);
        }

        return {data: {categories: [...new Set(categoriesInStore)]}};
    }

    async getManagersPermissions(storeName: string): Promise<Res.GetAllManagersPermissionsResponse> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel)
            return {data: {result: false, permissions: []}, error: {message: errorMsg.E_INVALID_STORE}}
        const permissions: ManagerNamePermission[] = [];

        storeModel.storeManagers.forEach(storeManager => {
            permissions.push({managerName: storeManager.name, permissions: storeManager.managerPermissions})
        })
        return {data: {result: true, permissions}}
    }


    async verifyStoreBag(storeName: string, bagItems: BagItem[]): Promise<Res.BoolResponse> {
        const store: Store = await this.findStoreByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const notInStock: BagItem[] = bagItems.filter((bagItem) => (store.getProductQuantity(bagItem.product.catalogNumber) - bagItem.amount) < 0)
        return notInStock.length === 0 ? {data: {result: true}} : {
            data: {result: false},
            error: {message: errorMsg.E_STOCK, options: notInStock}
        }

    }

    async purchaseFromStore(storeName: string, bagItems: BagItem[], userName: string, payment: IPayment): Promise<Purchase[]> {
        const store: Store = await this.findStoreByName(storeName);
        const purchases: Purchase[] = [];

        for (const bagItem of bagItems) {
            const items: IItem[] = await store.getItemsFromStock(bagItem.product, bagItem.amount)
            for (const item of items) {
                const outputItem: IItem = {catalogNumber: item.catalogNumber, id: item.id}
                purchases.push({storeName, userName, item: outputItem, price: bagItem.finalPrice / bagItem.amount})
            }
        }
        try {
            const receipt = await ReceiptModel.create({
                date: new Date(),
                lastCC4: payment.lastCC4,
                totalCharged: payment.totalCharged,
                purchases
            });
            store.addReceipt(receipt);
            await this.updateStoreModel(store.storeName, {receipts: store.receipts})
        } catch (e) {
            logger.error(`DB ERROR ${e}`);
            return [];
        }

        return purchases
    }

    async calculateFinalPrices(storeName: string, bagItems: BagItem[]): Promise<BagItem[]> {
        logger.info(`calculate final prices in store ${storeName}`)
        const store: Store = await this.findStoreByName(storeName);
        // reset prices from last check
        for (const bagItem of bagItems) {
            const lastPrice: number = bagItem.finalPrice
            bagItem.finalPrice = bagItem.product.price * bagItem.amount;
            if (bagItem.finalPrice !== lastPrice) {
                logger.info(`final price changed! new final price ${bagItem.finalPrice}`)
            }
        }

        return store.calculateFinalPrices(bagItems)
    }

    async setDiscountPolicy(user: RegisteredUser, storeName: string, discounts: IDiscountPolicy): Promise<Res.BoolResponse> {
        const store: Store = await this.findStoreByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const isSuccess: boolean = await store.setDiscountPolicy(discounts.discounts);

        this._storesCache.delete(storeName)
        return isSuccess ? {data: {result: true}} : {data: {result: false}, error: {message: errorMsg.E_DB}}
    }

    async getStoreDiscountPolicy(user: RegisteredUser, storeName: string): Promise<IDiscountPolicy> {
        const storeM = await this.findStoreModelByName(storeName);
        storeM.discountPolicy.children = storeM.discountPolicy.children.filter((discount) => this.isValid(discount.startDate, discount.duration))
        await storeM.discountPolicy.save()
        const store: Store = StoreMapper.storeMapperFromDB(storeM);
        const discount: DiscountPolicy = store.discountPolicy as DiscountPolicy;
        const children: Map<Discount, Operators> = discount.children;
        const discountInPolicy: IDiscountInPolicy[] = [];
        for (const [discount, operator] of children) {
            const iDiscount: IDiscount = this.convertDiscountToIDiscount(discount);
            discountInPolicy.push({discount: iDiscount, operator});
        }
        const policy: IDiscountPolicy = {discounts: discountInPolicy}

        return policy;
    }

    private isValid(date: Date, duration: number): boolean {
        const today = new Date();
        const endDate = this.addMinutes(date, duration * 24 * 60);
        return today < endDate;
    }

    private addMinutes(date, minutes): Date {
        return new Date(date.getTime() + minutes * 60000);
    }

    async getStorePurchasePolicy(user: RegisteredUser, storeName: string): Promise<IPurchasePolicy> {
        const store: Store = await this.findStoreByName(storeName);
        const purchasePolicy: PurchasePolicyImpl = store.purchasePolicy as PurchasePolicyImpl;
        const children: Map<PurchasePolicy, Operators> = purchasePolicy.children;
        const purchasePolicyElements: IPurchasePolicyElement[] = [];
        for (const [policy, operator] of children) {
            const iPurchasePolicy: ISimplePurchasePolicy = this.convertPolicyToISimplePurchasePolicy(policy);
            purchasePolicyElements.push({policy: iPurchasePolicy, operator});
        }
        const policy: IPurchasePolicy = {policy: purchasePolicyElements}

        return policy;
    }

    async setPurchasePolicy(user: RegisteredUser, storeName: any, policy: IPurchasePolicy): Promise<Res.BoolResponse> {
        const store: Store = await this.findStoreByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const setPolicyOk: boolean = await store.setPurchasePolicy(policy.policy);
        this._storesCache.delete(storeName)
        return setPolicyOk ? {data: {result: true}} :
            {data: {result: setPolicyOk}, error: {message: setPolicyOk ? undefined : errorMsg.SET_POLICY_FAILED}}
    }

    async verifyStorePolicy(user: RegisteredUser, storeName: string, bagItems: BagItem[]): Promise<Res.BoolResponse> {
        logger.info(`request to verify purchase policy in store ${storeName}`)
        const store: Store = await this.findStoreByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const isPolicyOk: boolean = store.verifyStorePolicy(user, bagItems);
        return isPolicyOk ? {data: {result: true}} : {
            data: {result: false},
            error: {message: errorMsg.VERIFY_POLICY_FAILED + " in store " + storeName}
        }
    }

    async getItemIds(storeName: string, catalogNumber: number): Promise<Res.GetItemsIdsResponse> {
        const store: Store = await this.findStoreByName(storeName);
        if (!store)
            return {data: {result: false, items: []}, error: {message: errorMsg.E_INVALID_STORE}}

        const product: IProduct = store.getProductByCatalogNumber(catalogNumber);
        if (!product)
            return {data: {result: false, items: []}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}}

        return {data: {result: true, items: store.products.get(product).reduce((acc, curr) => acc.concat(curr.id), [])}}
    }

    private convertDiscountToIDiscount(discount: Discount): IDiscount {
        const condDiscount: CondDiscount = discount as CondDiscount;
        let conditions: IConditionOfDiscount[];
        if (condDiscount.conditions && condDiscount.conditions.size !== 0) {
            conditions = [];
            for (const [condition, operator] of condDiscount.conditions) {
                const catalogNumber: number = condition.getCatalogNumber();
                const minPay: number = condition.getMinPay();
                const minAmount: number = condition.getMinAmount();
                if (typeof minAmount === "undefined" && typeof minPay === "undefined") {
                    conditions.push({
                        condition: {
                            catalogNumber
                        }, operator
                    })
                } else if (minPay >= 0) {
                    conditions.push({
                        condition: {
                            minPay
                        }, operator
                    })
                } else if (minAmount >= 0) {
                    conditions.push({
                        condition: {
                            catalogNumber,
                            minAmount
                        }, operator
                    })
                }
            }
        }
        return {
            startDate: discount.startDate,
            duration: discount.duration,
            percentage: discount.percentage,
            products: discount.productsInDiscount,
            category: discount.category,
            condition: conditions
        }

    }

    private convertPolicyToISimplePurchasePolicy(policy: PurchasePolicy): ISimplePurchasePolicy {
        const tag: string = policy.getPolicyTag();
        switch (tag) {
            case "bag": {
                const bagP: BagPolicy = policy as BagPolicy;
                return {bagPolicy: {minAmount: bagP.minAmount, maxAmount: bagP.maxAmount}}
                break;
            }
            case "product": {
                const productP: ProductPolicy = policy as ProductPolicy;
                return {
                    productPolicy: {
                        catalogNumber: productP.catalogNumber,
                        minAmount: productP.minAmount,
                        maxAmount: productP.maxAmount
                    }
                }
                break;
            }
            case "system": {
                const systemP: SystemPolicy = policy as SystemPolicy;
                return {systemPolicy: {notForSellDays: Array.from(systemP.notForSellDays)}}
                break;
            }
            case "user": {
                const userP: UserPolicy = policy as UserPolicy;
                return {userPolicy: {countries: Array.from(userP.countries)}}
                break;
            }
            default: {
                return undefined
            }

        }

    }


    //region TO BE DELETED

    // getStoresInfoOfManagedBy(username: string): StoreInfo[] {
    //     const stores: StoreInfo[] = [];
    //
    //     this._stores.forEach(store => {
    //             if (store.verifyIsStoreManager(username))
    //                 stores.push(store.viewStoreInfo().data.info);
    //         }
    //     )
    //     return stores;
    // }
    //
    // getStoresInfoOfOwnedBy(username: string): StoreInfo[] {
    //     const stores: StoreInfo[] = [];
    //     this._stores.forEach(store => {
    //             if (store.verifyIsStoreOwner(username))
    //                 stores.push(store.viewStoreInfo().data.info);
    //         }
    //     )
    //     return stores;
    // }

    // async verifyStoreManager(storeName: string, user: RegisteredUser): Promise<boolean> {
    //     const store: Store = await this.findStoreByName(storeName);
    //     return store ? store.verifyIsStoreManager(user.name) : false;
    // }


    // async removeProductsWithQuantity(user: RegisteredUser, storeName: string, productsReq: ProductWithQuantity[], isReturnItems: boolean): Promise<Res.ProductRemovalResponse> {
    //     const store: Store = await this.findStoreByName(storeName);
    //     return store.removeProductsWithQuantity(productsReq, isReturnItems);
    // }

    // private getProductsFromRequest(productsReqs: ProductReq[]): Product[] {
    //     const products: Product[] = [];
    //     for (const productReq of productsReqs) {
    //         const product: Product = new Product(productReq.name, +productReq.catalogNumber, productReq.price, productReq.category);
    //         products.push(product);
    //     }
    //     return products;
    // }

    // private getItemsFromRequest(itemsReq: IItem[]): Item[] {
    //     const items: Item[] = [];
    //     for (const itemReq of itemsReq) {
    //         const item: Item = new Item(itemReq.id, itemReq.catalogNumber);
    //         items.push(item);
    //     }
    //     return items;
    // }


    //endregion
    async approveStoreOwner(storeName: any, usernameToAssign: RegisteredUser, usernameWhoApprove: RegisteredUser): Promise<BoolResponse> {
        const storeModel = await this.findStoreModelByName(storeName); // Document
        if (!storeModel) {
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }
        const usernameWhoApproveOwner = this.findStoreOwner(storeModel, usernameWhoApprove.name);
        if (!usernameWhoApproveOwner) {
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }
        try {
            const agreement = await AssignAgreementModel.findOne({storeName, newOwner: usernameToAssign.name})
            if (!agreement) {
                logger.warn(`approveStoreOwner didnt found agreement`)
                return {data: {result: false}, error: {message: errorMsg.E_AGREEMENT}}
            }
            const isRequired: boolean = agreement.requiredApprove.find((r) => r === usernameWhoApprove.name) && !agreement.approvedBy.find((r) => r === usernameWhoApprove.name)
            if (isRequired) {
                agreement.approvedBy.push(usernameWhoApprove.name);
                agreement.markModified('approvedBy')
                await agreement.save();
                return {data: {result: true}}
            } else {
                logger.warn(`approveStoreOwner not required to approve`)
                return {data: {result: false}, error: {message: errorMsg.E_AGREEMENT}}
            }
        } catch (e) {
            logger.error(`approveStoreOwner DB ERROR ${e}`)
            return {data: {result: false}, error: {message: errorMsg.E_DB}}
        }
    }

    async addOwnerIfAccepted(newOwner: string, storeName: string): Promise<boolean> {
        try {
            const agreement = await AssignAgreementModel.findOne({storeName, newOwner})
            if (agreement.pending !== true) {
                logger.warn(`trying to accept someone who not pending ${newOwner} as an owner in store: ${storeName}, assigned by user ${agreement.assignedByOwner}`)
                return false;
            }
            if (agreement.requiredApprove.length === agreement.approvedBy.length && agreement.requiredApprove.sort().every((value, index) => {
                return value === agreement.approvedBy.sort()[index]
            })) {
                const storeModel = await this.findStoreModelByName(storeName); // Document
                const userWhoAssignsOwner = this.findStoreOwner(storeModel, agreement.assignedByOwner);
                const ownerToAdd = new StoreOwnerModel({name: newOwner})
                await ownerToAdd.save();
                userWhoAssignsOwner.ownersAssigned.push(ownerToAdd);
                storeModel.storeOwners.push(ownerToAdd);
                storeModel.markModified('storeOwners')
                agreement.pending = false;
                await agreement.save()
                await userWhoAssignsOwner.save();
                await storeModel.save()
                this.pushToStoreCache(storeName, storeModel)
                logger.info(`successfully assigned user: ${newOwner} as an owner in store: ${storeName}, assigned by user ${agreement.assignedByOwner}`)
                return true;
            } else {
                logger.warn(`Need more approved to make ${newOwner} as an owner in store: ${storeName}, assigned by user ${agreement.assignedByOwner}`)
                return false;
            }
        } catch (e) {
            logger.error(`assignStoreOwner DB ERROR: ${e}`);
            return false;
        }
    }

    async updateStoreModel(storeName: string, fields: any): Promise<boolean> {
        try {
            const populateQuery = this.DEFAULT_STORE_POPULATION.map(field => {
                return {path: field}
            });
            const u = await StoreModel.findOneAndUpdate({storeName}, fields, {new: true}).populate(populateQuery)
            this.pushToStoreCache(storeName, u)
            return true;
        } catch (e) {
            logger.error(`updateStoreModel DB ERROR cant ${e}`)
            return false;
        }
    }

    pushToStoreCache(storeName: any, newUser: any) {
        if (this._storesCache.has(storeName))
            this._storesCache.delete(storeName);
        else if (this._storesCache.size === this.MAX_CACHE_SIZE)
            this._storesCache.delete(this._storesCache.keys().next().value);
        this._storesCache.set(storeName, newUser)
    }

}