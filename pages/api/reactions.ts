import type { NextApiRequest, NextApiResponse } from "next";

type ReactionData = {
  [storyId: number]: Record<string, number>;
};

const reactionStore: ReactionData = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { storyId, type } = JSON.parse(req.body);

    if (!storyId || !type) {
      return res
        .status(400)
        .json({ error: "Missing storyId or reaction type" });
    }

    if (!reactionStore[storyId]) {
      reactionStore[storyId] = {};
    }

    reactionStore[storyId][type] = (reactionStore[storyId][type] || 0) + 1;

    return res.status(200).json({ reactions: reactionStore[storyId] });
  }

  if (req.method === "GET") {
    const { storyId } = req.query;

    if (!storyId) {
      return res.status(400).json({ error: "Missing storyId" });
    }

    const reactions = reactionStore[Number(storyId)] || {};
    return res.status(200).json({ reactions });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
