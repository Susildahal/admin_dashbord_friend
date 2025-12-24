import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { BannerFormData } from '@/types/forms';
import { bannerValidationSchema } from './validation';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const BannerForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: BannerFormData = {
    title: '',
    subTitle: '',
  };

  const handleSubmit = async (values: BannerFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/banner', values);
      
      toast({
        title: 'Success!',
        description: 'Banner has been saved successfully.',
        variant: 'default',
      });
      
      resetForm();
      console.log('Response:', response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Banner Settings</CardTitle>
        <CardDescription>Configure your banner title and subtitle.</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={bannerValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Field
                  as={Input}
                  id="title"
                  name="title"
                  placeholder="Enter banner title"
                  className={errors.title && touched.title ? 'border-red-500' : ''}
                />
                <ErrorMessage name="title" component="p" className="text-sm text-red-500" />
              </div>

              {/* Sub Title */}
              <div className="space-y-2">
                <Label htmlFor="subTitle">Sub Title (Optional)</Label>
                <Field
                  as={Input}
                  id="subTitle"
                  name="subTitle"
                  placeholder="Enter banner subtitle"
                  className={errors.subTitle && touched.subTitle ? 'border-red-500' : ''}
                />
                <ErrorMessage name="subTitle" component="p" className="text-sm text-red-500" />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Banner'
                  )}
                </Button>
                <Button type="reset" variant="outline" disabled={isSubmitting}>
                  Reset
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default BannerForm;
