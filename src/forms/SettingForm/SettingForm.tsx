import { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { SettingFormData } from '@/types/forms';
import { settingValidationSchema } from './validation';
import client from '../../config/sanity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import * as Icons from 'react-icons/fa';

const socialIcons = [
  { value: 'FaFacebook', label: 'Facebook', icon: Icons.FaFacebook },
  { value: 'FaTwitter', label: 'Twitter', icon: Icons.FaTwitter },
  { value: 'FaInstagram', label: 'Instagram', icon: Icons.FaInstagram },
  { value: 'FaLinkedin', label: 'LinkedIn', icon: Icons.FaLinkedin },
  { value: 'FaYoutube', label: 'YouTube', icon: Icons.FaYoutube },
  { value: 'FaWhatsapp', label: 'WhatsApp', icon: Icons.FaWhatsapp },
  { value: 'FaTiktok', label: 'TikTok', icon: Icons.FaTiktok },
  { value: 'FaGithub', label: 'GitHub', icon: Icons.FaGithub },
  { value: 'FaPinterest', label: 'Pinterest', icon: Icons.FaPinterest },
  { value: 'FaReddit', label: 'Reddit', icon: Icons.FaReddit },
];

const getSanityImageUrl = (ref: string) => {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const dataset = import.meta.env.VITE_SANITY_DATASET;
  const parts = ref.split('-');
  const sha1 = parts[1];
  const dimensions = parts[2];
  const extension = parts[3];
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${sha1}-${dimensions}.${extension}`;
};

// Add a type guard for Sanity image object
function isSanityImage(obj: any): obj is { _type: string; asset: { _type: string; _ref: string } } {
  return obj && typeof obj === 'object' && obj._type === 'image' && obj.asset && obj.asset._type === 'reference' && typeof obj.asset._ref === 'string';
}

const SettingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoAssetRef, setLogoAssetRef] = useState<string | null>(null);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [initialValues, setInitialValues] = useState<SettingFormData>({
    siteTitle: '',
    siteDescription: '',
    logo: null,
    address: '',
    phone: '',
    email: '',
    socialLinks: [],
  });

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const data = await client.fetch(
          '*[_type == "setting"][0] { _id, siteTitle, siteDescription, logo, address, phone, email, socialLinks }'
        );
        if (data && data._id) {
          setSettingId(data._id);
          setInitialValues({
            siteTitle: data.siteTitle || '',
            siteDescription: data.siteDescription || '',
            logo: data.logo?.asset?._ref || null,
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.map(link => ({
              platform: link.platform || '',
              url: link.url || '',
              icon: link.icon || '',
            })) : [],
          });
          if (data.logo?.asset?._ref) {
            setLogoAssetRef(data.logo.asset._ref);
            setLogoPreview(getSanityImageUrl(data.logo.asset._ref));
          } else {
            setLogoPreview(null);
            setLogoAssetRef(null);
          }
        } else {
          setSettingId(null);
          setInitialValues({
            siteTitle: '',
            siteDescription: '',
            logo: null,
            address: '',
            phone: '',
            email: '',
            socialLinks: [],
          });
          setLogoPreview(null);
          setLogoAssetRef(null);
        }
      } catch (error) {
        setSettingId(null);
        setInitialValues({
          siteTitle: '',
          siteDescription: '',
          logo: null,
          address: '',
          phone: '',
          email: '',
          socialLinks: [],
        });
        setLogoPreview(null);
        setLogoAssetRef(null);
      } finally {
        setInitialLoaded(true);
      }
    };
    fetchSetting();
  }, []);

  const uploadLogoToSanity = async (file: File) => {
    try {
      const asset = await client.assets.upload('image', file, {
        filename: file.name,
      });
      return asset._id;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image to Sanity');
    }
  };

  const handleSubmit = async (values: SettingFormData, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      let finalValues = { ...values };
      // Upload logo if it's a new file
      if (values.logo instanceof File) {
        const assetId = await uploadLogoToSanity(values.logo);
        finalValues.logo = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: assetId,
          },
        };
      } else if (isSanityImage(values.logo)) {
        // Keep existing logo reference
        finalValues.logo = values.logo;
      } else if (logoAssetRef) {
        finalValues.logo = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: logoAssetRef,
          },
        };
      } else {
        finalValues.logo = null;
      }

      let result;
      if (!settingId) {
        result = await client.create({
          _type: 'setting',
          ...finalValues,
        });
        setSettingId(result._id);
      } else {
        result = await client.patch(settingId).set(finalValues).commit();
      }

      toast({
        title: 'Success!',
        description: 'Settings have been saved successfully.',
        variant: 'default',
      });
      resetForm();
      console.log('Sanity Response:', result);
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

  const handleLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue('logo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (setFieldValue: any) => {
    setFieldValue('logo', null);
    setLogoPreview(null);
    setLogoAssetRef(null);
  };

  const getIconComponent = (iconName: string) => {
    const iconData = socialIcons.find((i) => i.value === iconName);
    if (iconData) {
      const IconComponent = iconData.icon;
      return <IconComponent className="h-5 w-5" />;
    }
    return null;
  };

  return (
    <div>
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Configure your website's general settings and social media links.</CardDescription>
      </CardHeader>
      <CardContent>
        {initialLoaded && (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={settingValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Site Title */}
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">
                    Site Title <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Input}
                    name="siteTitle"
                    placeholder="My Awesome Website"
                    className={errors.siteTitle && touched.siteTitle ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="siteTitle" component="p" className="text-sm text-red-500" />
                </div>

                {/* Site Description */}
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">
                    Site Description <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Textarea}
                    name="siteDescription"
                    placeholder="Enter your site description..."
                    rows={4}
                    className={
                      errors.siteDescription && touched.siteDescription ? 'border-red-500' : ''
                    }
                  />
                  <ErrorMessage name="siteDescription" component="p" className="text-sm text-red-500" />
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo (Optional)</Label>
                  {logoPreview ? (
                    <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-contain bg-muted"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeLogo(setFieldValue)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <Label
                        htmlFor="logo"
                        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                      >
                        Click to upload logo
                        <Input
                          id="logo"
                          name="logo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoChange(e, setFieldValue)}
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, SVG up to 5MB
                      </p>
                    </div>
                  )}
                  <ErrorMessage name="logo" component="p" className="text-sm text-red-500" />
                </div>

                {logoPreview && (
                  <div className="mb-2">
                    <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain" />
                  </div>
                )}

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Field
                      as={Input}
                      name="address"
                      placeholder="123 Main Street, City, Country"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Field
                        as={Input}
                        name="phone"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Field
                        as={Input}
                        name="email"
                        type="email"
                        placeholder="contact@example.com"
                        className={errors.email && touched.email ? 'border-red-500' : ''}
                      />
                      <ErrorMessage name="email" component="p" className="text-sm text-red-500" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                  </div>

                  <FieldArray name="socialLinks">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.socialLinks?.map((link, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6 space-y-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium flex items-center gap-2">
                                  {link.icon && getIconComponent(link.icon)}
                                  Social Link #{index + 1}
                                </p>
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
                                <Label htmlFor={`socialLinks.${index}.platform`}>
                                  Platform <span className="text-red-500">*</span>
                                </Label>
                                <Field
                                  as={Input}
                                  name={`socialLinks.${index}.platform`}
                                  placeholder="e.g., Facebook"
                                />
                                <ErrorMessage
                                  name={`socialLinks.${index}.platform`}
                                  component="p"
                                  className="text-sm text-red-500"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`socialLinks.${index}.icon`}>
                                  Icon <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={link.icon}
                                  onValueChange={(value) =>
                                    setFieldValue(`socialLinks.${index}.icon`, value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an icon">
                                      {link.icon && (
                                        <div className="flex items-center gap-2">
                                          {getIconComponent(link.icon)}
                                          {socialIcons.find((i) => i.value === link.icon)?.label}
                                        </div>
                                      )}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {socialIcons.map((iconOption) => {
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
                                  name={`socialLinks.${index}.icon`}
                                  component="p"
                                  className="text-sm text-red-500"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`socialLinks.${index}.url`}>
                                  URL <span className="text-red-500">*</span>
                                </Label>
                                <Field
                                  as={Input}
                                  name={`socialLinks.${index}.url`}
                                  placeholder="https://facebook.com/yourpage"
                                />
                                <ErrorMessage
                                  name={`socialLinks.${index}.url`}
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
                          className="w-full"
                          onClick={() => push({ platform: '', url: '', icon: '' })}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Social Link
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Submit Buttons */}
                   <div className="fixed bottom-1 right-1">
                  <Button type="submit" disabled={isSubmitting} className="flex-1" variant="theme">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                
                </div>
              </Form>
            )}
          </Formik>
        )}
      </CardContent>
    </Card>
 
    </div>
  );
};

export default SettingForm;
