import * as Yup from 'yup';

export const signUpValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Enter a valid email')
        .required('Email is required'),
});
