import './navigation.css'
import {useHistory} from "react-router-dom";
import useAuthCheck from "../hook/useAuthCheck";
import {useContext} from "react";
import {UserContext} from "../context/UserContext";
import {logout} from "../user/logoutUtil";


const Navigation = () => {
    const {user: userFromContext, setUser: setUserFromContext} = useContext(UserContext);
    const {user} = useAuthCheck();
    const history = useHistory();

    const content = () => {
        if (user || userFromContext) {
            return <>
                <button className={"navigation__user-btn navigation__user-btn--account"}
                        onClick={() => history.push('/login')}>Account
                </button>
                <button
                    className={"navigation__user-btn navigation__user-btn--logout"}
                    onClick={() => {
                        logout()
                            .then(() => {
                                setUserFromContext(null);
                                window.location.reload();
                            });
                    }}>Logout
                </button>
            </>
        }
        return <>
            <button className={"navigation__user-btn navigation__user-btn--login"}
                    onClick={() => history.push('/login')}>Login
            </button>
            <button
                className={"navigation__user-btn navigation__user-btn--register"}
                onClick={() => history.push('/signup')}>Sign up
            </button>
        </>
    };

    return <nav className={"navigation"}>
        <li className={"navigation__list"}>
            <ul className={"navigation__list-element"} onClick={() => history.push('/map')}>Find</ul>
            <ul className={"navigation__list-element"}
                onClick={() => history.push('/reservations/search')}>Reservations
            </ul>
            <ul className={"navigation__list-element"}>Statistics</ul>
            <ul className={"navigation__list-element"}>About</ul>
        </li>
        <div className={"navigation__user"}>
            {content()}
        </div>
    </nav>
}

export default Navigation