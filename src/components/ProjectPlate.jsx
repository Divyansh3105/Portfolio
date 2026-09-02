import { WebOrb } from "./WebDecor";

/**
 * A project's cover.
 *
 * Where the older build had a real screenshot it is used, drained to
 * greyscale so the set reads as one system rather than six competing UIs, and
 * captioned over a gradient. Projects with no shot (CIPHER, the CSS
 * experiments) fall back to art generated from the project's own index and
 * name — a web orb and a ruled grid — which is honest about being a plate
 * rather than pretending to be product imagery.
 */
export default function ProjectPlate({ project, className = "", active = false }) {
  const dark = project.tone === "ink";

  if (project.image) {
    return (
      <div
        aria-hidden="true"
        className={`relative isolate aspect-[4/3] w-full overflow-hidden bg-ink ${className}`}
      >
        <img
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-[filter,transform] duration-900 ease-web ${
            active ? "scale-[1.03] grayscale-0" : "grayscale contrast-105"
          }`}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-6 text-paper">
          <div className="flex items-start justify-between">
            <span className="label-mono bg-blood px-2.5 py-1">
              {project.category}
            </span>
            <span className="label-mono opacity-70">{project.year}</span>
          </div>

          <div>
            <p className="display-tight text-[1.5rem] leading-none">
              {project.name}
            </p>
            <p className="label-mono mt-2 opacity-65">
              {project.stack.slice(0, 3).join(" / ")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative isolate aspect-[4/3] w-full overflow-hidden ${
        dark ? "bg-ink text-paper" : "bg-blood text-paper"
      } ${className}`}
    >
      <div className="absolute -right-[22%] -top-[38%] opacity-[0.55]">
        <WebOrb
          size={420}
          spokes={14}
          rings={8}
          className={dark ? "text-blood/80" : "text-paper/45"}
        />
      </div>

      {/* Ruled grid, echoing the section dividers elsewhere on the page. */}
      <div className="absolute inset-0 opacity-20">
        {[25, 50, 75].map((p) => (
          <span
            key={`v${p}`}
            className="absolute top-0 h-full w-px bg-current"
            style={{ left: `${p}%` }}
          />
        ))}
        {[33, 66].map((p) => (
          <span
            key={`h${p}`}
            className="absolute left-0 h-px w-full bg-current"
            style={{ top: `${p}%` }}
          />
        ))}
      </div>

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="label-mono opacity-70">{project.kicker}</span>
          <span className="label-mono opacity-70">{project.year}</span>
        </div>

        <span className="display-tight text-[3.4rem] leading-[0.8] opacity-90">
          {project.index}
        </span>

        <div>
          <p className="display-tight text-[1.5rem] leading-none">
            {project.name}
          </p>
          <p className="label-mono mt-2 opacity-65">
            {project.stack.slice(0, 3).join(" / ")}
          </p>
        </div>
      </div>
    </div>
  );
}
