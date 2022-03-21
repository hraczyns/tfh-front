import './user.css';
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import userService from "../rest/functionalities/UserService";

const SignupVerificationToken = () => {
    const [isOk, setOk] = useState(false);
    useEffect(() => {
        (async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");
            try {
                await userService.verifyAccount(token);
                setOk(true);
            } catch (e) {
                setOk(false);
            }
        })();
    }, []);


    return <main className={"signup-post-actions-wrapper"}>
        <header>
            You account is {isOk ? "successfully verified" : "being verified"}. Thank you for the verification!
        </header>
        <div>
            <Link to={"/"}>Go home</Link>
            <Link to={"/login"}>Login</Link>
        </div>
    </main>
}

export default SignupVerificationToken;