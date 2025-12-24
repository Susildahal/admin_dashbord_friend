import * as Yup from 'yup';

export const bannerValidationSchema = Yup.object().shape({
  title: Yup.string(),
  subTitle: Yup.string(),
});
