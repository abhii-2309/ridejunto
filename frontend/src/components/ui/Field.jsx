export function Field({ label, error, children, htmlFor }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-[#b6402d]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
