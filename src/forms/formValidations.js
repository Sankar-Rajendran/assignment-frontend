const validate = (values) => {
    let errors = {};

    if (!values.patientName) {
        errors.patientName = "Patient Name is required";
    }

    if (!values.dob) {
        errors.dob = "Please select date of birth";
    }

    if (!values.age) {
        if (values.age === 0 || values.age === -1) {
            errors.age = "At least patient should be 3 months old";
        }
    } else if (values.age === 0) {
        errors.age = "At least patient should be 3 months old";
    }

    if (!values.appointmentDate) {
        errors.appointmentDate = "Please select appointment date";
    } else {
        if (errors.appointmentDate < new Date()) {
            errors.appointmentDate = "Appointment date should not be past date";
        }
    }

    if (!values.phoneNo) {
        errors.phoneNo = "Phone number is required";
    }

    if (!values.addressLine1) {
        errors.addressLine1 = "Address line1 is required";
    }

    if (!values.addressLine2) {
        errors.addressLine2 = "Address line2 is required";
    }

    if (!values.city) {
        errors.city = "City is required";
    }

    if (!values.state) {
        errors.state = "State is required";
    }

    if (!values.pincode) {
        errors.pincode = "Pincode is required";
    }

    if (!values.country) {
        errors.country = "Country is required";
    }

    return errors;
};

const paymentFormValidation = (values) => {
    let errors = {};

    if (!values.paymentAmount) {
        errors.paymentAmount = "Payment amount is required";
    }

    if (!values.paymentMethod) {
        errors.paymentMethod = "Please select a payment method";
    }

    if (values.paymentMethod === "CARD") {
        if (!values.cardHolderName) {
            errors.cardHolderName = "Pleas enter card holder name";
        }

        if (!values.cardNumber) {
            errors.cardNumber = "Card number is required";
        }

        if (!values.expiryDate) {
            errors.expiryDate = "Expiry date is required";
        }

        if (!values.cvvNo) {
            errors.cvvNo = "CVV number is required";
        }
    }

    return errors;
};

export { validate, paymentFormValidation };
