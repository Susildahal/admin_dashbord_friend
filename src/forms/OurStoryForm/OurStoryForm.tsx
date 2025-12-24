import { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { OurStoryFormData } from '@/types/forms';
import { ourStoryValidationSchema } from './validation';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import client from '@/config/sanity';

const OurStoryForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: OurStoryFormData = {
    sections: [
      {
        title: '',
        content: [''],
        points: [],
        ending: '',
        subTitle: '',
        subPoints: [],
      },
    ],
  };

  const handleSubmit = async (values: OurStoryFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/our-story', values);
      
      toast({
        title: 'Success!',
        description: 'Our Story has been saved successfully.',
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
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Our Story</CardTitle>
        <CardDescription>Create and manage story sections with dynamic content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={ourStoryValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => (
            <Form className="space-y-6">
              <FieldArray name="sections">
                {({ push: pushSection, remove: removeSection }) => (
                  <div className="space-y-6">
                    {values.sections.map((section, sectionIndex) => (
                      <Card key={sectionIndex} className="border-2">
                        <CardHeader className="bg-muted/50">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Section #{sectionIndex + 1}</CardTitle>
                            {values.sections.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSection(sectionIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                          {/* Section Title */}
                          <div className="space-y-2">
                            <Label htmlFor={`sections.${sectionIndex}.title`}>
                              Section Title <span className="text-red-500">*</span>
                            </Label>
                            <Field
                              as={Input}
                              name={`sections.${sectionIndex}.title`}
                              placeholder="Enter section title"
                            />
                            <ErrorMessage
                              name={`sections.${sectionIndex}.title`}
                              component="p"
                              className="text-sm text-red-500"
                            />
                          </div>

                          {/* Content Array */}
                          <div className="space-y-3">
                            <Label>
                              Content <span className="text-red-500">*</span>
                            </Label>
                            <FieldArray name={`sections.${sectionIndex}.content`}>
                              {({ push: pushContent, remove: removeContent }) => (
                                <div className="space-y-2">
                                  {section.content.map((_, contentIndex) => (
                                    <div key={contentIndex} className="flex gap-2">
                                      <Field
                                        as={Textarea}
                                        name={`sections.${sectionIndex}.content.${contentIndex}`}
                                        placeholder="Enter content paragraph"
                                        rows={3}
                                        className="flex-1"
                                      />
                                      {section.content.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeContent(contentIndex)}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <ErrorMessage
                                    name={`sections.${sectionIndex}.content`}
                                    component="p"
                                    className="text-sm text-red-500"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => pushContent('')}
                                  >
                                    <Plus className="mr-2 h-3 w-3" />
                                    Add Content Paragraph
                                  </Button>
                                </div>
                              )}
                            </FieldArray>
                          </div>

                          <Separator />

                          {/* Points Array */}
                          <div className="space-y-3">
                            <Label>Points (Optional)</Label>
                            <FieldArray name={`sections.${sectionIndex}.points`}>
                              {({ push: pushPoint, remove: removePoint }) => (
                                <div className="space-y-2">
                                  {section.points?.map((_, pointIndex) => (
                                    <div key={pointIndex} className="flex gap-2">
                                      <Field
                                        as={Input}
                                        name={`sections.${sectionIndex}.points.${pointIndex}`}
                                        placeholder="Enter point"
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removePoint(pointIndex)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => pushPoint('')}
                                  >
                                    <Plus className="mr-2 h-3 w-3" />
                                    Add Point
                                  </Button>
                                </div>
                              )}
                            </FieldArray>
                          </div>

                          {/* Ending */}
                          <div className="space-y-2">
                            <Label htmlFor={`sections.${sectionIndex}.ending`}>
                              Ending (Optional)
                            </Label>
                            <Field
                              as={Textarea}
                              name={`sections.${sectionIndex}.ending`}
                              placeholder="Enter ending text"
                              rows={3}
                            />
                          </div>

                          <Separator />

                          {/* SubTitle */}
                          <div className="space-y-2">
                            <Label htmlFor={`sections.${sectionIndex}.subTitle`}>
                              Sub Title (Optional)
                            </Label>
                            <Field
                              as={Input}
                              name={`sections.${sectionIndex}.subTitle`}
                              placeholder="Enter sub title"
                            />
                          </div>

                          {/* SubPoints Array */}
                          <div className="space-y-3">
                            <Label>Sub Points (Optional)</Label>
                            <FieldArray name={`sections.${sectionIndex}.subPoints`}>
                              {({ push: pushSubPoint, remove: removeSubPoint }) => (
                                <div className="space-y-2">
                                  {section.subPoints?.map((_, subPointIndex) => (
                                    <div key={subPointIndex} className="flex gap-2">
                                      <Field
                                        as={Input}
                                        name={`sections.${sectionIndex}.subPoints.${subPointIndex}`}
                                        placeholder="Enter sub point"
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeSubPoint(subPointIndex)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => pushSubPoint('')}
                                  >
                                    <Plus className="mr-2 h-3 w-3" />
                                    Add Sub Point
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
                      className="w-full"
                      onClick={() =>
                        pushSection({
                          title: '',
                          content: [''],
                          points: [],
                          ending: '',
                          subTitle: '',
                          subPoints: [],
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Section
                    </Button>
                  </div>
                )}
              </FieldArray>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Save Our Story'
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

export default OurStoryForm;
