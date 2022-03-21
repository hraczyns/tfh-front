const REQUIRED = "This field is required";

const EmptyValidator = {
    validate: text => text ? "" : REQUIRED
}

export default EmptyValidator;
