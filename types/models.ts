export type Story = {
  id: number;
  title: string;
  text: string;
  region: string;
  category: string;
  language?: string;
  source_url?: string;
  source?: string;
  nation?: string;
  slug?: string;
  cover_image?: string; // ✅ add this
  author?: string;
  created_at?: string;
  updated_at?: string;
};
