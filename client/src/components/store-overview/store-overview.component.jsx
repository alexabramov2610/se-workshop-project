import React, {useState} from 'react';
import {StorePageCtx} from "../../pages/store-page/store-page-ctx";
import {Divider} from "antd";
import {ProductsGrid} from "../products-grid/products-grid";

const StoreOverview = () => {

    return (
        <StorePageCtx.Consumer>
            {
                props => {
                    console.log(props.info)
                    return (
                        <React.Fragment>
                            <Divider style={{fontSize: "25px"}} orientation={"left"}>{props.info.storeName}</Divider>
                            <h4>About Us</h4>
                            <p>{props.info.description}</p>
                            <h4>Our Products</h4>
                            <ProductsGrid storeName={props.info.storeName}/>
                        </React.Fragment>
                    );
                }
            }
        </StorePageCtx.Consumer>
    );

}

export default StoreOverview;