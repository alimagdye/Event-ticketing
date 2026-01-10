function ConfermNewsletter() {
    return ( 
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
            <div className="bg-green-200 p-8 rounded shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Subscription Confirmed!</h2>
                <p className="mb-6 font-medium text-lg">Thank you for subscribing to our newsletter. You will now receive the latest updates and events directly to your inbox.</p>
                <a href="/" className="text-white bg-green-800 px-4 py-2 rounded hover:bg-green-900">Go to Home</a>
            </div>
        </div>
     );
}

export default ConfermNewsletter;