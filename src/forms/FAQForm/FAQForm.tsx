import { useState } from 'react';
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

const FAQForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const initialValues: FAQFormData = {
    image: null,
    faq: [{ question: '', answer: '' }],
  };

  const handleSubmit = async (values: FAQFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      if (values.image) {
        formData.append('image', values.image);
      }
      
      formData.append('faq', JSON.stringify(values.faq));

      const response = await axiosInstance.post('/faq', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast({
        title: 'Success!',
        description: 'FAQ has been created successfully.',
        variant: 'default',
      });
      
      resetForm();
      setImagePreview(null);
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

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
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
    setImagePreview(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>FAQ Management</CardTitle>
        <CardDescription>Create and manage frequently asked questions with an image.</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={faqValidationSchema}
          onSubmit={handleSubmit}
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
                      Submitting...
                    </>
                  ) : (
                    'Submit FAQ'
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
