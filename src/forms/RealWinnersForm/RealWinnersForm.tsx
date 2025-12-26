import { useState, useEffect } from 'react';
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
import { TiHome } from 'react-icons/ti';
import { MdElectricBolt } from 'react-icons/md';
import {
  GiCigarette,
  GiSprout,
} from 'react-icons/gi';
import {

  FaPrescriptionBottle,
  FaGasPump,
  FaBus,
  FaBook,
  FaWater,
  FaHeart,
  FaStar,
  FaUser,
  FaUsers,
  FaBell,
  FaGift,
  FaThumbsUp,
  FaRocket,
  FaLightbulb,
  FaGlobe,
  FaMusic,
  FaCamera,
  FaLeaf,
  FaMoon,
  FaSun,
  FaWrench,
  FaHammer,
  FaPuzzlePiece,
  FaBriefcase,
  FaCalendar,
  FaClock,
  FaMapPin,
  FaRecycle,
  FaBeer,
  FaWineGlass,
  FaTrophy,
  FaMedal,
  FaCrown,
  FaAward,
  FaCheck,
  FaCheckCircle,
  FaGem,
} from 'react-icons/fa';
import client from '@/config/sanity';

// Map of available icon components
const ICON_MAP: Record<string, any> = {
  TiHome,

  FaPrescriptionBottle,
  MdElectricBolt,
  FaGasPump,
  FaBus,
  FaBook,
  FaWater,
  GiCigarette,
  FaHeart,
  FaStar,
  FaUser,
  FaUsers,
  FaBell,
  FaGift,
  FaThumbsUp,
  FaRocket,
  FaLightbulb,
  FaGlobe,
  FaMusic,
  FaCamera,
  FaLeaf,
  FaMoon,
  FaSun,
  FaWrench,
  FaHammer,
  FaPuzzlePiece,
  FaBriefcase,
  FaCalendar,
  FaClock,
  FaMapPin,
  FaRecycle,
  FaBeer,
  FaWineGlass,
  GiSprout,
  FaTrophy,
  FaMedal,
  FaCrown,
  FaAward,
  FaCheck,
  FaCheckCircle,
  FaGem,
};

// Available icons for selection (uses ICON_MAP)
const availableIcons = Object.entries(ICON_MAP).map(([key, Comp]) => ({
  value: key,
  label: key.replace(/([A-Z])/g, ' $1').trim(),
  icon: Comp,
}));

interface WinnerItem {
  icon: string;
  title: string;
  description: string;
}

interface RealWinnersDocument {
  _id: string;
  sectionTitle: string;
  sectionDescription: string;
  winnersList: WinnerItem[];
}

const RealWinnersForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [realWinnersData, setRealWinnersData] = useState<RealWinnersDocument | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Fetch Real Winners data from Sanity
  useEffect(() => {
    const fetchRealWinnersData = async () => {
      try {
        setIsLoading(true);
        const query = `*[_type == "realWinners"][0]`;
        const data = await client.fetch(query);

        if (data) {
          setRealWinnersData(data);
          setIsEditMode(true);
        } else {
          setIsEditMode(false);
        }
      } catch (error) {
        console.error('Error fetching Real Winners data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch Real Winners data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealWinnersData();
  }, [toast]);

  const getInitialFormValues = (): RealWinnersFormData => {
    if (realWinnersData) {
      return {
        sectionTitle: realWinnersData.sectionTitle || '',
        sectionDescription: realWinnersData.sectionDescription || '',
        winnersList: realWinnersData.winnersList || [{ icon: '', title: '', description: '' }],
      };
    }
    return initialValues;
  };

  const handleSubmit = async (values: RealWinnersFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && realWinnersData) {
        // Update existing Real Winners
        await updateRealWinners(values);
      } else {
        // Create new Real Winners
        await createRealWinners(values);
      }

      toast({
        title: 'Success!',
        description: isEditMode
          ? 'Real Winners section has been updated successfully.'
          : 'Real Winners section has been created successfully.',
        variant: 'default',
      });

      // Refresh data
      const query = `*[_type == "realWinners"][0]`;
      const updatedData = await client.fetch(query);
      setRealWinnersData(updatedData);
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

  const createRealWinners = async (values: RealWinnersFormData) => {
    const payload = {
      _type: 'realWinners',
      sectionTitle: values.sectionTitle,
      sectionDescription: values.sectionDescription,
      winnersList: values.winnersList,
    };

    await client.create(payload);
  };

  const updateRealWinners = async (values: RealWinnersFormData) => {
    if (!realWinnersData) return;

    const updatePayload = {
      sectionTitle: values.sectionTitle,
      sectionDescription: values.sectionDescription,
      winnersList: values.winnersList,
    };

    await client
      .patch(realWinnersData._id)
      .set(updatePayload)
      .commit();
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find((i) => i.value === iconName);
    if (iconData) {
      const IconComponent = iconData.icon;
      return <IconComponent className="h-5 w-5" />;
    }
    return null;
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
    <div>
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Real Winners</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update' : 'Create'} the Real Winners section with icons.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={getInitialFormValues()}
          validationSchema={realWinnersValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                                value={winner.icon || ''}
                                onValueChange={(value) =>
                                  setFieldValue(`winnersList.${index}.icon`, value)
                                }
                              >
                                <SelectTrigger className={errors.winnersList?.[index] && touched.winnersList?.[index] && (errors.winnersList[index] as any)?.icon ? 'border-red-500' : ''}>
                                  <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80">
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
                              {winner.icon && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {getIconComponent(winner.icon)}
                                  <span>{availableIcons.find((i) => i.value === winner.icon)?.label}</span>
                                </div>
                              )}
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
                <Button type="submit" disabled={isSubmitting} className="flex-1" variant="theme">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Real Winners' : 'Create Real Winners'
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
    </div>
  );
};

export default RealWinnersForm;