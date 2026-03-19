export function DevBadge() {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.07em",
        color: "var(--gold)",
        background: "var(--gold-faint)",
        border: "1px solid var(--gold-line)",
        padding: "3px 9px",
        borderRadius: 20,
        textTransform: "uppercase",
      }}
    >
      Devnet
    </span>
  );
}
