export function Logo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9e972d" // This sets the line color
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props} // Allows passing additional props like className, style etc.
    >
      {/* Main square of the dice */}
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />

      {/* Example dots for a 'five' face */}
      <path d="M8 8h.01" /> {/* Top-left dot */}
      <path d="M16 8h.01" /> {/* Top-right dot */}
      <path d="M12 12h.01" /> {/* Center dot */}
      <path d="M8 16h.01" /> {/* Bottom-left dot */}
      <path d="M16 16h.01" /> {/* Bottom-right dot */}
    </svg>
  );
}