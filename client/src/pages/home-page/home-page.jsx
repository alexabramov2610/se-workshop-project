import React from 'react';
import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            <div>
                Home Page
                <br/>
                <Link to="/category">Got to category page</Link>
            </div>
        </div>
    );
}

export default HomePage;