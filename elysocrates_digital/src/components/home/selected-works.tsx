import type { WorkColumn } from "@/lib/content";
import { WorkEntry } from "@/components/home/work-entry";

export function SelectedWorks({ columns }: { columns: WorkColumn[] }) {
  if (columns.length === 0) return null;

  return (
    <section id="works" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-[1560px] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-faint">
          Selected Works
        </h2>

        <div className="mt-8 grid gap-x-10 gap-y-12 lg:grid-cols-3">
          {columns.map((column) => (
            <div key={column.label}>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-faint">
                {column.label}
              </h3>
              <div className="mt-6 flex flex-col gap-8 md:gap-9">
                {column.entries.map((entry) => (
                  <WorkEntry key={entry.title} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
