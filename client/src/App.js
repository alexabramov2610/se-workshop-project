import React from 'react';
import './App.css';
import {
    Switch,
    Route,
} from "react-router-dom";
import { Router } from 'react-router';
import HomePageContainer from './pages/home-page/home-page-container';
import CategoryPage from "./pages/category-page/category-page";
import { Header } from './components/header'
import { SignInAndSignUpPage } from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component'
import DiscountPage from "./pages/discount-page/discount-page.component";

import { init } from '../src/utils/api'
import { AdminInit } from './pages/admin-init/admin-init.component';
import { CreateStorePage } from './pages/create-store/create-store-page.component'
import { StorePage } from './pages/store-page/store-page'
import { SearchPage } from './pages/search-page/serch-page'
import { PersonalInfo } from './pages/personal-info-page/personal-info'
import { createBrowserHistory } from 'history';
import { history } from './utils/config'
import * as config from './utils/config'
import StorePageContainer from "./pages/store-page/store-page-container";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
        this.onLogin = this.onLogin.bind(this);
    }
    onLogin = (username) => {
        console.log(username)
        this.setState({ isLoggedIn: true }, () => config.setLoggedInUser(username))
    }

    onLogout = () => {
        this.setState({ isLoggedIn: false })
        config.setLoggedInUser(undefined);
    }

    async componentDidMount() {
        const initialized = await init();
        this.setState({ initialized: true })
    }
    render() {
        return this.state.initialized ? (
            <Router history={history}>
                <Header isLoggedIn={this.state.isLoggedIn} onLogout={this.onLogout} />
                <Switch>
                    <Route exact path="/" render={(props) => <HomePageContainer isLoggedIn={this.state.isLoggedIn} />} />
                    <Route path="/category" component={CategoryPage} />
                    <Route path={"/set-discount"} component={DiscountPage} />}
                    <Route path="/signupsignin" render={(props) => <SignInAndSignUpPage isLoggedIn={this.state.isLoggedIn} onLogin={this.onLogin} />} />
                    <Route exact path="/createStore" render={(props) => <CreateStorePage isLoggedIn={this.state.isLoggedIn} />} />
                    <Route path="/store/:storename" component={() => <StorePageContainer isLoggedIn={this.state.isLoggedIn} />} />
                    <Route exact path="/search" component={SearchPage} />
                    <Route exact path="/admininit" component={AdminInit} />
                    <Route exact path="/personalinfo" component={PersonalInfo} />
                </Switch>
            </Router>
        ) : null

    }
}

export default App;
