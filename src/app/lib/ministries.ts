import {
  Users, Heart, Baby, Flame, HandHeart, Megaphone, MicVocal,
  Monitor, DoorOpen, Wrench, Sparkles, Music, Camera, Video,
  BookOpen, Briefcase, Sprout, Star, Zap, Church, Layers,
  Home, Coffee, Laptop, ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MinistryType = "MINISTRY" | "DEPARTMENT";

// Stable foreign-key id (matches the backend PREDEFINED_MINISTRIES UUIDs).
// Predefined entries are shared reference data (isCustom: false).
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
  description?: string;
  icon: string;
}

export const PREDEFINED_GROUPS: { key: string; title: string; items: PredefinedMinistry[] }[] = [
  {
    key: "people",
    title: "PEOPLE MINISTRIES",
    items: [
      { id: "33333333-3333-4a33-8b33-333333333333", name: "Youth Ministry", type: "MINISTRY", description: "Disciples and connects teenagers and young adults.", icon: "Flame" },
      { id: "44444444-4444-4a44-8b44-444444444444", name: "Men's Ministry", type: "MINISTRY", description: "Equips and builds up men in faith and leadership.", icon: "Users" },
      { id: "55555555-5555-4a55-8b55-555555555555", name: "Women's Ministry", type: "MINISTRY", description: "Builds community and faith among women.", icon: "Heart" },
      { id: "22222222-2222-4a22-8b22-222222222222", name: "Children's Ministry", type: "MINISTRY", description: "Nurtures faith in children and families.", icon: "Baby" },
      { id: "77777777-7777-4a77-8b77-777777777777", name: "Marriage & Family Ministry", type: "MINISTRY", description: "Strengthens marriages and families.", icon: "Home" },
    ],
  },
  {
    key: "outreach",
    title: "SPIRITUAL & OUTREACH",
    items: [
      { id: "66666666-6666-4a66-8b66-666666666666", name: "Prayer Ministry", type: "MINISTRY", description: "Intercedes for the church and wider community.", icon: "HandHeart" },
      { id: "88888888-8888-4a88-8b88-888888888888", name: "Outreach & Evangelism", type: "MINISTRY", description: "Shares the gospel and serves the local community.", icon: "Megaphone" },
      { id: "99999999-9999-4a99-8b99-999999999999", name: "Discipleship Ministry", type: "MINISTRY", description: "Grows believers through small groups and mentoring.", icon: "BookOpen" },
      { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", name: "Sunday School", type: "MINISTRY", description: "Provides age-appropriate biblical teaching.", icon: "Sprout" },
    ],
  },
  {
    key: "worship",
    title: "WORSHIP & SERVICE",
    items: [
      { id: "11111111-1111-4a11-8b11-111111111111", name: "Worship & Music Ministry", type: "MINISTRY", description: "Leads congregational worship and music.", icon: "MicVocal" },
      { id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", name: "Media & Communications", type: "DEPARTMENT", description: "Handles audiovisual, livestreaming and communications.", icon: "Camera" },
      { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", name: "Ushering Department", type: "DEPARTMENT", description: "Welcomes and seats attendees during services.", icon: "DoorOpen" },
    ],
  },
  {
    key: "operations",
    title: "OPERATIONS",
    items: [
      { id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", name: "Finance Department", type: "DEPARTMENT", description: "Manages church finances and giving.", icon: "Briefcase" },
      { id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", name: "Hospitality Department", type: "DEPARTMENT", description: "Hosts guests and coordinates refreshments and events.", icon: "Coffee" },
      { id: "ffffffff-ffff-4fff-8fff-ffffffffffff", name: "Information Technology", type: "DEPARTMENT", description: "Runs the church's technical systems and tools.", icon: "Laptop" },
      { id: "a1b2c3d4-e5f6-4a5b-8c9d-e1f2a3b4c5d6", name: "Security & Safety", type: "DEPARTMENT", description: "Keeps members and church facilities safe.", icon: "ShieldCheck" },
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
  Home, Coffee, Laptop, ShieldCheck,
};

export function resolveMinistryIcon(name?: string): LucideIcon {
  return (name && ICON_MAP[name]) || Layers;
}
