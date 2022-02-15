import {Fragment} from "react";
import EmailValidator from "./EmailValidator";
import PersonalDataValidator from "./PersonalDataValidator";

const RequiredInput = ({className, value, name, placeholder, onChange, type}) => {
    let errorMessage = 'This field is required';

    let inputClassName = className;
    let spanClassName = 'error-hidden';
    if (!value || value === '') {
        inputClassName += ' error-field';
        spanClassName = 'error'
    } else if (type && type === 'personalData' && !PersonalDataValidator.isValid(value)) {
        if (!inputClassName.endsWith('error-field')) {
            inputClassName += ' error-field';
        }
        spanClassName = 'error'
        errorMessage = 'Text field can only contain letters';
    } else if (type && type === 'email' && !EmailValidator.isValid(value)) {
        if (!inputClassName.endsWith('error-field')) {
            inputClassName += ' error-field';
        }
        spanClassName = 'error'
        errorMessage = 'Text field doesn\'t match email pattern';
    }


    return <>
        <input className={inputClassName} value={value} name={name} placeholder={placeholder} onChange={onChange}/>
        <span className={spanClassName}>{errorMessage}</span>
    </>;
}

export default RequiredInput