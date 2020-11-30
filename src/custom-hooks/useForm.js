import { useState, useEffect } from "react";

//Custom hook to handle forms and field values
const useForm = (callback, validate) => {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback();
        }
    }, [errors]);

    useEffect(() => {
        if (Object.keys(errors).length) {
            setErrors(validate(values));
        }
    }, [values]);

    const setFieldValues = (fieldName, fieldValue) => {
        setValues((values) => ({ ...values, [fieldName]: fieldValue }));
    };

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);
    };

    const handleChange = (event) => {
        event.persist();
        setIsSubmitting(false);
        setValues((values) => ({
            ...values,
            [event.target.name]: event.target.value
        }));
    };

    return {
        handleChange,
        handleSubmit,
        values,
        setFieldValues,
        errors
    };
};

export default useForm;
