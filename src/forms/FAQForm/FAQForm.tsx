import { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { FAQFormData } from '@/types/forms';
import { faqValidationSchema } from './validation';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import client from '@/config/sanity';
import imageUrlBuilder from '@sanity/image-url';

interface FAQDocument {
  _id: string;
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

const builder = imageUrlBuilder(client);

const urlFor = (source: any) => {
  return builder.image(source).url();
};

const FAQForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [faqData, setFaqData] = useState<FAQDocument | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialValues: FAQFormData = {
    image: null,
    faq: [{ question: '', answer: '' }],
  };

  // Fetch FAQ data from Sanity
  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        setIsLoading(true);
        const query = `*[_type == "faq"][0]`;
        const data = await client.fetch(query);

        if (data) {
          setFaqData(data);
          setIsEditMode(true);
          if (data.image?.asset) {
            const imageUrl = urlFor(data.image);
            setImagePreview(imageUrl);
          }
        } else {
          setIsEditMode(false);
        }
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch FAQ data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQData();
  }, [toast]);

  const getInitialFormValues = (): FAQFormData => {
    if (faqData) {
      return {
        image: null,
        faq: faqData.faq || [{ question: '', answer: '' }],
      };
    }
    return initialValues;
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setNewImageFile(file);
      setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (setFieldValue: any) => {
    setFieldValue('image', null);
    setNewImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (values: FAQFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && faqData) {
        // Update existing FAQ
        await updateFAQ(values);
      } else {
        // Create new FAQ
        await createFAQ(values);
      }

      toast({
        title: 'Success!',
        description: isEditMode
          ? 'FAQ has been updated successfully.'
          : 'FAQ has been created successfully.',
        variant: 'default',
      });

      // Refresh data
      const query = `*[_type == "faq"][0]`;
      const updatedData = await client.fetch(query);
      setFaqData(updatedData);
      setIsEditMode(true);

      if (!isEditMode) {
        resetForm();
        setImagePreview(null);
        setNewImageFile(null);
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

  const createFAQ = async (values: FAQFormData) => {
    const faqPayload: any = {
      _type: 'faq',
      faq: values.faq,
    };

    if (newImageFile) {
      const asset = await client.assets.upload('image', newImageFile);
      faqPayload.image = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      };
    }

    await client.create(faqPayload);
  };

  const updateFAQ = async (values: FAQFormData) => {
    if (!faqData) return;

    const updatePayload: any = {
      faq: values.faq,
    };

    if (newImageFile) {
      const asset = await client.assets.upload('image', newImageFile);
      updatePayload.image = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      };
    }

    await client
      .patch(faqData._id)
      .set(updatePayload)
      .commit();
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>FAQ Management</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update' : 'Create'} frequently asked questions with an image.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={getInitialFormValues()}
          validationSchema={faqValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  FAQ Image <span className="text-red-500">*</span>
                </Label>
                {imagePreview ? (
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(setFieldValue)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <Label
                      htmlFor="image"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                    >
                      Click to upload or drag and drop
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                )}
                <ErrorMessage name="image" component="p" className="text-sm text-red-500" />
              </div>

              {/* FAQ Array */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    FAQ Items <span className="text-red-500">*</span>
                  </Label>
                  {typeof errors.faq === 'string' && (
                    <p className="text-sm text-red-500">{errors.faq}</p>
                  )}
                </div>

                <FieldArray name="faq">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.faq.map((_, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">FAQ #{index + 1}</CardTitle>
                              {values.faq.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`faq.${index}.question`}>Question</Label>
                              <Field
                                as={Input}
                                name={`faq.${index}.question`}
                                placeholder="Enter your question"
                                className={
                                  errors.faq?.[index] &&
                                  touched.faq?.[index] &&
                                  (errors.faq[index] as any)?.question
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                              <ErrorMessage
                                name={`faq.${index}.question`}
                                component="p"
                                className="text-sm text-red-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`faq.${index}.answer`}>Answer</Label>
                              <Field
                                as={Textarea}
                                name={`faq.${index}.answer`}
                                placeholder="Enter your answer (minimum 20 characters)"
                                rows={4}
                                className={
                                  errors.faq?.[index] &&
                                  touched.faq?.[index] &&
                                  (errors.faq[index] as any)?.answer
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                              <ErrorMessage
                                name={`faq.${index}.answer`}
                                component="p"
                                className="text-sm text-red-500"
                              />
                              <p className="text-sm text-muted-foreground">
                                {values.faq[index]?.answer?.length || 0} / 20 minimum characters
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => push({ question: '', answer: '' })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add FAQ
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditMode ? 'Update FAQ' : 'Create FAQ'
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

export default FAQForm;