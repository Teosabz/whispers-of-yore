import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, error } = await supabase.from("stories").select("region"); // remove .distinct()

  if (error) return res.status(500).json({ error: error.message });

  // Deduplicate manually
  const regions = Array.from(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Set(data?.map((row: any) => row.region).filter(Boolean))
  );

  res.status(200).json(regions);
}
