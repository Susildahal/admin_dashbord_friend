import * as Yup from 'yup';

export const realWinnersValidationSchema = Yup.object().shape({
  sectionTitle: Yup.string().required('Section title is required'),
  sectionDescription: Yup.string().required('Section description is required'),
  winnersList: Yup.array()
    .of(
      Yup.object().shape({
        icon: Yup.string().required('Icon is required'),
        title: Yup.string().required('Title is required'),
        description: Yup.string()
          .required('Description is required')
          .max(500, 'Description must not exceed 500 characters'),
      })
    )
    .min(1, 'At least one winner is required')
    .required('Winners list is required'),
});
