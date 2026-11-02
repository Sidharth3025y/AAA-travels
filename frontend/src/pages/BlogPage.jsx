import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchBlogPosts } from "../api/blog";

export default function BlogPage() {
  const { t } = useI18n();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <header className="page-hero">
        <h1>{t("blog.title")}</h1>
        <p>{t("blog.subtitle")}</p>
      </header>
      <section className="section">
        {loading ? (
          <p className="empty">{t("detail.loading")}</p>
        ) : posts.length === 0 ? (
          <p className="empty">{t("blog.noPosts")}</p>
        ) : (
          <div className="blog-posts">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <div className="blog-image">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="blog-content p-5">
                  <h2 className="blog-title font-serif text-xl font-bold text-[#0f2744]">
                    {post.title}
                  </h2>
                  <p className="blog-excerpt text-[#5b6777] text-sm mt-2">
                    {post.excerpt || post.content?.slice(0, 150)}…
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="blog-read-more inline-block mt-3 text-[#1d4ed8] font-medium hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}