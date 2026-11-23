import type { LogoStripItem } from "@/lib/content";

function LogoStrip({
  items,
  columns,
}: {
  items: LogoStripItem[];
  columns: string;
}) {
  return (
    <ul className={`grid grid-cols-2 items-center gap-x-6 gap-y-9 ${columns}`}>
      {items.map((item) => (
        <li
          key={item.label}
          className={`text-center text-[15px] leading-snug text-[#8b8b8b] transition-colors duration-300 hover:text-[#c9c9c9] md:text-base lg:text-lg ${item.className}`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function Clients({
  clients,
  projects,
}: {
  clients: LogoStripItem[];
  projects: LogoStripItem[];
}) {
  if (clients.length === 0 && projects.length === 0) return null;

  return (
    <section
      aria-label="Clients and projects"
      className="mx-auto max-w-[1560px] px-5 md:px-8 lg:px-10"
    >
      <div className="grid gap-y-12 pb-14 pt-10 md:grid-cols-[130px_1fr] md:gap-x-8">
        {clients.length > 0 && (
          <>
            <p className="text-base text-[#c4c4c4]">Clients</p>
            <LogoStrip items={clients} columns="md:grid-cols-6" />
          </>
        )}

        {projects.length > 0 && (
          <>
            <p className="text-base text-[#c4c4c4]">Projects</p>
            <LogoStrip items={projects} columns="md:grid-cols-5" />
          </>
        )}
      </div>
      <hr className="border-line" />
    </section>
  );
}
