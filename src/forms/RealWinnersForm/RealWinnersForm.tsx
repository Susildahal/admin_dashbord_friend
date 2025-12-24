import { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { RealWinnersFormData } from '@/types/forms';
import { realWinnersValidationSchema } from './validation';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import * as Icons from 'react-icons/fa';

// Available icons for selection
const availableIcons = [
  { value: 'FaTrophy', label: 'Trophy', icon: Icons.FaTrophy },
  { value: 'FaMedal', label: 'Medal', icon: Icons.FaMedal },
  { value: 'FaStar', label: 'Star', icon: Icons.FaStar },
  { value: 'FaCrown', label: 'Crown', icon: Icons.FaCrown },
  { value: 'FaAward', label: 'Award', icon: Icons.FaAward },
  { value: 'FaHeart', label: 'Heart', icon: Icons.FaHeart },
  { value: 'FaThumbsUp', label: 'Thumbs Up', icon: Icons.FaThumbsUp },
  { value: 'FaCheck', label: 'Check', icon: Icons.FaCheck },
  { value: 'FaCheckCircle', label: 'Check Circle', icon: Icons.FaCheckCircle },
  { value: 'FaGem', label: 'Gem', icon: Icons.FaGem },
];

const RealWinnersForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: RealWinnersFormData = {
    sectionTitle: '',
    sectionDescription: '',
    winnersList: [
      {
        icon: '',
        title: '',
        description: '',
      },
    ],
  };

  const handleSubmit = async (values: RealWinnersFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/real-winners', values);
      
      toast({
        title: 'Success!',
        description: 'Real Winners section has been created successfully.',
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

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find((i) => i.value === iconName);
    if (iconData) {
      const IconComponent = iconData.icon;
      return <IconComponent className="h-5 w-5" />;
    }
    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Real Winners</CardTitle>
        <CardDescription>Create and manage the Real Winners section with icons.</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={realWinnersValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Section Title */}
              <div className="space-y-2">
                <Label htmlFor="sectionTitle">
                  Section Title <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  name="sectionTitle"
                  placeholder="Enter section title"
                  className={errors.sectionTitle && touched.sectionTitle ? 'border-red-500' : ''}
                />
                <ErrorMessage name="sectionTitle" component="p" className="text-sm text-red-500" />
              </div>

              {/* Section Description */}
              <div className="space-y-2">
                <Label htmlFor="sectionDescription">
                  Section Description <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Textarea}
                  name="sectionDescription"
                  placeholder="Enter section description"
                  rows={4}
                  className={
                    errors.sectionDescription && touched.sectionDescription ? 'border-red-500' : ''
                  }
                />
                <ErrorMessage
                  name="sectionDescription"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Winners List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    Winners List <span className="text-red-500">*</span>
                  </Label>
                  {typeof errors.winnersList === 'string' && (
                    <p className="text-sm text-red-500">{errors.winnersList}</p>
                  )}
                </div>

                <FieldArray name="winnersList">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.winnersList.map((winner, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base flex items-center gap-2">
                                {winner.icon && getIconComponent(winner.icon)}
                                Winner #{index + 1}
                              </CardTitle>
                              {values.winnersList.length > 1 && (
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
                            {/* Icon Selector */}
                            <div className="space-y-2">
                              <Label htmlFor={`winnersList.${index}.icon`}>
                                Icon <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={winner.icon}
                                onValueChange={(value) =>
                                  setFieldValue(`winnersList.${index}.icon`, value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an icon">
                                    {winner.icon && (
                                      <div className="flex items-center gap-2">
                                        {getIconComponent(winner.icon)}
                                        {availableIcons.find((i) => i.value === winner.icon)?.label}
                                      </div>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {availableIcons.map((iconOption) => {
                                    const IconComp = iconOption.icon;
                                    return (
                                      <SelectItem key={iconOption.value} value={iconOption.value}>
                                        <div className="flex items-center gap-2">
                                          <IconComp className="h-4 w-4" />
                                          {iconOption.label}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <ErrorMessage
                                name={`winnersList.${index}.icon`}
                                component="p"
                                className="text-sm text-red-500"
                              />
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                              <Label htmlFor={`winnersList.${index}.title`}>
                                Title <span className="text-red-500">*</span>
                              </Label>
                              <Field
                                as={Input}
                                name={`winnersList.${index}.title`}
                                placeholder="Enter winner title"
                              />
                              <ErrorMessage
                                name={`winnersList.${index}.title`}
                                component="p"
                                className="text-sm text-red-500"
                              />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                              <Label htmlFor={`winnersList.${index}.description`}>
                                Description <span className="text-red-500">*</span>
                              </Label>
                              <Field
                                as={Textarea}
                                name={`winnersList.${index}.description`}
                                placeholder="Enter winner description (max 500 characters)"
                                rows={4}
                              />
                              <ErrorMessage
                                name={`winnersList.${index}.description`}
                                component="p"
                                className="text-sm text-red-500"
                              />
                              <p className="text-sm text-muted-foreground">
                                {winner.description?.length || 0} / 500 characters
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => push({ icon: '', title: '', description: '' })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Winner
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
                    'Submit Real Winners'
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

export default RealWinnersForm;
