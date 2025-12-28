import { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Loader2, PlusCircle, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import client from '@/config/sanity';

interface WayCard {
  subHeader: string;
  header: string;
  description: string[];
}

interface WayCardsFormData {
  oldWay: WayCard;
  newWay: WayCard;
}

const WayCardsForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<WayCardsFormData>({
    oldWay: { subHeader: 'OLD WAY', header: '', description: [''] },
    newWay: { subHeader: 'NEW WAY', header: '', description: [''] },
  });

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await client.fetch('*[_type=="wayCards"][0]');
        if (data) {
          setDocId(data._id);
          setInitialValues({
            oldWay: {
              subHeader: data.oldWay?.subHeader || 'OLD WAY',
              header: data.oldWay?.header || '',
              description: data.oldWay?.description || [''],
            },
            newWay: {
              subHeader: data.newWay?.subHeader || 'NEW WAY',
              header: data.newWay?.header || '',
              description: data.newWay?.description || [''],
            },
          });
        }
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSubmit = async (values: WayCardsFormData) => {
    setIsSubmitting(true);
    try {
      const payload = { _type: 'wayCards', oldWay: values.oldWay, newWay: values.newWay };
      if (docId) {
        await client.patch(docId).set(payload).commit();
      } else {
        const res = await client.create(payload);
        setDocId(res._id);
      }
      toast({ title: 'Success', description: 'Way Cards saved successfully!' });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err.message || 'Failed to save', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Way Cards Settings</CardTitle>
        <CardDescription>Manage Old Way vs New Way cards content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
          {({ values }) => (
            <Form className="space-y-6">
              
              {/* OLD WAY */}
              <div className="space-y-3 p-4 rounded ">
                <h3 className="font-bold text-gray-600 uppercase">Old Way Card</h3>

                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Field as={Input} name="oldWay.subHeader" placeholder="OLD WAY" />
                </div>

                <div className="space-y-2">
                  <Label>Card Header</Label>
                  <Field as={Input} name="oldWay.header" placeholder="THE OLD WAY" />
                </div>

                <div className="space-y-2">
                  <Label>Description Paragraphs</Label>
                  <FieldArray name="oldWay.description">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.oldWay.description.map((_, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Field as={Input} name={`oldWay.description.${idx}`} placeholder="Paragraph text..." />
                            {values.oldWay.description.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" size="sm" variant="outline" onClick={() => push('')}>
                          <PlusCircle className="w-3 h-3 mr-1" /> Add Paragraph
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              {/* NEW WAY */}
              <div className="space-y-3 p-4 rounded border">
                <h3 className="font-bold text-yellow-700 uppercase">New Way Card</h3>

                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Field as={Input} name="newWay.subHeader" placeholder="NEW WAY" />
                </div>

                <div className="space-y-2">
                  <Label>Card Header</Label>
                  <Field as={Input} name="newWay.header" placeholder="THE NEW WAY" />
                </div>

                <div className="space-y-2">
                  <Label>Description Paragraphs</Label>
                  <FieldArray name="newWay.description">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.newWay.description.map((_, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Field as={Input} name={`newWay.description.${idx}`} placeholder="Paragraph text..." />
                            {values.newWay.description.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" size="sm" variant="outline" onClick={() => push('')}>
                          <PlusCircle className="w-3 h-3 mr-1" /> Add Paragraph
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button type="submit" variant="theme" disabled={isSubmitting} className="flex items-center gap-2 bg">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Way Cards
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default WayCardsForm;
