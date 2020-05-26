import React, {useEffect, useState} from "react";
import {ManageProductsPageCtx} from "./manage-products-page-ctx";
import {viewProductInfo} from "../../utils/api";
import {ManageProductsPage} from "./manage-products-page";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import * as api from "../../utils/api";
import ManageProductItemsPage from "./manage-product-Items-page";

const ManageProductItemsContainer = ({isLoggedIn}) => {

    const {storename,catalognumber} = useParams();
    const [productData, setProductData] = useState(undefined);
    useEffect(() => {
        const fetchData = async () => {
            const productInfo = await viewProductInfo(storename,catalognumber);
            setProductData(productInfo.data.data.info);
        };
        fetchData();

    }, []);

    return productData
        ? <ManageProductItemsPage store={storename} cn={catalognumber} info={productData}></ManageProductItemsPage>
        : <Spinner message={"Loading product info"}/>
    return
}

export default ManageProductItemsContainer;
