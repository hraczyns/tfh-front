import './user.css';
import ValidatedInput from "../utils/ValidatedInput";
import PasswordInput from "../utils/PasswordInput";
import {useState} from "react";
import userService from "../rest/functionalities/UserService";
import {useHistory} from "react-router-dom";


const Signup = () => {
    const history = useHistory();
    const [passwordRef, setPasswordRef] = useState("");
    const [data, setData] = useState({
        username: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        },
        name: {
            value: '',
            isValid: false
        },
        surname: {
            value: '',
            isValid: false
        }
    });

    const handleChange = ({target: {name, value}}) => {
        setData((prevState) => (
            {
                ...prevState,
                [name]: {
                    ...prevState[name],
                    value: value,
                }
            }));
    }

    const setValid = (name, isValid) => {
        setData((prevState) => (
            {
                ...prevState,
                [name]: {
                    ...prevState[name],
                    isValid: isValid,
                }
            }));
    }

    const isDisabled = () => {
        return Object.values(data).map(v => v.isValid).some(v => !v) || passwordRef !== data.password.value;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisabled()) return;
        try {
            await userService.sendSignUpRequest(
                data.name.value,
                data.surname.value,
                data.username.value,
                data.password.value,
            );
            history.push("/");
        } catch (e) {
        }
    }

    return <main className={"user-wrapper"}>
        <section className={"user-main"}>
            <div className={"user-header-wrapper"}>
                <header className={"user-header"}>Sign up</header>
            </div>
            <form className={"user-form"} onSubmit={handleSubmit}>
                <div className={"user-form-element"}>
                    <label>Username (email):</label>
                    <ValidatedInput name={"username"}
                                    type={"email"}
                                    className={"user-input"}
                                    placeholder={"Type username (email)"}
                                    value={data.username.value}
                                    onChange={handleChange}
                                    setValid={setValid}
                    />
                </div>
                <div className={"user-form-element"}>
                    <label>Password:</label>
                    <PasswordInput name={"password"}
                                   className={"user-input"}
                                   placeholder={"Type password"}
                                   value={data.password.value}
                                   toggle
                                   onChange={handleChange}
                                   setValid={setValid}
                    />
                </div>
                <div className={"user-form-element"}>
                    <label>Repeat password:</label>
                    <PasswordInput className={"user-input"}
                                   placeholder={"Repeat password"}
                                   value={passwordRef}
                                   repeatMode
                                   passwordAsRef={data.password.value}
                                   onChange={({target: {value}}) => setPasswordRef(value)}
                    />
                </div>
                <div className={"user-form-element"}>
                    <label>Name:</label>
                    <ValidatedInput name={"name"}
                                    type={"personalData"}
                                    className={"user-input"}
                                    placeholder={"Type name"}
                                    value={data.name.value}
                                    onChange={handleChange}
                                    setValid={setValid}
                    />
                </div>
                <div className={"user-form-element"}>
                    <label>Surname:</label>
                    <ValidatedInput name={"surname"}
                                    type={"personalData"}
                                    className={"user-input"}
                                    placeholder={"Type surname"}
                                    value={data.surname.value}
                                    onChange={handleChange}
                                    setValid={setValid}
                    />
                </div>
                <div className={"user-form-element"}>
                    <input className={"user-btn"} value={"Create account!"} type={"submit"} disabled={isDisabled()}/>
                </div>
            </form>
        </section>
    </main>
}

export default Signup;