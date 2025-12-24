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
  { 
    title: 'Banner Slides', 
    value: '3', 
    icon: Image, 
    href: '/content/banner',
    description: 'Active hero slides'
  },
  { 
    title: 'Our Story', 
    value: '1', 
    icon: BookOpen, 
    href: '/content/our-story',
    description: 'Story sections'
  },
  { 
    title: 'Services', 
    value: '6', 
    icon: Wrench, 
    href: '/content/services',
    description: 'Service offerings'
  },
  { 
    title: 'Testimonials', 
    value: '12', 
    icon: Quote, 
    href: '/content/united-voices',
    description: 'United voices'
  },
  { 
    title: 'Winners', 
    value: '8', 
    icon: Trophy, 
    href: '/content/real-winners',
    description: 'Success stories'
  },
  { 
    title: 'FAQs', 
    value: '15', 
    icon: HelpCircle, 
    href: '/content/faqs',
    description: 'Questions answered'
  },
];

const quickActions = [
  { 
    title: 'Update Banner', 
    description: 'Edit hero section slides and content',
    icon: Image,
    href: '/content/banner'
  },
  { 
    title: 'Manage Testimonials', 
    description: 'Add or edit united voices entries',
    icon: Quote,
    href: '/content/united-voices'
  },
  { 
    title: 'View Contacts', 
    description: 'Review form submissions and inquiries',
    icon: Users,
    href: '/contacts'
  },
  { 
    title: 'Update Fight Content', 
    description: 'Edit the fight section content',
    icon: Sword,
    href: '/content/the-fight'
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Link 
            key={stat.title} 
            to={stat.href}
            className="block"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action, index) => (
            <Card 
              key={action.title}
              className="group hover:bg-accent/50 transition-colors"
              style={{ animationDelay: `${(stats.length + index) * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                    <action.icon className="h-5 w-5 text-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  <Link to={action.href}>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
        <Card>
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
