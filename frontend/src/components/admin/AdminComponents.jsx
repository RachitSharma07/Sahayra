import { SearchIcon } from "./AdminIcons";
export const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div className="w-11 h-11 rounded-2xl bg-[#e8f8f7] text-[#0f766e] flex items-center justify-center">
          {" "}
          {icon}{" "}
        </div>{" "}
      </div>{" "}
      <p className="text-sm text-slate-500 mt-5">{title}</p>{" "}
      <p className="text-2xl font-bold text-[#08131f] mt-1">{value}</p>{" "}
    </div>
  );
};
export const OverviewCard = ({ title, children }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {" "}
      <h3 className="text-lg font-bold text-[#08131f] mb-5">{title}</h3>{" "}
      <div>{children}</div>{" "}
    </div>
  );
};
export const OverviewRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      {" "}
      <span className="text-sm text-slate-500">{label}</span>{" "}
      <span className="text-sm font-bold text-slate-800">{value}</span>{" "}
    </div>
  );
};
export const SectionIntro = ({ title, description, count }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      {" "}
      <div>
        {" "}
        <h2 className="text-2xl font-bold text-[#08131f]">{title}</h2>{" "}
        <p className="text-sm text-slate-500 mt-1">{description}</p>{" "}
      </div>{" "}
      {typeof count === "number" && (
        <span className="rounded-full bg-[#e8f8f7] px-4 py-2 text-xs font-bold text-[#0f766e]">
          {" "}
          {count} records{" "}
        </span>
      )}{" "}
    </div>
  );
};
export const FilterSelect = ({ value, onChange, options }) => {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/10"
    >
      {" "}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {" "}
          {option.label}{" "}
        </option>
      ))}{" "}
    </select>
  );
};
export const FormField = ({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
}) => {
  return (
    <label className="block">
      {" "}
      <span className="block text-sm font-semibold text-slate-700 mb-2">
        {" "}
        {label}{" "}
      </span>{" "}
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none resize-none focus:border-[#22d3ee] focus:bg-white focus:ring-4 focus:ring-[#22d3ee]/10"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#22d3ee] focus:bg-white focus:ring-4 focus:ring-[#22d3ee]/10"
        />
      )}{" "}
    </label>
  );
};
export const ViewButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#22d3ee] hover:text-[#0f766e] transition"
    >
      {" "}
      View{" "}
    </button>
  );
};
export const Avatar = ({ name }) => {
  return (
    <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#22d3ee] to-[#14b8a6] text-[#08131f] flex items-center justify-center font-bold">
      {" "}
      {(name || "U").charAt(0).toUpperCase()}{" "}
    </div>
  );
};
export const DetailBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      {" "}
      <p className="text-xs uppercase tracking-wider text-slate-400">
        {" "}
        {label}{" "}
      </p>{" "}
      <p className="text-sm font-semibold text-slate-800 mt-2 break-words">
        {" "}
        {value || "Not available"}{" "}
      </p>{" "}
    </div>
  );
};
export const ManagementTable = ({ headers, children }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {" "}
      <div className="overflow-x-auto">
        {" "}
        <table className="w-full min-w-[900px] text-left">
          {" "}
          <thead className="bg-slate-50">
            {" "}
            <tr>
              {" "}
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-400"
                >
                  {" "}
                  {header}{" "}
                </th>
              ))}{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>{children}</tbody>{" "}
        </table>{" "}
      </div>{" "}
    </div>
  );
};
export const TableHeader = ({ children }) => {
  return (
    <th className="px-5 py-4 text-xs uppercase tracking-wider font-bold text-slate-400">
      {" "}
      {children}{" "}
    </th>
  );
};
export const LoadingRows = ({ count = 5 }) => {
  return (
    <>
      {" "}
      {Array.from({ length: count }).map((_, index) => (
        <tr key={index} className="border-t border-slate-100">
          {" "}
          <td colSpan="10" className="px-5 py-5">
            {" "}
            <div className="h-5 rounded-lg bg-slate-100 animate-pulse" />{" "}
          </td>{" "}
        </tr>
      ))}{" "}
    </>
  );
};
export const EmptyState = ({ title = "No records found" }) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      {" "}
      <div className="w-14 h-14 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center">
        {" "}
        <SearchIcon className="text-slate-400" />{" "}
      </div>{" "}
      <h3 className="font-bold text-slate-800 mt-4">{title}</h3>{" "}
      <p className="text-sm text-slate-500 mt-1">
        {" "}
        There is nothing to display here yet.{" "}
      </p>{" "}
    </div>
  );
};
