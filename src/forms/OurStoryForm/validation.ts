import * as Yup from 'yup';

export const ourStoryValidationSchema = Yup.object().shape({
  sections: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required('Section title is required'),
        content: Yup.array()
          .of(Yup.string().required('Content item is required'))
          .min(1, 'At least one content item is required')
          .required('Content is required'),
        points: Yup.array().of(Yup.string()),
        ending: Yup.string(),
        subTitle: Yup.string(),
        subPoints: Yup.array().of(Yup.string()),
      })
    )
    .min(1, 'At least one section is required')
    .required('Sections are required'),
});
