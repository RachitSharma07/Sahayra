function Card({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      )}

      <div>{children}</div>
    </div>
  );
}

export default Card;
