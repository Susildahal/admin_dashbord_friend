import { useState } from 'react';
import {
  ContactForm,
  FAQForm,
  OurStoryForm,
  RealWinnersForm,
  ServicesForm,
  SettingForm,
  UnitedVoicesForm,
  BannerForm,
} from '@/forms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FormsDemo = () => {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Forms Demo</h1>
        <p className="text-muted-foreground">
          Production-ready forms built with Formik, Yup, and shadcn/ui
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="winners">Winners</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="voices">Voices</TabsTrigger>
          <TabsTrigger value="banner">Banner</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>
                Standard contact form with name, email, phone, and message validation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Endpoint:</strong> POST /api/contact</p>
                <p><strong>Features:</strong> Email validation, phone number format, character limits</p>
              </div>
            </CardContent>
          </Card>
          <ContactForm />
        </TabsContent>

        <TabsContent value="faq">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>FAQ Form</CardTitle>
              <CardDescription>
                Manage FAQs with image upload and dynamic question-answer pairs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Endpoint:</strong> POST /api/faq</p>
                <p><strong>Features:</strong> Image upload, dynamic FAQ array, file validation</p>
              </div>
            </CardContent>
          </Card>
          <FAQForm />
        </TabsContent>

        <TabsContent value="story">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Our Story Form</CardTitle>
              <CardDescription>
                Complex nested form for managing story sections with multiple content arrays.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Endpoint:</strong> POST /api/our-story</p>
                <p><strong>Features:</strong> Nested sections, dynamic content arrays, flexible structure</p>
              </div>
            </CardContent>
          </Card>
          <OurStoryForm />
        </TabsContent>

        <TabsContent value="winners">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Real Winners Form</CardTitle>
              <CardDescription>
                Create winner showcases with icon selection and character limits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Endpoint:</strong> POST /api/real-winners</p>
                <p><strong>Features:</strong> Icon selector, character counter, dynamic winners list</p>
              </div>
            </CardContent>
          </Card>
          <RealWinnersForm />
        </TabsContent>

        <TabsContent value="services">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Services Form</CardTitle>
              <CardDescription>
                Comprehensive service management with tabbed interface and nested details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Endpoint:</strong> POST /api/services</p>
                <p><strong>Features:</strong> Tabbed UI, image upload, URL validation, nested sections</p>
              </div>
            </CardContent>
          </Card>
          <ServicesForm />
        </TabsContent>

        <TabsContent value="settings">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Settings Form</CardTitle>
              <CardDescription>
                Site-wide settings including logo upload and social media links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Endpoint:</strong> POST /api/settings</p>
                <p><strong>Features:</strong> Logo upload, social icons, email/URL validation</p>
              </div>
            </CardContent>
          </Card>
          <SettingForm />
        </TabsContent>

        <TabsContent value="voices">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>United Voices Form</CardTitle>
              <CardDescription>
                Dual image upload with strict file size and type validation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Endpoint:</strong> POST /api/united-voices</p>
                <p><strong>Features:</strong> File type validation, 2MB size limit, image preview, file size display</p>
              </div>
            </CardContent>
          </Card>
          <UnitedVoicesForm />
        </TabsContent>

        <TabsContent value="banner">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Banner Form</CardTitle>
              <CardDescription>
                Simple banner configuration with title and subtitle fields.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Endpoint:</strong> POST /api/banner</p>
                <p><strong>Features:</strong> Simple text fields, optional validation</p>
              </div>
            </CardContent>
          </Card>
          <BannerForm />
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h3>Import Forms</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`import { ContactForm, FAQForm, ServicesForm } from '@/forms';`}</code>
          </pre>

          <h3 className="mt-4">Configure API Base URL</h3>
          <p>Add to your <code>.env</code> file:</p>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`VITE_API_BASE_URL=http://localhost:3000/api`}</code>
          </pre>

          <h3 className="mt-4">Authentication</h3>
          <p>Forms automatically include Bearer tokens from localStorage:</p>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`localStorage.setItem('authToken', 'your-token-here');`}</code>
          </pre>

          <h3 className="mt-4">Form Features</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Full TypeScript support with type inference</li>
            <li>Formik for robust form state management</li>
            <li>Yup validation with custom rules</li>
            <li>shadcn/ui components for consistent styling</li>
            <li>File upload with preview and validation</li>
            <li>Dynamic arrays with add/remove functionality</li>
            <li>Toast notifications for success/error states</li>
            <li>Loading states during submission</li>
            <li>Fully responsive design</li>
          </ul>

          <h3 className="mt-4">Documentation</h3>
          <p>
            Complete documentation is available in{' '}
            <code>src/forms/README.md</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormsDemo;
