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
  const accentClass = accent === "emerald" ? "text-emerald-300" : "text-cyan-300";

  return (
    <div className="mx-auto max-w-7xl py-20">
      <p className={`text-sm font-black uppercase tracking-[0.28em] ${accentClass}`}>
        {eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
        {description}
      </p>
    </div>
  );
}
