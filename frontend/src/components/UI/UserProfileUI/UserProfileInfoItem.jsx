function UserProfileInfoItem({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>

      <div className="pl-4 text-base font-semibold text-slate-800">
        {children}
      </div>
    </div>
  );
}

export default UserProfileInfoItem;