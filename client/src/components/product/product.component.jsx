import React, {useState} from "react";
import {
    ProductContainer,
    ProductFooterContainer,
    AddDiscount,
    BackgroundImage,
    NameContainer,
    PriceContainer
} from "./product.styles";

const Product = ({product}) => {

    const [isSelected, toggleSelection] = useState(false);

    return (
        <ProductContainer isSelected={isSelected}>
            <BackgroundImage className="image"
                             imageUrl={product.imageUrl}/>
            <ProductFooterContainer>
                <NameContainer>{product.name}</NameContainer>
                <PriceContainer>{product.price}&#8362;</PriceContainer>
            </ProductFooterContainer>
            <AddDiscount onClick={() => {
                toggleSelection(!isSelected);
            }} inverted>
                {isSelected ? "Remove " : "Add "}
            </AddDiscount>
        </ProductContainer>
    )
}

export default Product;
