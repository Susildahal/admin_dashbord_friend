import { 
  Image, 
  BookOpen, 
  Sword, 
  Wrench, 
  Quote, 
  Trophy, 
  HelpCircle,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
  { title: 'Banner Slides', icon: Image, href: '/content/banner', description: 'Active hero slides' },
  { title: 'Our Story', icon: BookOpen, href: '/content/our-story', description: 'Story sections' },
  { title: 'Services', icon: Wrench, href: '/content/services', description: 'Service offerings' },
  { title: 'Testimonials', icon: Quote, href: '/content/united-voices', description: 'United voices' },
  { title: 'Winners', icon: Trophy, href: '/content/real-winners', description: 'Success stories' },
  { title: 'FAQs', icon: HelpCircle, href: '/content/faqs', description: 'Questions answered' },
];

const quickActions = [
  { title: 'Update Banner', description: 'Edit hero section slides and content', icon: Image, href: '/content/banner' },
  { title: 'Manage Testimonials', description: 'Add or edit united voices entries', icon: Quote, href: '/content/united-voices' },
  { title: 'View Contacts', description: 'Review form submissions and inquiries', icon: Users, href: '/contacts' },
  { title: 'Update Fight Content', description: 'Edit the fight section content', icon: Sword, href: '/content/the-fight' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-[#ca7b28]">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Link key={stat.title} to={stat.href} className="block">
            <Card className="h-full border border-[#ca7b28]/30 hover:border-[#ca7b28] hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-[#ca7b28]" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4 text-[#ca7b28]">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="group border border-[#ca7b28]/30 hover:border-[#ca7b28] transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[#ca7b28] flex items-center justify-center shrink-0">
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  <Link to={action.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-[#ca7b28]"
                    >
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4 text-[#ca7b28]">
          Recent Activity
        </h2>
        <Card className="border border-[#ca7b28]/30">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Activity tracking will be available once Sanity.io is connected.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
