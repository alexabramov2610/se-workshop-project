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
import { init } from '../src/utils/api'
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin = () => {
        this.setState({ isLoggedIn: true })

    }

    onLogout = () => {
        this.setState({ isLoggedIn: false })
    }
    componentDidMount() {
        init();

    }
    render() {
        return (

            <Router history={history}>
                <Header isLoggedIn={this.state.isLoggedIn} onLogout={this.onLogout} />
                <Switch>
                    <Route exact path="/" component={HomePageContainer} />
                    <Route path="/category" component={CategoryPage} />
                    <Route path="/signupsignin" render={(props) => <SignInAndSignUpPage onLogin={this.onLogin} />} />
                    {/*<Route exact path="/checkout" component={CheckoutPage}/>*/}
                    {/*<Route exact path="/ordersummery" component={OrderSummery}/>*/}
                    {/*<Route exact path="/contact" component={ContactPage}/>*/}
                    {/*<Route*/}
                    {/*    exact*/}
                    {/*    path="/signin"*/}
                    {/*    render={() =>*/}
                    {/*        this.props.currentUser ? (*/}
                    {/*            <Redirect to="/"/>*/}
                    {/*        ) : (*/}
                    {/*            <SignInAndSignUpPage/>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*/>*/}
                </Switch>
            </Router>

        );
    }
}

export default App;
