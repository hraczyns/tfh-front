import ValidatedInput from "../utils/ValidatedInput";
import PasswordInput from "../utils/PasswordInput";
import {useContext, useState} from "react";
import userService from "../rest/functionalities/UserService";
import {useHistory} from "react-router-dom";
import {UserContext} from "../context/UserContext";

const Login = () => {
    const [data, setData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState("");
    const {setUser} = useContext(UserContext);
    const history = useHistory();

    const handleChange = ({target: {name, value}}) => {
        setData((prevState) => (
            {
                ...prevState,
                [name]: value
            }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisabled()) return;
        try {
            await userService.login(
                data.username,
                data.password,
            );
            setUser(data.username);
            setError("");
            history.push("/");
        } catch (e) {
            setError("Incorrect username or password");
        }
    }

    const isDisabled = () => {
        return Object.values(data).map(v => v).some(v => !v);
    }

    return <main className={"user-wrapper"}>
        <section className={"user-main"}>
            <div className={"user-header-wrapper"}>
                <header className={"user-header"}>Login</header>
            </div>
            <form className={"user-form"} onSubmit={handleSubmit}>
                <div className={"user-form-element"}>
                    <label>Username (email):</label>
                    <ValidatedInput name={"username"}
                                    type={"email"}
                                    className={"user-input"}
                                    placeholder={"Type username (email)"}
                                    value={data.username}
                                    onChange={handleChange}
                                    validate={false}
                    />
                </div>
                <div className={"user-form-element"}>
                    <label>Password:</label>
                    <PasswordInput name={"password"}
                                   className={"user-input"}
                                   placeholder={"Type password"}
                                   value={data.password}
                                   toggle
                                   onChange={handleChange}
                                   validate={false}
                    />
                </div>
                <div className={"user-form-element"}>
                    <span className={"user-login-error"}>{error}</span>
                </div>
                <div className={"user-form-element"}>
                    <input className={"user-btn"} value={"Login!"} type={"submit"} disabled={isDisabled()}/>
                </div>
            </form>
        </section>
    </main>
}

export default Login;