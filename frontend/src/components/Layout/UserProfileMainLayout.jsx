function UserProfileMainLayout({ children }) {
  return (
    <main className="flex-1 max-w-5xl m-auto py-10 drop-shadow-lg">
      {children}
    </main>
  );
}

export default UserProfileMainLayout;