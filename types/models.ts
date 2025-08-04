export interface Story {
  id: number;
  title: string;
  slug: string;
  text: string;
  region: string;
  category: string;
  language: string;
  cover_image?: string | null; // Optional, may be null in Supabase
  source_url?: string | null; // Optional, may be null in Supabase
  approved: boolean;
  created_at: string; // ISO string (from Supabase timestamp)
  status?: string; // Optional, for frontend display or moderation
  author?: {
    id: number;
    name: string;
  } | null;
  tags: {
    id: number;
    name: string;
  }[];
}
// types/models.ts

export interface Author {
  id: number;
  name: string;
  email?: string | null;
  contributions: Story[];
}
