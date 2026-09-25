import { SectionIntro, FormField, EmptyState } from "./AdminComponents";
const AdminCategories = ({
  categories,
  categoryName,
  setCategoryName,
  categoryDescription,
  setCategoryDescription,
  creatingCategory,
  onCreate,
}) => {
  return (
    <div className="space-y-6">
      {" "}
      <SectionIntro
        title="Categories"
        description="Organize services into manageable categories."
        count={categories.length}
      />{" "}
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-5">
        {" "}
        <form
          onSubmit={onCreate}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {" "}
          <h3 className="text-lg font-bold text-[#08131f]">
            {" "}
            Create Category{" "}
          </h3>{" "}
          <div className="mt-5 space-y-4">
            {" "}
            <FormField
              label="Category Name"
              value={categoryName}
              onChange={setCategoryName}
              placeholder="e.g. Home Cleaning"
            />{" "}
            <FormField
              label="Description"
              value={categoryDescription}
              onChange={setCategoryDescription}
              placeholder="Describe this category"
              textarea
            />{" "}
            <button
              type="submit"
              disabled={creatingCategory}
              className="w-full rounded-2xl bg-[#0d1b2a] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#12283a] disabled:opacity-50 transition"
            >
              {" "}
              {creatingCategory ? "Creating..." : "Create Category"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {" "}
          <h3 className="text-lg font-bold text-[#08131f] mb-5">
            {" "}
            Existing Categories{" "}
          </h3>{" "}
          {categories.length === 0 ? (
            <EmptyState title="No categories found" />
          ) : (
            <div className="space-y-3">
              {" "}
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  {" "}
                  <div className="flex items-start justify-between gap-4">
                    {" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-slate-800">
                        {" "}
                        {category.name}{" "}
                      </h4>{" "}
                      <p className="text-sm text-slate-500 mt-1">
                        {" "}
                        {category.description || "No description"}{" "}
                      </p>{" "}
                    </div>{" "}
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${category.isActive === false ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
                    >
                      {" "}
                      {category.isActive === false ? "Inactive" : "Active"}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default AdminCategories;
