const value = {};
value.code = {
    'SUCCESS': 0,
    'NO_USER': 1,
    'INCORRECT_PASSWORD': 2,
    'USERNAME_ALREADY_EXIST': 3,
    'USERNAME_INVALID': 4,
    'PHONE_NUMBER_ALREADY_EXIST': 5,
    'PHONE_NUMBER_INVALID': 6,
    'NAME_INVALID': 7,
    'UNKNOWN_ERROR': 8,
};

value.phoneNumberCheck = function (phone) {
    const regExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;
    if(!regExp.test(phone)) {
        return false;
    }
    return true;
}

module.exports = value;
