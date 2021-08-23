import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const NotFound = () => (
    <div className={"notfound"}>
        <h1 className={"notfound__head"}>404 - Not Found!</h1>
        <Link to="/">
            Go Home
        </Link>
    </div>
);

export default NotFound;