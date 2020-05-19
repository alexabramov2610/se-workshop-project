import React from 'react';
import {DiscountPageBody, DiscountPageContainer, DiscountWrapper} from "./discount-page.styles";
import Stages from "../../components/stages/stages.component";
import 'semantic-ui-css/semantic.min.css';
import {Divider} from "antd";
import {config} from './discount-page-config';

const DiscountPage = ({screen}) => {

    return (
        <DiscountWrapper>
            <DiscountPageContainer>
                <Divider style={{fontSize: "25px"}} orientation={"left"}>{config.titles[screen]}</Divider>
                <DiscountPageBody>
                    {config.screens[screen]}
                </DiscountPageBody>
                <Stages stage={screen}/>
            </DiscountPageContainer>
        </DiscountWrapper>
    );
}

export default DiscountPage;