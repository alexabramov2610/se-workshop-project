import React from "react";
import {login} from "../../utils/api";
import FormInput from "../form-input/form-input.component";
import {CustomButton} from "../custom-button/custom-button.component";
import * as Modal from "../modal/modal";
import * as config from "../../utils/config";
import {
    SignInContainer,
    SignInTitle,
    ButtonsBarContainer,
} from "./sign-in.styles";
import * as wssClient from "../../utils/wss.client";
import {Space, Switch} from "antd";
import {BsCheck} from "react-icons/bs";
import {AiOutlineClose} from "react-icons/ai";
import * as Message from "../custom-alert/custom-alert";

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            password: "",
            asAdmin: false
        };
    }

    getAdminCheckbox = () => {
        return (
            <Space style={{display: "flex", textAlign: "center"}}>
                <div style={{paddingBottom: "3px"}}>
                    sign in as admin
                </div>
                <Switch
                    onChange={this.handleAdminCheck}
                    checkedChildren={<BsCheck/>}
                    unCheckedChildren={<AiOutlineClose/>}
                />
            </Space>
        );
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const {userName, password, asAdmin} = this.state;

        try {
            await wssClient.init(userName);
            login(userName, password, asAdmin).then(({data}) => {
                if (!data.error) {
                    this.props.onLogin(userName, asAdmin);
                    Message.success("Welcome back!")
                    config.history.push("/");
                } else {
                    Modal.warning(data.error.message);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    handleChange = (event) => {
        const {value, name} = event.target;

        this.setState({[name]: value});
    };

    handleAdminCheck = (event) => {
        this.setState({asAdmin: event})
    };

    render() {
        console.log(this.state.asAdmin);
        return (
            <SignInContainer>
                <SignInTitle>Already have an account?</SignInTitle>
                <span>Sign in with your user name and password</span>

                <form onSubmit={this.handleSubmit}>
                    <FormInput
                        name="userName"
                        type="text"
                        handleChange={this.handleChange}
                        value={this.state.userName}
                        label="User Name"
                        required
                    />
                    <FormInput
                        name="password"
                        type="password"
                        value={this.state.password}
                        handleChange={this.handleChange}
                        label="Password"
                        required
                    />

                    <Space direction={"vertical"}>
                        {this.getAdminCheckbox()}
                        <ButtonsBarContainer>
                            <CustomButton type="submit"> Sign in </CustomButton>
                        </ButtonsBarContainer>
                    </Space>
                </form>
            </SignInContainer>
        );
    }
}

export default SignIn;
