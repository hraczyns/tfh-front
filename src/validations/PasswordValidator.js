
const MIN_LENGTH = 8;

const VIOLATIONS = {
    "hasMinLength": "Password should have at least " + MIN_LENGTH + " chars",
    "hasDigit": "Password should contain at least one number",
    "hasUpper": "Password should contain at least one uppercase letter",
    "hasLower": "Password should contain at least one lowercase letter",
    "hasLetter": "Password should contain at least one letter",
    "hasSpecialChar": "Password should contain at least one special char"
};

const ALLOWED_SPECIAL_CHARACTERS = ['-', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ';', ':', '?'];

const isLetter = letter => {
    return /^[a-zA-Z]$/.test(letter);
}

const validatePassword = (value) => {
    const violations = {...VIOLATIONS};
    if (value.length >= MIN_LENGTH) {
        delete violations.hasMinLength;
    }
    for (const letter of value) {
        if (isLetter(letter) && letter === letter.toLocaleUpperCase()) delete violations.hasUpper;
        if (isLetter(letter) && letter === letter.toLocaleLowerCase()) delete violations.hasLower;
        if (!isNaN(letter)) delete violations.hasDigit;
        if (ALLOWED_SPECIAL_CHARACTERS.includes(letter)) delete violations.hasSpecialChar;
        if (isLetter(letter)) delete violations.hasLetter;
    }
    return Object.values(violations);
}

const PasswordValidator = {
    validate: (value) => validatePassword(value)
}

export default PasswordValidator;