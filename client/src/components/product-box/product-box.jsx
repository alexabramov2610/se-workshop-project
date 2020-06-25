import React from "react";
import Card from "react-bootstrap/Card";
import {AiFillStar} from "react-icons/ai";
import {FiBox} from "react-icons/fi";
import {history} from "../../utils/config";
import {Link} from "react-router-dom";
import {CustomButton} from "../../components/custom-button/custom-button.component";
import * as api from "../../utils/api";
import {CartCtx} from "../../contexts/cart-context";
import {ProductDetails} from "./products-box.styles";

export const ProductBox = ({name, price, rating, store, cn, category}) => (
    <Card className="text-center grid-item">
        <Card.Body>
            <Card.Title>
                <FiBox style={{marginRight: "4px", marginBottom: "2px"}}/>
                {name}
            </Card.Title>
            <ProductDetails>
                <div>Price: {`${price} ₪`}</div>
                <div>Category: {category}</div>
                <div>
                    Store: <Link to={`/store/${store}`}>{store}</Link>
                </div>
                <div>
                    Rating :
                    {[1, 2, 3, 4, 5].map(
                        (e, index) =>
                            index < rating && (
                                <AiFillStar key={index} style={{marginBottom: "2px"}}/>
                            )
                    )}
                </div>
            </ProductDetails>
        </Card.Body>
        <Card.Footer>
            <CartCtx.Consumer>
                {(value) => (
                    <CustomButton
                        style={{margin: "auto"}}
                        onClick={handleClick(value, store, cn)
                        }
                    >
                        Add To Cart
                    </CustomButton>
                )}
            </CartCtx.Consumer>
        </Card.Footer>
    </Card>
);
function handleClick(value, store, cn) {
    return (ev) => value.addToCart({
        body: {
            storeName: store,
            catalogNumber: cn,
            amount: 1,
        },
    });
}

