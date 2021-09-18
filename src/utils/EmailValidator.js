const EMAIL_REGEX = /^[a-zA-Z0-9\\.\-/,;:@#!]+@[a-zA-Z0-9]+\.[a-z]{2,3}$/;

const EmailValidator = {
    isValid: text => text && EMAIL_REGEX.test(text)
}

export default EmailValidator;
