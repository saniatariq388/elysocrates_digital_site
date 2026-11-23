import type { WorkEntry as WorkEntryData } from "@/lib/content";

export function WorkEntry({ entry }: { entry: WorkEntryData }) {
  return (
    <article>
      <h4 className="text-[17px] font-semibold text-[#dedede]">
        {entry.title}
      </h4>
      <p className="mt-1 text-[10.5px] uppercase tracking-[0.12em] text-[#8a8a8a]">
        {entry.category}
      </p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-[#a3a3a3]">
        {entry.description}
      </p>
      {entry.meta && (
        <p className="mt-2 text-[12.5px] italic text-faint">{entry.meta}</p>
      )}
      {entry.madeIn && (
        <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-faint">
          Made in {entry.madeIn}
        </p>
      )}
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {entry.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-[3px] bg-chip px-2 py-[3px] text-[11px] text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
