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
import * as api from '../src/utils/api'
import { AdminInit } from './pages/admin-init/admin-init.component';
import { CreateStorePage } from './pages/create-store/create-store-page.component'
import { SearchPage } from './pages/search-page/serch-page'
import { PersonalInfo } from './pages/personal-info-page/personal-info'
import { CartCtx } from './contexts/cart-context'
import { history } from './utils/config'
import * as config from './utils/config'
import DiscountPageContainer from "./pages/discount-page/discount-page-container";
import StorePageContainer from "./pages/store-page/store-page-container";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            systemIsClose: false,
            cartItemsCounter: 0
        }
        this.onLogin = this.onLogin.bind(this);
        this.handleInit = this.handleInit.bind(this);
    }

    onLogin = (username) => {
        console.log(username)
        this.setState({ isLoggedIn: true, systemIsClose: false }, () => config.setLoggedInUser(username))


    }
    addToCart = async (req) => {
        const { data } = await api.addToCart(req);
        const isAdded = data.data.result;
        if (isAdded) {
            const data = await api.viewCart()
            await this.setState(prevState => {
                return {
                    cartItemsCounter: prevState.cartItemsCounter + 1
                }
            });
        }
    }

    onLogout = () => {
        this.setState({ isLoggedIn: false, systemIsClose: false })
        config.setLoggedInUser(undefined);
    }

    handleInit({ token, status, isSystemUp }) {
        console.log(isSystemUp)
        if (!isSystemUp) this.setState({ systemIsClose: true })
        else if (status && status.data && status.data.username && status.data.username.length > 0) this.onLogin(status.data.username)
        else this.setState({ systemIsClose: false })
    }

    async componentDidMount() {
        api.init(this.handleInit);
    }

    render() {
        return (!this.state.systemIsClose) ? (
            <CartCtx.Provider value={{ addToCart: this.addToCart, cartItemsCounter: this.state.cartItemsCounter }} >
                <Router history={history}>
                    <Header isLoggedIn={this.state.isLoggedIn} onLogout={this.onLogout} />
                    <Switch>
                        <Route exact path="/" render={(props) => <HomePageContainer isLoggedIn={this.state.isLoggedIn} />} />
                        <Route path="/category" component={CategoryPage} />
                        <Route path="/signupsignin" render={(props) => <SignInAndSignUpPage isLoggedIn={this.state.isLoggedIn} onLogin={this.onLogin} />} />
                        <Route exact path="/createStore" render={(props) => <CreateStorePage isLoggedIn={this.state.isLoggedIn} />} />
                        <Route path="/store/manageDiscountsPolicy/:storename" component={DiscountPageContainer} />
                        {/*<Route path="/store/manageBuyingPolicy/:storename" component={} />*/}
                        {/*<Route path="/store/manageBuyingPermissions/:storename" component={} />*/}
                        {/*<Route path="/store/manageProducts/:storename" component={} />*/}
                        <Route path="/store/:storename" render={(props) => <StorePageContainer isLoggedIn={this.state.isLoggedIn} />}/>
                        <Route exact path="/search" component={SearchPage} />
                        <Route exact path="/personalinfo" component={PersonalInfo} />
                    </Switch>
                </Router>
            </CartCtx.Provider>

        ) : <AdminInit history={history} />

    }
}

export default App;
