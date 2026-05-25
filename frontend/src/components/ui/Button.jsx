export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-mint text-white hover:bg-[#0b8365] focus-visible:ring-mint",
    secondary:
      "bg-white text-ink border border-ink/10 hover:bg-skywash focus-visible:ring-mint",
    danger:
      "bg-coral text-white hover:bg-[#d4553c] focus-visible:ring-coral",
    ghost:
      "bg-transparent text-ink hover:bg-white/70 focus-visible:ring-mint"
  };

  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
