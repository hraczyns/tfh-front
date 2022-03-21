import React from 'react';
import {useHistory} from 'react-router-dom';
import './utils.css';
import LinkButton from "./LinkButton";

const NotFound = () => {
    const history = useHistory();
    return <div className={"notfound"}>
        <h1 className={"notfound__head"}>404 - Not Found!</h1>
        <div>
            <LinkButton to={"/"}>Go home</LinkButton>
            <button onClick={history.goBack}>Go back</button>
        </div>
    </div>
};

export default NotFound;