import {
  Users, Heart, Baby, Flame, HandHeart, Megaphone, MicVocal,
  Monitor, DoorOpen, Wrench, Sparkles, Music, Camera, Video,
  BookOpen, Briefcase, Sprout, Star, Zap, Church, Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MinistryType = "MINISTRY" | "DEPARTMENT";

// Stable foreign-key id (e.g. "youth-ministry") usable across Members, Leaders,
// Events, Attendance, Groups, Announcements, and the Volunteer Scheduling/Rota
// feature. Predefined entries are shared reference data (isCustom: false).
export interface MinistryOrDepartment {
  id: string;
  name: string;
  type: MinistryType;
  description?: string;
  icon?: string;
  isCustom: boolean;
  isActive: boolean;
}

export interface PredefinedMinistry {
  id: string;
  name: string;
  type: MinistryType;
  description: string;
  icon: string;
}

export const PREDEFINED_GROUPS: { key: string; title: string; items: PredefinedMinistry[] }[] = [
  {
    key: "people",
    title: "PEOPLE MINISTRIES",
    items: [
      { id: "youth-ministry", name: "Youth Ministry", type: "MINISTRY", description: "For teenagers and young adults.", icon: "Flame" },
      { id: "mens-ministry", name: "Men's Ministry", type: "MINISTRY", description: "Men's fellowship, spiritual growth, mentorship, and development.", icon: "Users" },
      { id: "womens-ministry", name: "Women's Ministry", type: "MINISTRY", description: "Women's fellowship, spiritual growth, mentorship, and development.", icon: "Heart" },
      { id: "childrens-ministry", name: "Children's Ministry", type: "MINISTRY", description: "Children's teaching, activities, and spiritual development.", icon: "Baby" },
    ],
  },
  {
    key: "outreach",
    title: "SPIRITUAL & OUTREACH",
    items: [
      { id: "prayer-ministry", name: "Prayer Ministry", type: "MINISTRY", description: "Prayer meetings, intercession, and prayer activities.", icon: "HandHeart" },
      { id: "evangelism-ministry", name: "Evangelism Ministry", type: "MINISTRY", description: "Outreach, evangelism, community engagement, and winning souls.", icon: "Megaphone" },
    ],
  },
  {
    key: "worship",
    title: "WORSHIP & SERVICE",
    items: [
      { id: "choir-ministry", name: "Choir Ministry", type: "MINISTRY", description: "Choir members, rehearsals, and choir activities.", icon: "MicVocal" },
      { id: "media-tech-ministry", name: "Media & Technical Ministry", type: "MINISTRY", description: "Sound, livestreaming, projection, photography, video, and other technical services.", icon: "Monitor" },
      { id: "ushering-ministry", name: "Ushering Ministry", type: "MINISTRY", description: "Welcoming members and visitors, seating, service assistance, and maintaining order during services.", icon: "DoorOpen" },
    ],
  },
  {
    key: "operations",
    title: "OPERATIONS",
    items: [
      { id: "facilities-department", name: "Facilities & Maintenance Department", type: "DEPARTMENT", description: "Church cleaning, maintenance, setup, and care of church facilities.", icon: "Wrench" },
    ],
  },
];

// Fixed icon set for custom entries — no free icon upload.
export const MINISTRY_ICON_PICKER: string[] = [
  "Users", "Heart", "Baby", "Flame", "Sparkles", "HandHeart",
  "Megaphone", "MicVocal", "Music", "Camera", "Video", "Monitor",
  "DoorOpen", "BookOpen", "Briefcase", "Sprout", "Star", "Zap", "Church",
];

const ICON_MAP: Record<string, LucideIcon> = {
  Users, Heart, Baby, Flame, Sparkles, HandHeart,
  Megaphone, MicVocal, Music, Camera, Video, Monitor,
  DoorOpen, BookOpen, Briefcase, Sprout, Star, Zap, Church, Wrench, Layers,
};

export function resolveMinistryIcon(name?: string): LucideIcon {
  return (name && ICON_MAP[name]) || Layers;
}
