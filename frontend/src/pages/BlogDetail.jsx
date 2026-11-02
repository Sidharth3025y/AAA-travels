import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchBlogPost } from "../api/blog";

export default function BlogDetail() {
  const { t } = useI18n();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPost(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page">
        <header className="page-hero">
          <h1>{t("detail.loading")}</h1>
        </header>
        <main className="mx-auto max-w-2xl py-12 text-center">
          <p className="text-[0.875rem] text-[#5b6777]">Loading blog post…</p>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page">
        <header className="page-hero">
          <h1>{t("blog.notFound")}</h1>
        </header>
        <main className="mx-auto max-w-2xl py-12 text-center">
          <p className="text-[0.875rem] text-[#5b6777]">Blog post not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-hero">
        <h1>{post.title}</h1>
        <p className="text-[0.875rem] text-[#5b6777]">{post.excerpt || ""}</p>
      </header>
      <main className="mx-auto max-w-2xl py-8">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover mb-6 rounded-lg"
        />
        <div className="prose max-w-none whitespace-pre-wrap text-[#1a2332]">
          {post.content}
        </div>
      </main>
    </div>
  );
}