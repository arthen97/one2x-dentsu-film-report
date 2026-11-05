/* 线性图标：统一 1.6 描边、24 视窗、currentColor */
function IconBase({ children, size = 16, sw = 1.6, className = "" }) {
  return (
    <svg
      className={"ic " + className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const IconCalendar = (p) => (
  <IconBase {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </IconBase>
);

const IconClose = (p) => (
  <IconBase {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </IconBase>
);

const IconCheck = (p) => (
  <IconBase {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </IconBase>
);

const IconFlag = (p) => (
  <IconBase {...p}>
    <path d="M5 21V4M5 5h11l-1.6 3.5L16 12H5" />
  </IconBase>
);

const IconTimeline = (p) => (
  <IconBase {...p}>
    <path d="M3 6h10M3 12h16M3 18h7" />
    <circle cx="17" cy="6" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="8" cy="18" r="1.6" fill="currentColor" stroke="none" />
  </IconBase>
);

const IconBoard = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="5" height="16" rx="1.2" />
    <rect x="10" y="4" width="5" height="10" rx="1.2" />
    <rect x="17" y="4" width="4" height="6" rx="1.2" />
  </IconBase>
);

const IconFilm = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 4v16M16 4v16M3 9h5M3 15h5M16 9h5M16 15h5" />
  </IconBase>
);

Object.assign(window, {
  IconBase, IconCalendar, IconClose, IconCheck, IconFlag,
  IconTimeline, IconBoard, IconFilm
});
