import { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { UnitedVoicesFormData } from '@/types/forms';
import { unitedVoicesValidationSchema } from './validation';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const UnitedVoicesForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);

  const initialValues: UnitedVoicesFormData = {
    title: '',
    subTitle: '',
    description: '',
    frontimage: null,
    backimage: null,
    voices: [],
  };

  const handleSubmit = async (values: UnitedVoicesFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      if (values.title) formData.append('title', values.title);
      if (values.subTitle) formData.append('subTitle', values.subTitle);
      if (values.description) formData.append('description', values.description);
      
      if (values.frontimage) {
        formData.append('frontimage', values.frontimage);
      }
      if (values.backimage) {
        formData.append('backimage', values.backimage);
      }
      
      if (values.voices && values.voices.length > 0) {
        formData.append('voices', JSON.stringify(values.voices));
      }

      const response = await axiosInstance.post('/united-voices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast({
        title: 'Success!',
        description: 'United Voices section has been created successfully.',
        variant: 'default',
      });
      
      resetForm();
      setFrontImagePreview(null);
      setBackImagePreview(null);
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
    setFieldValue: any,
    fieldName: string,
    setPreview: (preview: string | null) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Image must be less than 2MB',
          variant: 'destructive',
        });
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Only JPEG and PNG files are allowed',
          variant: 'destructive',
        });
        return;
      }

      setFieldValue(fieldName, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (
    setFieldValue: any,
    fieldName: string,
    setPreview: (preview: string | null) => void
  ) => {
    setFieldValue(fieldName, null);
    setPreview(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>United Voices</CardTitle>
        <CardDescription>Create and manage the United Voices section with images and voice items.</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={unitedVoicesValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Field as={Input} name="title" placeholder="Enter title" />
              </div>

              {/* Sub Title */}
              <div className="space-y-2">
                <Label htmlFor="subTitle">Sub Title (Optional)</Label>
                <Field as={Input} name="subTitle" placeholder="Enter sub title" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Field
                  as={Textarea}
                  name="description"
                  placeholder="Enter description"
                  rows={4}
                />
              </div>

              <Separator />

              {/* Front Image */}
              <div className="space-y-2">
                <Label htmlFor="frontimage">
                  Front Image <span className="text-red-500">*</span>
                </Label>
                {frontImagePreview ? (
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                    <img
                      src={frontImagePreview}
                      alt="Front Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        removeImage(setFieldValue, 'frontimage', setFrontImagePreview)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {values.frontimage instanceof File && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {formatFileSize(values.frontimage.size)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <Label
                      htmlFor="frontimage"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                    >
                      Click to upload front image
                      <Input
                        id="frontimage"
                        name="frontimage"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setFieldValue,
                            'frontimage',
                            setFrontImagePreview
                          )
                        }
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPEG or PNG only, max 2MB
                    </p>
                  </div>
                )}
                <ErrorMessage name="frontimage" component="p" className="text-sm text-red-500" />
              </div>

              {/* Back Image */}
              <div className="space-y-2">
                <Label htmlFor="backimage">
                  Back Image <span className="text-red-500">*</span>
                </Label>
                {backImagePreview ? (
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                    <img
                      src={backImagePreview}
                      alt="Back Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        removeImage(setFieldValue, 'backimage', setBackImagePreview)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {values.backimage instanceof File && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {formatFileSize(values.backimage.size)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <Label
                      htmlFor="backimage"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                    >
                      Click to upload back image
                      <Input
                        id="backimage"
                        name="backimage"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(e, setFieldValue, 'backimage', setBackImagePreview)
                        }
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPEG or PNG only, max 2MB
                    </p>
                  </div>
                )}
                <ErrorMessage name="backimage" component="p" className="text-sm text-red-500" />
              </div>

              <Separator />

              {/* Voices Array */}
              <div className="space-y-4">
                <Label>Voices (Optional)</Label>

                <FieldArray name="voices">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.voices?.map((_, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Voice #{index + 1}</CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`voices.${index}.heading`}>Heading</Label>
                              <Field
                                as={Input}
                                name={`voices.${index}.heading`}
                                placeholder="Enter heading"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`voices.${index}.subHeading`}>Sub Heading</Label>
                              <Field
                                as={Input}
                                name={`voices.${index}.subHeading`}
                                placeholder="Enter sub heading"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => push({ heading: '', subHeading: '' })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Voice
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
                    'Submit United Voices'
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

export default UnitedVoicesForm;
