import './style.css'

const Navigation = () => {
    return <nav className={"navigation"}>
        <li className={"navigation__list"}>
            <ul className={"navigation__list-element"}>Find</ul>
            <ul className={"navigation__list-element"}>Reservations</ul>
            <ul className={"navigation__list-element"}>Statistics</ul>
            <ul className={"navigation__list-element"}>About</ul>
        </li>
        <div className={"navigation__user"}>
            <button className={"navigation__user-btn navigation__user-btn--login"}>Login</button>
            <button className={"navigation__user-btn navigation__user-btn--register"}>Register</button>
        </div>
    </nav>
}

export default Navigation