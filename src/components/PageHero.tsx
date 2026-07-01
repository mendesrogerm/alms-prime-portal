type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "cyan" | "emerald";
};

export function PageHero({
  eyebrow,
  title,
  description,
  accent = "cyan",
}: PageHeroProps) {
  const accentClass =
    accent === "emerald" ? "text-emerald-300" : "text-cyan-300";

  return (
    <div className="mx-auto max-w-7xl py-12 lg:py-14">
      <p className={`text-sm font-black uppercase tracking-[0.28em] ${accentClass}`}>
        {eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-[4.7rem]">
        {title}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
        {description}
      </p>
    </div>
  );
}
