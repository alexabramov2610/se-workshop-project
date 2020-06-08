import React from 'react';
import './App.css';
import {
    Switch,
    Route,
} from "react-router-dom";
import { Router } from 'react-router';
import * as Modal from './components/modal/modal'
import HomePageContainer from './pages/home-page/home-page-container';
import CategoryPage from "./pages/category-page/category-page";
import { Header } from './components/header'
import { SignInAndSignUpPage } from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component'
import * as api from '../src/utils/api'
import { AdminInit } from './pages/admin-init/admin-init.component';
import { CreateStorePage } from './pages/create-store/create-store-page.component'
import { SearchPage } from './pages/search-page/serch-page'
import { PersonalInfo } from './pages/personal-info-page/personal-info'
import ManageProductsContainer from './pages/manage-products-page/manage-products-page-container'
import ManageProductItemsContainer from './pages/manage-products-page/manage-product-items-container'
import { CartCtx } from './contexts/cart-context'
import { history } from './utils/config'
import * as config from './utils/config'
import DiscountPageContainer from "./pages/discount-page/discount-page-container";
import StorePageContainer from "./pages/store-page/store-page-container";
import { CheckoutPage } from './pages/checkout-page/checkout.component'
import * as wssClient from "./utils/wss.client";
import ManageManagersPageContainer from "./pages/manage-managers-page/manage-managers-page-container";
import AdminViewStoresPurchaseHistoryContainer
    from "./pages/admin-view-stores-purchase-history-page/admin-view-stores-purchase-history-container";
import AdminViewUsersPurchaseHistoryContainer
    from "./pages/admin-view-user-purchase-history-page/admin-view-user-purcheses-history-container";



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            isLoggedIn: false,
            systemIsClose: false,
            cartItemsCounter: 0
        }
        this.onLogin = this.onLogin.bind(this);
        this.handleInit = this.handleInit.bind(this);
        this.cartCountUpdater = this.cartCountUpdater.bind(this);
    }

    onLogin = async (username, asAdmin) => {
        this.setState({ isLoggedIn: true, systemIsClose: false, isAdmin: asAdmin }, () => config.setLoggedInUser(username))
        await this.cartCountUpdater();
    }

    addToCart = async (req) => {
        const { data } = await api.addToCart(req);
        const isAdded = data.data.result;
        if (isAdded) {
            await this.cartCountUpdater();
        } else {
            Modal.warning("", data.error.message)
        }
    }

    cartCountUpdater = async () =>
        await api.viewCart().then(({ data }) => {
            this.setState(prevState => {
                return {
                    cartItemsCounter: data.data.result ?
                        data.data.cart.products.reduce((acc, product) => acc + product.bagItems.reduce((acc, bag) => acc + bag.amount, 0), 0) :
                        prevState.cartItemsCounter
                }
            });
        });

    onLogout = async () => {
        this.setState({ isLoggedIn: false, systemIsClose: false })
        config.setLoggedInUser(undefined);
        await this.cartCountUpdater();
    }

    handleInit({ token, status, isSystemUp }) {
        console.log(isSystemUp)
        if (!isSystemUp) this.setState({ systemIsClose: true })
        else if (status && status.data && status.data.username && status.data.username.length > 0) this.onLogin(status.data.username)
        else this.setState({ systemIsClose: false })
    }

    async componentDidMount() {
        api.init(this.handleInit);
        await this.cartCountUpdater();
    }

    render() {
        return (!this.state.systemIsClose) ? (
            <CartCtx.Provider value={{ addToCart: this.addToCart, cartItemsCounter: this.state.cartItemsCounter, cartCountUpdater: this.cartCountUpdater }} >
                <Router history={history}>
                    <Header isLoggedIn={this.state.isLoggedIn} isAdmin={this.state.asAdmin} onLogout={this.onLogout} />
                    <Switch>
                        <Route exact path="/" render={(props) => <HomePageContainer isLoggedIn={this.state.isLoggedIn} />} />
                        <Route path="/category" component={CategoryPage} />
                        <Route path="/signupsignin" render={(props) => <SignInAndSignUpPage isLoggedIn={this.state.isLoggedIn} onLogin={this.onLogin} />} />
                        <Route exact path="/createStore" render={(props) => <CreateStorePage isLoggedIn={this.state.isLoggedIn} />} />
                        {/*<Route path="/store/permissions" component={ManageManagersPageContainer} />*/}
                        {/*<Route path="/store/manageBuyingPolicy/:storename" component={} />*/}
                        {/*<Route path="/store/manageBuyingPermissions/:storename" component={} />*/}
                        <Route path="/store/manageProducts/:storename" component={ManageProductsContainer} />
                        <Route path="/store/:storename/edit-product/:catalognumber" render={(props) => <ManageProductItemsContainer />} />
                        <Route path="/store/:storename" render={(props) => <StorePageContainer isLoggedIn={this.state.isLoggedIn} />} />
                        <Route exact path="/search" component={SearchPage} />
                        <Route exact path="/checkout" render={(props) => <CheckoutPage cartCountUpdater={this.cartCountUpdater} />} />
                        <Route exact path="/personalinfo" component={PersonalInfo} />
                        <Route exact path="/adminViewStores" component={AdminViewStoresPurchaseHistoryContainer} />
                        <Route exact path="/adminViewUsers" component={AdminViewUsersPurchaseHistoryContainer} />
                    </Switch>
                </Router>
            </CartCtx.Provider>

        ) : <AdminInit history={history} />

    }
}

export default App;
