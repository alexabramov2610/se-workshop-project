import React from "react";
import {history} from "../../utils/config";
import * as api from "../../utils/api";
import * as config from "../../utils/config";
import {Title, StoreFormContainer, StoresGridContainer} from "./personal-info.styles";
import FormInput from "../../components/form-input/form-input.component";
import Card from "react-bootstrap/Card";
import myImage from "../../assets/storeimg2.svg";
import {OptionLink} from "../../components/header/Header-styles";
import {AiTwotoneShop} from "react-icons/ai";

class PersonalInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.initPage();
    }

    async initPage() {
        const {data} = await api.getPersonalInfo();
        const {username, cart, managedStores, ownedStores, purchasesHistory} = data.data;
        this.setState({username, cart, managedStores, ownedStores, purchasesHistory});
    }

    renderStores(stores) {
        return <StoresGridContainer>
            {stores &&
            stores.map((s, index) => (
                <Card className="text-center grid-item" key={index}>
                    <Card.Img height="120px" src={myImage}/>
                    <Card.Body>
                        <Card.Title>
                            <AiTwotoneShop
                                style={{marginRight: "-8px ", marginBottom: "2px"}}
                            />
                            <OptionLink
                                as="div"
                                className="hvr-underline-from-center"
                                to="/contact"
                                onClick={() => history.push(`/store/${s.storeName}`)}
                            >
                                {s.storeName}
                            </OptionLink>
                        </Card.Title>
                        <Card.Text>{s.description}</Card.Text>
                    </Card.Body>
                </Card>
            ))}{" "}
        </StoresGridContainer>

    }


    render() {
        return (
            <div>
                <Title>Personal Info</Title>
                <div>Username: {this.state.username}
                    <div>Purchases History: {JSON.stringify(this.state.purchasesHistory)}</div>
                    <div>Managed Stores:</div>
                    {this.renderStores(this.state.managedStores)}
                    <div>Owned Stores:</div>
                    {this.renderStores(this.state.ownedStores)}
                </div>
            </div>
        );
    }
}

export {PersonalInfo};
