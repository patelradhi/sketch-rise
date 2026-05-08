/**
 * Shared ambient background for marketing pages — light grid pattern + 3
 * colored blob glows (violet / pink / indigo). Stays behind content via z-0.
 *
 * Drop into any page that has a `relative` flex-column root and `overflow-x-hidden`.
 * Page content should be wrapped in `relative z-10` so it sits above this layer.
 */
export default function PageBackground() {
  return (
    <>
      {/* Grid pattern — light mode (faint black lines) */}
      <div
        className="absolute inset-0 dark:hidden pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Grid pattern — dark mode (faint white lines) */}
      <div
        className="absolute inset-0 hidden dark:block pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient color blobs — both modes, very subtle */}
      <div className="absolute top-[8%] -left-32 w-[480px] h-[480px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[42%] -right-40 w-[560px] h-[560px] rounded-full bg-pink-500/5 dark:bg-pink-500/[0.03] blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[12%] left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/[0.03] blur-3xl pointer-events-none z-0" />
    </>
  )
}
