import EmailValidator from "../validations/EmailValidator";
import PersonalDataValidator from "../validations/PersonalDataValidator";
import {useEffect, useState} from "react";

import './validations.css';

const REQUIRED = "This field is required";
const CAN_ONLY_CONTAIN_LETTERS = "Text field can only contain letters";
const INVALID_MAIL = "Text field doesn't match email pattern";

const addOnlyBorderOnErrorIfAvailable = (onlyBorderOnError, inputClassName) => {
    if (onlyBorderOnError && !inputClassName.includes('error-field--onlyBorder')) {
        inputClassName += " error-field--onlyBorder";
    }
    return inputClassName;
}

const addErrorFieldIfNotExistAndOnlyBorderOnErrorIfAvailable = (onlyBorderOnError, inputClassName) => {
    if (!inputClassName.includes('error-field')) {
        inputClassName += ' error-field';
        inputClassName = addOnlyBorderOnErrorIfAvailable(onlyBorderOnError, inputClassName);
    }
    return inputClassName;
}

const ValidatedInput = ({
                            className = "",
                            value,
                            name,
                            placeholder,
                            onChange,
                            type,
                            onlyBorderOnError,
                            setValid,
                            validate = "true"
                        }) => {

    const [validationResult, setValidationResult] = useState({
        errorMessage: '',
        inputClassName: className,
        spanClassName: 'error-hidden',
        isValid: false
    });

    useEffect(() => {
        if (!validate) return;
        let errorMessage;
        let inputClassName = className;
        let spanClassName = 'error-hidden';
        let isValid = false;

        if (!value || value === '') {
            inputClassName = addErrorFieldIfNotExistAndOnlyBorderOnErrorIfAvailable(onlyBorderOnError, inputClassName);
            spanClassName = 'error';
            errorMessage = REQUIRED;
        } else if (type && type === 'personalData' && !PersonalDataValidator.isValid(value)) {
            inputClassName = addErrorFieldIfNotExistAndOnlyBorderOnErrorIfAvailable(onlyBorderOnError, inputClassName);
            spanClassName = 'error';
            errorMessage = CAN_ONLY_CONTAIN_LETTERS;
        } else if (type && type === 'email' && !EmailValidator.isValid(value)) {
            inputClassName = addErrorFieldIfNotExistAndOnlyBorderOnErrorIfAvailable(onlyBorderOnError, inputClassName);
            spanClassName = 'error';
            errorMessage = INVALID_MAIL;
        } else {
            isValid = true;
        }

        if (isValid !== validationResult.isValid) {
            setValid && setValid(name, isValid);
        }

        setValidationResult({
            errorMessage: errorMessage,
            inputClassName: inputClassName,
            spanClassName: spanClassName,
            isValid: isValid
        })
    }, [className, name, onlyBorderOnError, setValid, type, validate, validationResult.isValid, value]);

    return <>
        <input className={validationResult.inputClassName} value={value} name={name} placeholder={placeholder}
               onChange={onChange}/>
        <span className={validationResult.spanClassName}>{validationResult.errorMessage}</span>
    </>;
}

export default ValidatedInput