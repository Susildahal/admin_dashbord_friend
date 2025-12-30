import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from 'formik';
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
import client from '@/config/sanity';
import imageUrlBuilder from '@sanity/image-url';

interface VoiceItem {
  heading: string;
  subHeading: string;
}

interface RevivalData {
  title?: string;
  description?: string;
  pointList?: string[];
}

interface UnitedVoicesDocument {
  _id: string;
  title?: string;
  subTitle?: string;
  description?: string;
  frontimage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  backimage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  voices?: VoiceItem[];
  revival?: RevivalData;
}

interface UnitedVoicesFormDataWithRevival extends UnitedVoicesFormData {
  revival?: {
    title?: string;
    description?: string;
    pointList?: string[];
  };
}

const builder = imageUrlBuilder(client);

const urlFor = (source: any) => {
  return builder.image(source).url();
};

const UnitedVoicesForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [newFrontImage, setNewFrontImage] = useState<File | null>(null);
  const [newBackImage, setNewBackImage] = useState<File | null>(null);
  const [unitedVoicesData, setUnitedVoicesData] = useState<UnitedVoicesDocument | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const formikRef = useRef<any>(null);

  const initialValues: UnitedVoicesFormDataWithRevival = {
    title: '',
    subTitle: '',
    description: '',
    frontimage: null,
    backimage: null,
    voices: [],
    revival: {
      title: '',
      description: '',
      pointList: [],
    },
  };

  // Fetch United Voices data from Sanity
  useEffect(() => {
    const fetchUnitedVoicesData = async () => {
      try {
        setIsLoading(true);
        const query = `*[_type == "unitedVoices"][0]`;
        const data = await client.fetch(query);

        if (data) {
          setUnitedVoicesData(data);
          setIsEditMode(true);

          if (data.frontimage?.asset) {
            const imageUrl = urlFor(data.frontimage);
            setFrontImagePreview(imageUrl);
          }

          if (data.backimage?.asset) {
            const imageUrl = urlFor(data.backimage);
            setBackImagePreview(imageUrl);
          }
        } else {
          setIsEditMode(false);
        }
      } catch (error) {
        console.error('Error fetching United Voices data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch United Voices data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnitedVoicesData();
  }, [toast]);

  const getInitialFormValues = (): UnitedVoicesFormDataWithRevival => {
    if (unitedVoicesData) {
      return {
        title: unitedVoicesData.title || '',
        subTitle: unitedVoicesData.subTitle || '',
        description: unitedVoicesData.description || '',
        frontimage: null,
        backimage: null,
        voices: unitedVoicesData.voices || [],
        revival: {
          title: unitedVoicesData.revival?.title || '',
          description: unitedVoicesData.revival?.description || '',
          pointList: unitedVoicesData.revival?.pointList || [],
        },
      };
    }
    return initialValues;
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    fieldName: string,
    setPreview: (preview: string | null) => void,
    setNewImage: (file: File | null) => void
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
      setNewImage(file);
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
    setPreview: (preview: string | null) => void,
    setNewImage: (file: File | null) => void
  ) => {
    setFieldValue(fieldName, null);
    setNewImage(null);
    setPreview(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (values: UnitedVoicesFormDataWithRevival, { resetForm }: FormikHelpers<UnitedVoicesFormDataWithRevival>) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && unitedVoicesData) {
        // Update existing United Voices
        await updateUnitedVoices(values);
      } else {
        // Create new United Voices
        await createUnitedVoices(values);
      }

      toast({
        title: 'Success!',
        description: isEditMode
          ? 'United Voices section has been updated successfully.'
          : 'United Voices section has been created successfully.',
        variant: 'default',
      });

      // Refresh data
      const query = `*[_type == "unitedVoices"][0]`;
      const updatedData = await client.fetch(query);
      setUnitedVoicesData(updatedData);
      setIsEditMode(true);

      if (!isEditMode) {
        resetForm();
        setFrontImagePreview(null);
        setBackImagePreview(null);
        setNewFrontImage(null);
        setNewBackImage(null);
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

  const createUnitedVoices = async (values: UnitedVoicesFormDataWithRevival) => {
    const payload: any = {
      _type: 'unitedVoices',
      title: values.title || undefined,
      subTitle: values.subTitle || undefined,
      description: values.description || undefined,
      voices: values.voices || [],
    };

    // Add revival data if provided
    if (values.revival?.title || values.revival?.description || values.revival?.pointList?.length) {
      payload.revival = {
        title: values.revival.title || undefined,
        description: values.revival.description || undefined,
        pointList: values.revival.pointList?.filter(p => p.trim()) || [],
      };
    }

    if (newFrontImage) {
      const asset = await client.assets.upload('image', newFrontImage);
      payload.frontimage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      };
    }

    if (newBackImage) {
      const asset = await client.assets.upload('image', newBackImage);
      payload.backimage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      };
    }

    await client.create(payload);
  };

  const updateUnitedVoices = async (values: UnitedVoicesFormDataWithRevival) => {
    if (!unitedVoicesData) return;

    const updatePayload: any = {
      title: values.title || undefined,
      subTitle: values.subTitle || undefined,
      description: values.description || undefined,
      voices: values.voices || [],
    };

    // Add revival data if provided
    if (values.revival?.title || values.revival?.description || values.revival?.pointList?.length) {
      updatePayload.revival = {
        title: values.revival.title || undefined,
        description: values.revival.description || undefined,
        pointList: values.revival.pointList?.filter(p => p.trim()) || [],
      };
    }

    if (newFrontImage) {
      const asset = await client.assets.upload('image', newFrontImage);
      updatePayload.frontimage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      };
    }

    if (newBackImage) {
      const asset = await client.assets.upload('image', newBackImage);
      updatePayload.backimage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      };
    }

    await client.patch(unitedVoicesData._id).set(updatePayload).commit();
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
    <div  className='flex gap-1'>
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>United Voices</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update' : 'Create'} the United Voices section with images and voice items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          innerRef={formikRef}
          initialValues={getInitialFormValues()}
          validationSchema={unitedVoicesValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                        removeImage(setFieldValue, 'frontimage', setFrontImagePreview, setNewFrontImage)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {newFrontImage && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {formatFileSize(newFrontImage.size)}
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
                            setFrontImagePreview,
                            setNewFrontImage
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
                        removeImage(setFieldValue, 'backimage', setBackImagePreview, setNewBackImage)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {newBackImage && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {formatFileSize(newBackImage.size)}
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
                          handleImageChange(
                            e,
                            setFieldValue,
                            'backimage',
                            setBackImagePreview,
                            setNewBackImage
                          )
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

              <Separator />

              {/* Revival Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Revival Text (Optional)</Label>

                <div className="space-y-2">
                  <Label htmlFor="revival.title">Revival Title</Label>
                  <Field
                    as={Input}
                    name="revival.title"
                    placeholder="Enter revival title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revival.description">Revival Description</Label>
                  <Field
                    as={Textarea}
                    name="revival.description"
                    placeholder="Enter revival description"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Revival Point List</Label>
                  <FieldArray name="revival.pointList">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.revival?.pointList?.map((_, index) => (
                          <div key={index} className="flex gap-2 items-end">
                            <div className="flex-1 space-y-2">
                              <Label htmlFor={`revival.pointList.${index}`}>Point #{index + 1}</Label>
                              <Field
                                as={Input}
                                name={`revival.pointList.${index}`}
                                placeholder="Enter point"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => push('')}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Point
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
              <div className="fixed bottom-1 right-1">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  variant="theme"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditMode ? 'Update United Voices' : 'Create United Voices'
                  )}
                </Button>
              </div>

              {/* Submit Button */}
            
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
      
              </div>
  );
};

export default UnitedVoicesForm;