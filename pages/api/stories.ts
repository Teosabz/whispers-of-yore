import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { region, tag } = req.query;

  let query = supabase
    .from("stories")
    .select(
      `
      *,
      story_tag!inner(tag_id),
      tags!inner(name)
    `
    )
    .order("created_at", { ascending: false });

  if (region) query = query.eq("region", region);
  if (tag) query = query.eq("tags.name", tag);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}
