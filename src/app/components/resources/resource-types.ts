import { BookOpen, FileText, Video, FileEdit, Award, Bell, Clock, Download, Calendar, LucideIcon } from "lucide-react";

export interface Resource {
  id: number;
  category: "Guide" | "Template" | "Webinar" | "Article" | "Case Study" | "Product Update";
  title: string;
  description: string;
  image: string;
  metadata: string;
  metaIcon: LucideIcon;
  icon: LucideIcon;
}

export const CATEGORIES = [
  { label: "All Resources", icon: BookOpen },
  { label: "Guides", categoryKey: "Guide", icon: BookOpen },
  { label: "Templates", categoryKey: "Template", icon: FileText },
  { label: "Webinars", categoryKey: "Webinar", icon: Video },
  { label: "Articles", categoryKey: "Article", icon: FileEdit },
  { label: "Case Studies", categoryKey: "Case Study", icon: Award },
  { label: "Product Updates", categoryKey: "Product Update", icon: Bell },
] as const;

export const RESOURCE_ITEMS: Resource[] = [
  {
    id: 1,
    category: "Guide",
    title: "The Complete Guide to Church Management",
    description: "Everything you need to know to streamline church operations and save valuable time.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    metadata: "12 min read",
    metaIcon: Clock,
    icon: BookOpen,
  },
  {
    id: 2,
    category: "Template",
    title: "Church Event Planning Template",
    description: "Plan successful events with our customizable template built for church teams.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    metadata: "Free download",
    metaIcon: Download,
    icon: FileText,
  },
  {
    id: 3,
    category: "Webinar",
    title: "Maximizing Giving Through Technology",
    description: "Learn strategies to increase generosity and build a healthy giving culture in your church.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    metadata: "Watch on demand",
    metaIcon: Calendar,
    icon: Video,
  },
  {
    id: 4,
    category: "Article",
    title: "5 Ways to Improve Member Engagement",
    description: "Practical tips to build stronger connections and keep your community thriving.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    metadata: "6 min read",
    metaIcon: Clock,
    icon: FileEdit,
  },
  {
    id: 5,
    category: "Guide",
    title: "Building a Stronger Church Community",
    description: "Discover practical ways to strengthen relationships and create a more connected church.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
    metadata: "10 min read",
    metaIcon: Clock,
    icon: BookOpen,
  },
  {
    id: 6,
    category: "Article",
    title: "Making Attendance Data Work for Your Ministry",
    description: "Learn how attendance insights can help church leaders make better decisions.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    metadata: "8 min read",
    metaIcon: Clock,
    icon: FileEdit,
  },
  {
    id: 7,
    category: "Template",
    title: "Church Volunteer Management Template",
    description: "Organize volunteer teams, schedules, responsibilities, and communication in one place.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    metadata: "Free download",
    metaIcon: Download,
    icon: FileText,
  },
  {
    id: 8,
    category: "Webinar",
    title: "The Future of Connected Church Technology",
    description: "Explore how connected technology can simplify operations and support ministry growth.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    metadata: "Watch on demand",
    metaIcon: Calendar,
    icon: Video,
  },
];
