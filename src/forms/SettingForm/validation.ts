import * as Yup from 'yup';

export const settingValidationSchema = Yup.object().shape({
  siteTitle: Yup.string().required('Site title is required'),
  siteDescription: Yup.string().required('Site description is required'),
  logo: Yup.mixed().test('fileType', 'Only image files are allowed', (value) => {
    if (!value) return true; // Optional
    if (value instanceof File) {
      return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'].includes(
        value.type
      );
    }
    return true;
  }),
  address: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email('Invalid email format'),
  socialLinks: Yup.array().of(
    Yup.object().shape({
      platform: Yup.string().required('Platform name is required'),
      url: Yup.string().required('URL is required').url('Must be a valid URL'),
      icon: Yup.string().required('Icon is required'),
    })
  ),
});
