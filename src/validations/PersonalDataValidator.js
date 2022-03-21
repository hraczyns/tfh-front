const REGEX = /^[a-zA-Z]+$/

const PersonalDataValidator = {
    isValid: value => value && value !== '' && REGEX.test(value)
}

export default PersonalDataValidator;