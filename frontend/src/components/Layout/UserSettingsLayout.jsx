function UserSettings({ title, description, children }) {
  return (
    <div className="flex-1 flex flex-col justify-center gap-8 max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
        <p className="text-slate-500">{description}</p>
      </div>

      {children}

    </div>
  );
}

export default UserSettings;