import * as Yup from 'yup';

export const contactValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters'),
});
