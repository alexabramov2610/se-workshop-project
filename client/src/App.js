import React from 'react';
import './App.css';
import {
    Switch,
    Route,
} from "react-router-dom";
import HomePageCotainer from './pages/home-page/home-page-container';
import CategoryPage from "./pages/category-page/category-page";

class App extends React.Component {
    render() {
        return (
            <div>
                {/*<Header/>*/}
                <Switch>
                    <Route exact path="/" component={HomePageCotainer}/>
                    <Route path="/category" component={CategoryPage}/>
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
            </div>
        );
    }
}

export default App;
