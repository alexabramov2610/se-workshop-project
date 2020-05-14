import React from 'react';
import {DiscountPageBody, DiscountPageContainer, DiscountWrapper} from "./discount-page.styles";
import Stages from "../../components/stages/stages.component";
import 'semantic-ui-css/semantic.min.css';
import {Divider} from "antd";

const DiscountPage = ({steps, currStep, titles}) => {

    return (
        <DiscountWrapper>
            <DiscountPageContainer>
                <Divider style={{fontSize: "20px"}} orientation={"left"}>{titles[currStep]}</Divider>
                <DiscountPageBody>
                    {steps[currStep]}
                </DiscountPageBody>
                <Stages step={currStep}/>
            </DiscountPageContainer>
        </DiscountWrapper>
    );
}

export default DiscountPage;