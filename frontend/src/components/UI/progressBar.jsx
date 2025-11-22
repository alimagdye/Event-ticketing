function ProgressBar({step}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-500 ">{step==='Complete'? "Complete!" : `Step ${step} of 3`}</p>
      <div className="w-full h-2 rounded-full mt-2 bg-gray-200">
        <div className={`bg-primary h-2 rounded-full transition-all duration-600` }style={{width: `${33*step}%`}}></div>
      </div>
    </div>
  );
}

export default ProgressBar;
