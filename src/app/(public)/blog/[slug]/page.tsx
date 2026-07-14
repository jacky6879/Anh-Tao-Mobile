import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// ISR: cache rendered blog posts, revalidate every 5 minutes
export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.seoPage.findUnique({
    where: { slug },
  });
  if (!post || !post.published) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription,
    openGraph: {
      images: post.ogImage ? [{ url: post.ogImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.seoPage.findUnique({
    where: { slug },
  });

  if (!post || !post.published) return notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{post.h1 || post.title}</h1>
        <div className="mt-4 text-sm text-[var(--text-muted)]">
          Đăng ngày {format(new Date(post.createdAt), "dd MMMM yyyy", { locale: vi })}
        </div>
      </div>

      {post.ogImage && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-token">
          <img src={post.ogImage} alt={post.title} className="w-full h-auto" />
        </div>
      )}

      {/* Tailwind Typography plugin would be best, but we'll use a wrapper with basic prose styles for now */}
      <div 
        className="prose prose-blue dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body || "" }}
      />
    </article>
  );
}

