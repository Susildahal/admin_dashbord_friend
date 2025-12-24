import * as Yup from 'yup';

export const servicesValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.mixed()
    .required('Image is required')
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type);
      }
      return false;
    }),
  link: Yup.string()
    .required('Link is required')
    .matches(/^[a-z0-9-]+$/, 'Link must be a valid URL slug (lowercase letters, numbers, and hyphens only)'),
  demands: Yup.array()
    .of(Yup.string().required('Demand is required'))
    .min(1, 'At least one demand is required')
    .required('Demands are required'),
  demandText: Yup.string(),
  references: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('Reference label is required'),
      link: Yup.string()
        .required('Reference link is required')
        .url('Must be a valid URL'),
    })
  ),
  details: Yup.object().shape({
    intro: Yup.string(),
    sections: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required('Section key is required'),
        title: Yup.string(),
        text: Yup.string(),
        list: Yup.array().of(Yup.string()),
      })
    ),
  }),
});
