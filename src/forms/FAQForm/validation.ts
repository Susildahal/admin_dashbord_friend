import * as Yup from 'yup';

export const faqValidationSchema = Yup.object().shape({
  image: Yup.mixed()
    .required('Image is required')
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type);
      }
      return false;
    }),
  faq: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string().required('Question is required'),
        answer: Yup.string()
          .required('Answer is required')
          .min(20, 'Answer must be at least 20 characters'),
      })
    )
    .min(1, 'At least one FAQ is required')
    .required('FAQ list is required'),
});
