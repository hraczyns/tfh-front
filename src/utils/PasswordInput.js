import './utils.css';
import {useEffect, useState} from "react";
import PasswordValidator from "../validations/PasswordValidator";

const PW_SHOWN = "https://img.icons8.com/ios-glyphs/30/000000/visible--v1.png";
const PW_HIDDEN = "https://img.icons8.com/ios-glyphs/30/000000/hide.png";

const PasswordInput = ({
                           className,
                           onChange,
                           value: inputValue,
                           name,
                           placeholder,
                           toggle,
                           repeatMode,
                           passwordAsRef,
                           setValid,
                           validate = "true"
                       }) => {
    const [isPwShown, setPwShown] = useState(false);

    const [validationResult, setValidationResult] = useState({
        errorMessage: '',
        isValid: false,
        inputClassName: className,
        violations: [],
        spanClassName: 'error-hidden'
    });

    const getToggle = () => {
        if (toggle) {
            const style = {
                WebkitMaskImage: "url('" + (isPwShown ? PW_SHOWN : PW_HIDDEN) + "')",
                maskImage: "url('" + (isPwShown ? PW_SHOWN : PW_HIDDEN) + "')"
            };
            return <div className={"password-toggle"} style={style}
                        onClick={() => setPwShown(prev => !prev)}/>
        }
    }

    useEffect(() => {
        if (!validate) return;
        const value = inputValue;
        let isValid = true;
        let isPasswordRepeatError = false;
        let errorMessage;
        let inputClassName = className;
        let spanClassName = 'error-hidden';
        let violations = [];

        if (!repeatMode && !passwordAsRef) {
            violations = PasswordValidator.validate(value);
            errorMessage = 'Invalid password';
        } else if ((repeatMode && !passwordAsRef) || (passwordAsRef && repeatMode && passwordAsRef !== value)) {
            errorMessage = "Passwords don't match";
            isPasswordRepeatError = true;
        }
        if (violations.length > 0 || isPasswordRepeatError) {
            if (!inputClassName.includes('error-field')) {
                inputClassName += ' error-field';
            }
            spanClassName = 'error';
            isValid = false;
        }

        if (isValid !== validationResult.isValid && !repeatMode) {
            setValid && setValid(name, isValid);
        }

        setValidationResult({
            errorMessage: errorMessage,
            isValid: isValid,
            inputClassName: inputClassName,
            violations: violations,
            spanClassName: spanClassName
        });
    }, [className, inputValue, name, passwordAsRef, repeatMode, setValid, validate, validationResult.isValid])


    return <>
        <div className={"password-input-container"}>
            <input className={"password-input " + validationResult.inputClassName} value={inputValue} name={"password"}
                   placeholder={placeholder}
                   onChange={onChange}
                   type={isPwShown ? "text" : "password"}
                   onCopy={(e) => {
                       e.preventDefault();
                       return false;
                   }}
                   onPaste={(e) => {
                       e.preventDefault();
                       return false;
                   }
                   }/>
            {getToggle()}
        </div>
        <span className={validationResult.spanClassName}>{validationResult.errorMessage}</span>
        <ul className={"error-password-container"}>
            {validationResult.violations.map((violation, index) => <li key={index}
                                                                       className={validationResult.spanClassName}>{violation}</li>)}
        </ul>
    </>;
}

export default PasswordInput;