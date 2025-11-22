function AuthHeaderSection({title, content}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold leading-tight ">
        {title}
      </h1>
      <p className=" mt-2">
        {content}
      </p>
    </div>
  );
}

export default AuthHeaderSection;
