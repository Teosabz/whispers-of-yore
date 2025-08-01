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
