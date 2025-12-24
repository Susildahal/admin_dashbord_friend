import { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { ServicesFormData } from '@/types/forms';
import { servicesValidationSchema } from './validation';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ServicesForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const initialValues: ServicesFormData = {
    title: '',
    description: '',
    image: null,
    link: '',
    demands: [''],
    demandText: '',
    references: [],
    details: {
      intro: '',
      sections: [],
    },
  };

  const handleSubmit = async (values: ServicesFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      formData.append('title', values.title);
      formData.append('description', values.description);
      if (values.image) {
        formData.append('image', values.image);
      }
      formData.append('link', values.link);
      formData.append('demands', JSON.stringify(values.demands));
      if (values.demandText) {
        formData.append('demandText', values.demandText);
      }
      if (values.references && values.references.length > 0) {
        formData.append('references', JSON.stringify(values.references));
      }
      if (values.details) {
        formData.append('details', JSON.stringify(values.details));
      }

      const response = await axiosInstance.post('/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast({
        title: 'Success!',
        description: 'Service has been created successfully.',
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
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Services Management</CardTitle>
        <CardDescription>Create and manage service offerings with detailed information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={servicesValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="demands">Demands & References</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Field as={Input} name="title" placeholder="Enter service title" />
                    <ErrorMessage name="title" component="p" className="text-sm text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Textarea}
                      name="description"
                      placeholder="Enter service description"
                      rows={4}
                    />
                    <ErrorMessage name="description" component="p" className="text-sm text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">
                      URL Slug <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      name="link"
                      placeholder="e.g., web-development"
                    />
                    <ErrorMessage name="link" component="p" className="text-sm text-red-500" />
                    <p className="text-sm text-muted-foreground">
                      Use lowercase letters, numbers, and hyphens only
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Service Image <span className="text-red-500">*</span>
                    </Label>
                    {imagePreview ? (
                      <div className="relative w-full h-64 border rounded-lg overflow-hidden">
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
                      </div>
                    )}
                    <ErrorMessage name="image" component="p" className="text-sm text-red-500" />
                  </div>
                </TabsContent>

                {/* Demands & References Tab */}
                <TabsContent value="demands" className="space-y-6 mt-6">
                  {/* Demands */}
                  <div className="space-y-3">
                    <Label>
                      Demands <span className="text-red-500">*</span>
                    </Label>
                    <FieldArray name="demands">
                      {({ push, remove }) => (
                        <div className="space-y-2">
                          {values.demands.map((_, index) => (
                            <div key={index} className="flex gap-2">
                              <Field
                                as={Input}
                                name={`demands.${index}`}
                                placeholder="Enter demand"
                                className="flex-1"
                              />
                              {values.demands.length > 1 && (
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
                          ))}
                          <ErrorMessage name="demands" component="p" className="text-sm text-red-500" />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => push('')}
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            Add Demand
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demandText">Demand Text (Optional)</Label>
                    <Field
                      as={Textarea}
                      name="demandText"
                      placeholder="Enter additional demand information"
                      rows={3}
                    />
                  </div>

                  <Separator />

                  {/* References */}
                  <div className="space-y-3">
                    <Label>References (Optional)</Label>
                    <FieldArray name="references">
                      {({ push, remove }) => (
                        <div className="space-y-3">
                          {values.references?.map((_, index) => (
                            <Card key={index}>
                              <CardContent className="pt-6 space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-medium">Reference #{index + 1}</p>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`references.${index}.label`}>Label</Label>
                                  <Field
                                    as={Input}
                                    name={`references.${index}.label`}
                                    placeholder="e.g., Official Documentation"
                                  />
                                  <ErrorMessage
                                    name={`references.${index}.label`}
                                    component="p"
                                    className="text-sm text-red-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`references.${index}.link`}>URL</Label>
                                  <Field
                                    as={Input}
                                    name={`references.${index}.link`}
                                    placeholder="https://example.com"
                                  />
                                  <ErrorMessage
                                    name={`references.${index}.link`}
                                    component="p"
                                    className="text-sm text-red-500"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => push({ label: '', link: '' })}
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            Add Reference
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="details.intro">Introduction (Optional)</Label>
                    <Field
                      as={Textarea}
                      name="details.intro"
                      placeholder="Enter introduction text"
                      rows={4}
                    />
                  </div>

                  <Separator />

                  {/* Detail Sections */}
                  <div className="space-y-3">
                    <Label>Detail Sections (Optional)</Label>
                    <FieldArray name="details.sections">
                      {({ push, remove }) => (
                        <div className="space-y-4">
                          {values.details?.sections.map((section, index) => (
                            <Card key={index}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">Section #{index + 1}</CardTitle>
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
                                  <Label htmlFor={`details.sections.${index}.key`}>
                                    Key <span className="text-red-500">*</span>
                                  </Label>
                                  <Field
                                    as={Input}
                                    name={`details.sections.${index}.key`}
                                    placeholder="unique-key"
                                  />
                                  <ErrorMessage
                                    name={`details.sections.${index}.key`}
                                    component="p"
                                    className="text-sm text-red-500"
                                  />
                                  <p className="text-sm text-muted-foreground">Must be unique</p>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`details.sections.${index}.title`}>
                                    Title (Optional)
                                  </Label>
                                  <Field
                                    as={Input}
                                    name={`details.sections.${index}.title`}
                                    placeholder="Section title"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`details.sections.${index}.text`}>
                                    Text (Optional)
                                  </Label>
                                  <Field
                                    as={Textarea}
                                    name={`details.sections.${index}.text`}
                                    placeholder="Section text"
                                    rows={3}
                                  />
                                </div>

                                {/* List items */}
                                <div className="space-y-2">
                                  <Label>List Items (Optional)</Label>
                                  <FieldArray name={`details.sections.${index}.list`}>
                                    {({ push: pushList, remove: removeList }) => (
                                      <div className="space-y-2">
                                        {section.list?.map((_, listIndex) => (
                                          <div key={listIndex} className="flex gap-2">
                                            <Field
                                              as={Input}
                                              name={`details.sections.${index}.list.${listIndex}`}
                                              placeholder="List item"
                                              className="flex-1"
                                            />
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removeList(listIndex)}
                                            >
                                              <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                          </div>
                                        ))}
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => pushList('')}
                                        >
                                          <Plus className="mr-2 h-3 w-3" />
                                          Add List Item
                                        </Button>
                                      </div>
                                    )}
                                  </FieldArray>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              push({ key: '', title: '', text: '', list: [] })
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Detail Section
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Submit Buttons */}
              <div className="flex gap-4 mt-6">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Create Service'
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

export default ServicesForm;
