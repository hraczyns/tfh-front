import PersonalDataValidator from "./PersonalDataValidator";
import EmailValidator from "./EmailValidator";
import EmptyValidator from "./EmptyValidator";
import PasswordValidator from "./PasswordValidator";

export const validators = {
    personalData: PersonalDataValidator,
    email: EmailValidator,
    empty: EmptyValidator,
    password: PasswordValidator
};

