import {Res, Req} from "se-workshop-20-interfaces"
import {tradingSystem as ts} from "../service_facade/ServiceFacade";
import {ManagementPermission} from "se-workshop-20-interfaces/dist/src/Enums";
import {ManagerNamePermission} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export const createStore = (req: Req.OpenStoreRequest
): Res.BoolResponse => {
    const verifyStoreReq: Req.VerifyStoreName = {body: {storeName: req.body.storeName}, token: req.token}
    const verifyStoreRes: Res.BoolResponse = ts.verifyNewStore(verifyStoreReq);
    if (!verifyStoreRes.data.result) return verifyStoreRes
    return ts.createStore(req);
}

export const addItems = (req: Req.ItemsAdditionRequest): Res.ItemsAdditionResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MANAGE_INVENTORY, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, itemsNotAdded: req.body.items}, error: havePermission.error}
    return ts.addItems(req);
}

export const viewStoreInfo = (req: Req.StoreInfoRequest): Res.StoreInfoResponse => {
    return ts.viewStoreInfo(req);
}

export const changeProductName = (req: Req.ChangeProductNameRequest): Res.BoolResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MANAGE_INVENTORY, req.token)
    if (!havePermission.data.result)
        return {data: {result: false}, error: havePermission.error}
    const verifyProductsRes: Res.BoolResponse = ts.verifyProducts({
        body: {
            storeName: req.body.storeName,
            productsCatalogNumbers: [req.body.catalogNumber]
        },
        token: req.token
    })
    if (!verifyProductsRes.data.result)
        return verifyProductsRes
    return ts.changeProductName(req);
}

export const changeProductPrice = (req: Req.ChangeProductPriceRequest): Res.BoolResponse => {
    const verifyProductsRes: Res.BoolResponse = ts.verifyProducts({
        body: {
            storeName: req.body.storeName,
            productsCatalogNumbers: [req.body.catalogNumber]
        },
        token: req.token
    })
    if (!verifyProductsRes.data.result)
        return verifyProductsRes
    return ts.changeProductPrice(req);
}

export const removeItems = (req: Req.ItemsRemovalRequest): Res.ItemsRemovalResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MANAGE_INVENTORY, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, itemsNotRemoved: req.body.items}, error: havePermission.error}
    return ts.removeItems(req);
}

export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity): Res.ProductRemovalResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MANAGE_INVENTORY, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, productsNotRemoved: req.body.products}, error: havePermission.error}
    return ts.removeProductsWithQuantity(req);
}

export const addNewProducts = (req: Req.AddProductsRequest): Res.ProductAdditionResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MANAGE_INVENTORY, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, productsNotAdded: req.body.products}, error: havePermission.error}
    return ts.addNewProducts(req);
}

export const viewProductInfo = (req: Req.ProductInfoRequest): Res.ProductInfoResponse => {
    const verifyProductsRes: Res.BoolResponse = ts.verifyProducts({
        body: {
            storeName: req.body.storeName,
            productsCatalogNumbers: [req.body.catalogNumber]
        },
        token: req.token
    })
    if (!verifyProductsRes.data.result)
        return verifyProductsRes
    return ts.viewProductInfo(req);
}

export const removeProducts = (req: Req.ProductRemovalRequest): Res.ProductRemovalResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MANAGE_INVENTORY, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, productsNotRemoved: req.body.products}, error: havePermission.error}
    return ts.removeProducts(req);
}

export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest): Res.BoolResponse => {
    return ts.assignStoreOwner(req);
}

export const removeStoreOwner = (req: Req.RemoveStoreOwnerRequest): Res.BoolResponse => {
    return ts.removeStoreOwner(req);
}

export const assignStoreManager = (req: Req.AssignStoreManagerRequest): Res.BoolResponse => {
    return ts.assignStoreManager(req);
}

export const removeStoreManager = (req: Req.RemoveStoreManagerRequest): Res.BoolResponse => {
    return ts.removeStoreManager(req);
}

export const viewStorePurchasesHistory = (req: Req.ViewShopPurchasesHistoryRequest): Res.ViewShopPurchasesHistoryResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.WATCH_PURCHASES_HISTORY, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, receipts: []}, error: havePermission.error}
    return ts.viewStorePurchasesHistory(req);
}

export const removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Res.BoolResponse => {
    return ts.removeManagerPermissions(req);
}

export const addManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Res.BoolResponse => {
    return ts.addManagerPermissions(req);
}
export const addMultipleManagersPermissions = (req: Req.ChangeMultipleManagerPermissionRequest): Res.BoolResponse => {
    let errors: string[] = [];
    req.body.permissions.forEach((permission: ManagerNamePermission) => {
        const addManagerPermissionsReq: Req.ChangeManagerPermissionRequest = { token: req.token,
            body: { storeName: req.body.storeName, managerToChange: permission.managerName, permissions: permission.permissions}};
        const removeManagerPermissionsReq: Req.ChangeManagerPermissionRequest = { token: req.token,
            body: { storeName: req.body.storeName, managerToChange: permission.managerName, permissions: Object.values(ManagementPermission)}};
        removeManagerPermissions(removeManagerPermissionsReq);
        const addManagerPermissionsRes: Res.BoolResponse = addManagerPermissions(addManagerPermissionsReq);
        if (!addManagerPermissionsRes.data.result)
            errors.push(addManagerPermissionsRes.error.message)
    });
    if (errors.length > 0)
        return { data: { result: errors.length !== req.body.permissions.length }, error: { message: errors.join("\n") }}
    return { data: { result: true } }
}
export const viewManagerPermissions = (req: Req.ViewManagerPermissionRequest): Res.ViewManagerPermissionResponse => {
    return ts.viewManagerPermissions(req);
}

export const getManagerPermissions = (req: Req.ViewManagerPermissionRequest): Res.ViewManagerPermissionResponse => {
    return ts.getManagerPermissions(req);
}

export const search = (req: Req.SearchRequest): Res.SearchResponse => {
    return ts.search(req);
}

export const viewUsersContactUsMessages = (req: Req.ViewUsersContactUsMessagesRequest): Res.ViewUsersContactUsMessagesResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.WATCH_USER_QUESTIONS, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, messages: []}, error: havePermission.error}
    return ts.viewUsersContactUsMessages(req);
}

export const addDiscount = (req: Req.AddDiscountRequest): Res.AddDiscountResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MODIFY_DISCOUNT, req.token)
    if (!havePermission.data.result)
        return {data: {result: false}, error: havePermission.error}
    return ts.addDiscount(req)
}

export const removeDiscount = (req: Req.RemoveDiscountRequest): Res.BoolResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MODIFY_DISCOUNT, req.token)
    if (!havePermission.data.result)
        return {data: {result: false}, error: havePermission.error}
    return ts.removeDiscount(req)
}

export const setPurchasePolicy = (req: Req.SetPurchasePolicyRequest): Res.BoolResponse => {
    return ts.setPurchasePolicy(req);
}
export const viewPurchasePolicy = (req: Req.ViewStorePurchasePolicyRequest): Res.ViewStorePurchasePolicyResponse => {
    return ts.viewPurchasePolicy(req);
}

export const setDiscountsPolicy = (req: Req.SetDiscountsPolicyRequest): Res.BoolResponse => {
    return ts.setDiscountsPolicy(req);
}
export const viewDiscountsPolicy = (req: Req.ViewStoreDiscountsPolicyRequest): Res.ViewStoreDiscountsPolicyResponse => {
    return ts.viewDiscountsPolicy(req);
}

const verifyPermission = (storeName: string, permission: ManagementPermission, token: string): Res.BoolResponse => {
    return ts.verifyStorePermission({
        body: {
            storeName,
            permission
        }, token
    })
}

export const getStoresWithOffset = (req: Req.GetStoresWithOffsetRequest): Res.GetStoresWithOffsetResponse => {
    return ts.getStoresWithOffset(req);
}

export const getAllProductsInStore = (req: Req.GetAllProductsInStoreRequest): Res.GetAllProductsInStoreResponse => {
    return ts.getAllProductsInStore(req);
}

export const getAllCategoriesInStore = (req: Req.GetAllCategoriesInStoreRequest): Res.GetCategoriesResponse => {
    return ts.getAllCategoriesInStore(req);
}

export const getAllCategories = (req: Req.Request): Res.GetAllCategoriesResponse => {
    return ts.getAllCategories();
}

export const getManagersPermissions = (req: Req.GetAllManagersPermissionsRequest): Res.GetAllManagersPermissionsResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.VIEW_MANAGER_PERMISSION, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, permissions: []}, error: havePermission.error}
    return ts.getManagersPermissions(req);
}

export const getOwnersAssignedBy = (req: Req.GetOwnersAssignedByRequest): Res.GetOwnersAssignedByResponse => {
    return ts.getOwnersAssignedBy(req);
}

export const getItemIds = (req: Req.GetItemsIdsRequest): Res.GetItemsIdsResponse => {
    const havePermission: Res.BoolResponse = verifyPermission(req.body.storeName, ManagementPermission.MANAGE_INVENTORY, req.token)
    if (!havePermission.data.result)
        return {data: {result: false, items: []}, error: havePermission.error}
    return ts.getItemIds(req);
}
