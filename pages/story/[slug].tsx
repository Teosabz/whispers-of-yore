import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Header from "../../components/Header";
import FavoriteButton from "../../components/FavoriteButton";
import SaveButton from "../../components/SaveButton";
import RemoveButton from "../../components/RemoveButton";
import { supabase } from "../../lib/supabaseClient";
import React, { useState } from "react";

type Story = {
  id: number;
  title: string;
  text: string;
  region: string;
  category: string;
  created_at?: string | null;
  author?: { name: string } | null;
  cover_image?: string | null;
  slug: string;
};

type StoryPageProps = {
  story: Story | null;
};

export default function StoryPage({ story }: StoryPageProps) {
  const [removed, setRemoved] = useState(false);

  if (!story) {
    return <p className="text-center mt-10">Story not found.</p>;
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-4">{story.title}</h1>

        {story.cover_image ? (
          <Image
            src={story.cover_image}
            alt={story.title}
            width={800}
            height={450}
            className="rounded mb-6"
          />
        ) : null}

        <p className="mb-4 text-sm text-gray-500">
          By {story.author?.name ?? "Unknown"} | {story.region} |{" "}
          {story.category} |{" "}
          {story.created_at
            ? new Date(story.created_at).toLocaleDateString()
            : ""}
        </p>

        {/* Favorite Button */}
        <FavoriteButton storyId={story.id} />

        {/* Save to Collection Button */}
        {!removed && <SaveButton storyId={String(story.id)} />}

        {/* Remove from Collection Button */}
        {!removed && (
          <RemoveButton
            storyId={String(story.id)}
            onRemove={() => setRemoved(true)}
          />
        )}

        <article className="prose max-w-none whitespace-pre-wrap mt-6">
          {story.text}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data, error } = await supabase
    .from("stories")
    .select("slug")
    .eq("approved", true);

  if (error) {
    console.error("Error fetching slugs:", error);
    return { paths: [], fallback: "blocking" };
  }

  const paths = (data ?? []).map(({ slug }) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<StoryPageProps> = async (
  context
) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    return { notFound: true };
  }

  const { data, error } = await supabase
    .from("stories")
    .select(
      `
      id,
      title,
      text,
      region,
      category,
      created_at,
      author:users(name),
      cover_image,
      slug
    `
    )
    .eq("slug", slug)
    .eq("approved", true)
    .single();

  if (error || !data) {
    console.error("Error fetching story by slug:", error);
    return { notFound: true };
  }

  // Supabase returns author as array, so extract the first author or null
  const author =
    Array.isArray(data.author) && data.author.length > 0
      ? data.author[0]
      : null;

  return {
    props: {
      story: {
        ...data,
        author,
      },
    },
    revalidate: 60,
  };
};
