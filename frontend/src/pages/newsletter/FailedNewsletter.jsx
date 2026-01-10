function FailedNewsletter() {
    return ( 
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-100">
            <div className="bg-red-200 p-8 rounded shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Subscription Failed!</h2>
                <p className="mb-6 font-medium text-lg">An error occurred while subscribing to our newsletter. Please try again later.</p>
                <a href="/" className="text-white bg-red-800 px-4 py-2 rounded hover:bg-red-900">Go to Home</a>
            </div>
        </div>
     );
}

export default FailedNewsletter;