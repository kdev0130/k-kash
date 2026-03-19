"use client";

interface ToggleProps {
  on: boolean;
  onChange: () => void;
  label?: string;
}

export function Toggle({ on, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      style={{
        width: 50,
        height: 30,
        borderRadius: 15,
        background: on ? "var(--gold)" : "var(--sep)",
        position: "relative",
        border: "none",
        cursor: "pointer",
        transition: "background 0.25s ease",
        flexShrink: 0,
        boxShadow: on ? "0 0 0 3px rgba(198,168,79,0.16)" : "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 23 : 3,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
          transition: "left 0.25s cubic-bezier(0.16,1,0.3,1)",
          display: "block",
        }}
      />
    </button>
  );
}
