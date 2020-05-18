import React from 'react';
import {Spin} from "antd";

const spinnerStyle = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: "right",
    alignItems: "center",
    paddingTop: "240px",
    justifyContent: "center"
};

const Spinner = ({message}) => {
    return <Spin style={spinnerStyle} tip={message}/>
}

export default Spinner;