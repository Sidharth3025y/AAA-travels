import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";

export default function PackageCard({ pkg }) {
  const { t, localized } = useI18n();
  const catLabel = t(`search.${pkg.category}`);

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#f0ebd5] bg-white shadow-[0_1px_2px_rgba(122,95,20,0.04)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-20px_rgba(122,95,20,0.35)] motion-reduce:transition-none">
      <Link to={`/packages/${pkg.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={pkg.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#7a5f14] shadow-sm backdrop-blur-sm">
          {pkg.days} {t("featured.days")}
        </span>
      </Link>

      <div className="flex flex-col gap-2.5 p-5">
        <p className="m-0 text-xs font-bold uppercase tracking-[0.12em] text-[#bc9d2c]">
          {pkg.destination} · {catLabel}
        </p>
        <h3 className="m-0 font-serif text-lg font-bold leading-snug tracking-tight text-[#1f1f1f]">
          <Link to={`/packages/${pkg.id}`} className="hover:text-[#7a5f14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2">
            {localized(pkg.title)}
          </Link>
        </h3>
        <p className="m-0 line-clamp-2 text-sm leading-relaxed text-[#5b5646]">{localized(pkg.summary)}</p>

        <div className="mt-3 flex items-center justify-between border-t border-[#f0ebd5] pt-3.5">
          <strong className="text-sm font-bold text-[#1f1f1f]">
            {t("featured.from")} US$ {pkg.priceUsd ?? pkg.price}
            {pkg.priceNpr != null ? <span className="block text-xs font-medium text-[#8a8676]">NPR {pkg.priceNpr}</span> : null}
          </strong>
          <Link
            to={`/packages/${pkg.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-[#fdfaed] px-3.5 py-2 text-sm font-bold text-[#7a5f14] transition-colors hover:bg-[#ffed9b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2"
          >
            {t("featured.view")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}