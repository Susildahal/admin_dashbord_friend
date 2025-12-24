import * as Yup from 'yup';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const unitedVoicesValidationSchema = Yup.object().shape({
  title: Yup.string(),
  subTitle: Yup.string(),
  description: Yup.string(),
  frontimage: Yup.mixed()
    .required('Front image is required')
    .test('fileType', 'Only JPEG and PNG files are allowed', (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
      }
      return false;
    })
    .test('fileSize', 'File size must not exceed 2MB', (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return value.size <= MAX_FILE_SIZE;
      }
      return false;
    }),
  backimage: Yup.mixed()
    .required('Back image is required')
    .test('fileType', 'Only JPEG and PNG files are allowed', (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
      }
      return false;
    })
    .test('fileSize', 'File size must not exceed 2MB', (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return value.size <= MAX_FILE_SIZE;
      }
      return false;
    }),
  voices: Yup.array().of(
    Yup.object().shape({
      heading: Yup.string(),
      subHeading: Yup.string(),
    })
  ),
});
