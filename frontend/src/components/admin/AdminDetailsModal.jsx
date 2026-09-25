import { DetailBox } from "./AdminComponents";
const AdminDetailsModal = ({ item, type, onClose }) => {
  const renderUser = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {" "}
      <DetailBox label="Name" value={item.name} />{" "}
      <DetailBox label="Email" value={item.email} />{" "}
      <DetailBox label="Role" value={item.role} />{" "}
      <DetailBox
        label="Status"
        value={item.isActive === false ? "Inactive" : "Active"}
      />{" "}
      <DetailBox label="Created At" value={item.createdAt} />{" "}
    </div>
  );
  const renderProvider = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {" "}
      <DetailBox label="Name" value={item.user?.name} />{" "}
      <DetailBox label="Email" value={item.user?.email} />{" "}
      <DetailBox label="Location" value={item.location} />{" "}
      <DetailBox label="Experience" value={`${item.experience || 0} years`} />{" "}
      <DetailBox label="Verification" value={item.verificationStatus} />{" "}
      <DetailBox
        label="Skills"
        value={
          Array.isArray(item.skills) ? item.skills.join(", ") : item.skills
        }
      />{" "}
      <DetailBox
        label="Availability"
        value={
          typeof item.availability === "object"
            ? JSON.stringify(item.availability)
            : item.availability
        }
      />{" "}
    </div>
  );
  const renderService = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {" "}
      <DetailBox label="Name" value={item.name} />{" "}
      <DetailBox label="Category" value={item.category?.name} />{" "}
      <DetailBox
        label="Price"
        value={`₹${Number(item.price || 0).toLocaleString("en-IN")}`}
      />{" "}
      <DetailBox label="Duration" value={`${item.duration || 0} minutes`} />{" "}
      <DetailBox
        label="Status"
        value={item.isActive === false ? "Inactive" : "Active"}
      />{" "}
      <DetailBox
        label="Provider"
        value={item.provider?.user?.name || item.provider?.name}
      />{" "}
      <div className="sm:col-span-2">
        {" "}
        <DetailBox
          label="Description"
          value={item.description || "No description"}
        />{" "}
      </div>{" "}
    </div>
  );
  const renderBooking = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {" "}
      <DetailBox label="Customer" value={item.customer?.name} />{" "}
      <DetailBox label="Customer Email" value={item.customer?.email} />{" "}
      <DetailBox label="Provider" value={item.provider?.user?.name} />{" "}
      <DetailBox label="Service" value={item.service?.name} />{" "}
      <DetailBox
        label="Booking Date"
        value={
          item.bookingDate
            ? new Date(item.bookingDate).toLocaleString("en-IN")
            : "N/A"
        }
      />{" "}
      <DetailBox
        label="Amount"
        value={`₹${Number(item.amount || 0).toLocaleString("en-IN")}`}
      />{" "}
      <DetailBox label="Status" value={item.status} />{" "}
      <DetailBox label="Payment Status" value={item.paymentStatus} />{" "}
    </div>
  );
  const titles = {
    user: "User Details",
    provider: "Provider Details",
    service: "Service Details",
    booking: "Booking Details",
  };
  return (
    <div
      className="fixed inset-0 z-50 bg-[#08131f]/70 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {" "}
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        {" "}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          {" "}
          <div>
            {" "}
            <p className="text-xs uppercase tracking-[0.18em] text-[#0f766e] font-bold">
              {" "}
              ServiceHub Admin{" "}
            </p>{" "}
            <h2 className="text-xl font-bold text-[#08131f] mt-1">
              {" "}
              {titles[type] || "Details"}{" "}
            </h2>{" "}
          </div>{" "}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition text-xl"
          >
            {" "}
            ×{" "}
          </button>{" "}
        </div>{" "}
        <div className="p-6">
          {" "}
          {type === "user" && renderUser()}{" "}
          {type === "provider" && renderProvider()}{" "}
          {type === "service" && renderService()}{" "}
          {type === "booking" && renderBooking()}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default AdminDetailsModal;
