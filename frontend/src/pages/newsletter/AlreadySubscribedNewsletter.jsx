function AlreadySubscribedNewsletter() {
    return ( 
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
            <div className="bg-blue-200 p-8 rounded shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Already Subscribed</h2>
                <p className="mb-6 font-medium text-lg">You have already subscribed to our newsletter.</p>
                <a href="/" className="text-white bg-blue-800 px-4 py-2 rounded hover:bg-blue-900">Go to Home</a>
            </div>
        </div>
     );
}

export default AlreadySubscribedNewsletter;