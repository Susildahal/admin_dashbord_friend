import { useState, useEffect } from 'react';
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
import client from '@/config/sanity';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules, quillFormats } from '@/lib/quillConfig';

interface BannerDocument {
  _id: string;
  title?: string;
  subTitle?: string;
}

const BannerForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerData, setBannerData] = useState<BannerDocument | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialValues: BannerFormData = {
    title: '',
    subTitle: '',
  };

  // Fetch Banner data from Sanity
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true);
        const query = `*[_type == "bannerData"][0]`;
        const data = await client.fetch(query);

        if (data) {
          setBannerData(data);
          setIsEditMode(true);
        } else {
          setIsEditMode(false);
        }
      } catch (error) {
        console.error('Error fetching Banner data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch Banner data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, [toast]);

  const getInitialFormValues = (): BannerFormData => {
    if (bannerData) {
      return {
        title: bannerData.title || '',
        subTitle: bannerData.subTitle || '',
      };
    }
    return initialValues;
  };

  const handleSubmit = async (values: BannerFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && bannerData) {
        // Update existing Banner
        await updateBanner(values);
      } else {
        // Create new Banner
        await createBanner(values);
      }

      toast({
        title: 'Success!',
        description: isEditMode
          ? 'Banner has been updated successfully.'
          : 'Banner has been created successfully.',
        variant: 'default',
      });

      // Refresh data
      const query = `*[_type == "bannerData"][0]`;
      const updatedData = await client.fetch(query);
      setBannerData(updatedData);
      setIsEditMode(true);

      if (!isEditMode) {
        resetForm();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createBanner = async (values: BannerFormData) => {
    const payload = {
      _type: 'bannerData',
      title: values.title || undefined,
      subTitle: values.subTitle || undefined,
    };

    await client.create(payload);
  };

  const updateBanner = async (values: BannerFormData) => {
    if (!bannerData) return;

    const updatePayload = {
      title: values.title || undefined,
      subTitle: values.subTitle || undefined,
    };

    await client.patch(bannerData._id).set(updatePayload).commit();
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Banner Settings</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update' : 'Configure'} your banner title and subtitle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={getInitialFormValues()}
          validationSchema={bannerValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue }) => (
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
            <ReactQuill
              id="subTitle"
              value={values.subTitle}
              placeholder="Enter banner subtitle"
              modules={quillModules}
              formats={quillFormats}
              onChange={(value) => setFieldValue('subTitle', value)}
            />
            <ErrorMessage name="subTitle" component="p" className="text-sm text-red-500" />
          </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1" variant="theme">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Banner' : 'Create Banner'
                  )}
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