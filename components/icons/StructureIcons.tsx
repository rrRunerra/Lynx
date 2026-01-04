import React from "react";

export const CommandsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 8L11 12L7 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 16H17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <circle cx="3" cy="3" r="0.5" fill="currentColor" />
    <circle cx="21" cy="5" r="0.5" fill="currentColor" />
    <circle cx="19" cy="20" r="0.5" fill="currentColor" />
    <circle cx="4" cy="18" r="0.5" fill="currentColor" />
  </svg>
);

export const EventsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path
      d="M12 7V3M12 21V17M17 12H21M3 12H7M15.5 8.5L18.5 5.5M5.5 18.5L8.5 15.5M15.5 15.5L18.5 18.5M5.5 5.5L8.5 8.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeDasharray="4 2"
    />
  </svg>
);

export const CronsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 3"
    />
    <path
      d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 8V12L14 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="22" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const ApiIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 4V8M12 16V20M4 12H8M16 12H20M6.5 6.5L9 9M15 15L17.5 17.5M17.5 6.5L15 9M9 15L6.5 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="3" r="1" fill="currentColor" />
    <circle cx="12" cy="21" r="1" fill="currentColor" />
    <circle cx="3" cy="12" r="1" fill="currentColor" />
    <circle cx="21" cy="12" r="1" fill="currentColor" />
  </svg>
);
