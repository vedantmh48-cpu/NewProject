import { useId } from "react";

/**
 * Static SVG globe used when WebGL is unavailable, when the context is lost,
 * or as the poster layer behind the live canvas. The original artwork from the
 * previous hero is preserved so the fallback keeps the established look.
 */
export default function GlobeFallback({ spin = true }) {
  const id = useId().replaceAll(":", "");

  return (
    <svg
      className="globe-fallback-svg"
      viewBox="0 0 420 420"
      data-spin={spin ? "true" : "false"}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`ocean-${id}`} cx="38%" cy="34%" r="72%">
          <stop offset="0" stopColor="#d5f7ff" />
          <stop offset=".38" stopColor="#70c4e8" />
          <stop offset=".72" stopColor="#3183c2" />
          <stop offset="1" stopColor="#174e89" />
        </radialGradient>
        <linearGradient id={`land-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#edf0d0" />
          <stop offset=".48" stopColor="#a6c5a2" />
          <stop offset="1" stopColor="#699a89" />
        </linearGradient>
        <linearGradient id={`night-${id}`} x1="0" x2="1">
          <stop stopColor="#07141e" stopOpacity=".28" />
          <stop offset=".48" stopColor="#07141e" stopOpacity=".12" />
          <stop offset="1" stopColor="#07141e" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`sheen-${id}`} cx="31%" cy="24%" r="75%">
          <stop stopColor="#ffffff" stopOpacity=".24" />
          <stop offset=".42" stopColor="#ffffff" stopOpacity=".04" />
          <stop offset="1" stopColor="#06131c" stopOpacity=".32" />
        </radialGradient>
        <clipPath id={`clip-${id}`}>
          <circle cx="210" cy="210" r="207" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <circle cx="210" cy="210" r="207" fill={`url(#ocean-${id})`} />
        <path
          d="M68 74l26-19 36 5 18 17 33 8 15 23-12 22-22 8-4 25-21 12-9 33-22 9-13-22-25-8-9-27-25-8-11-30 16-18-7-23z"
          fill={`url(#land-${id})`}
        />
        <path
          d="M157 218l29 8 17 23-8 28 14 29-12 48-25 31-13-23-5-35-17-21 5-32-19-27z"
          fill="#9dbc9a"
        />
        <path
          d="M229 73l24-20 29 9 17-8 33 18 5 22 29 11-4 22-23 13-8 29-28 9-6 26-23 9-17-20-31-3-20-21 3-29-24-20 8-22z"
          fill="#dce5bd"
        />
        <path
          d="M281 235l24-13 30 7 22 23-7 31-20 15-18 29-28-9-5-25-21-15z"
          fill="#a9c3a0"
        />
        <path
          d="M38 202c65-32 107-24 158 5s94 36 187-11M33 262c85-38 125-28 181 4s98 29 174-10M88 124c54 13 93 32 137 64s88 25 138 7"
          fill="none"
          stroke="#f5ffff"
          strokeOpacity=".2"
          strokeWidth="2"
        />
        <ellipse cx="210" cy="210" rx="78" ry="201" fill="none" stroke="#e1f6e9" strokeOpacity=".12" strokeWidth="1.5" />
        <ellipse cx="210" cy="210" rx="195" ry="66" fill="none" stroke="#e1f6e9" strokeOpacity=".14" strokeWidth="1.5" />
        <path d="M27 173c55-16 99-13 143 3 61 23 130 24 218 1M30 246c63-20 109-19 162-2 63 20 127 20 205 0" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="9" strokeLinecap="round" />
        <rect width="420" height="420" fill={`url(#night-${id})`} />
        <circle cx="210" cy="210" r="207" fill={`url(#sheen-${id})`} />
        <ellipse
          cx="150"
          cy="118"
          rx="105"
          ry="63"
          fill="#fff"
          opacity=".1"
        />
      </g>
      <circle cx="210" cy="210" r="207" fill="none" stroke="#92e5dc" strokeOpacity=".56" strokeWidth="2" />
      <circle cx="210" cy="210" r="211" fill="none" stroke="#67c7c1" strokeOpacity=".14" strokeWidth="7" />
    </svg>
  );
}
