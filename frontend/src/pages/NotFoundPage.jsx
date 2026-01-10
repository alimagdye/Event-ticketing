
function NotFoundPage() {
    return ( 
        
                <div className="w-full flex flex-col items-center justify-center min-h-140 h-full">
            {/* icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-4xl font-bold mb-6  ">Page Not Founded</h1>
            <p className="text-2xl text-center">there is no such page. or maybe you are lost</p>
            <botton className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all" onClick={() => window.location.href = "/"}>
                Go Back Home
            </botton>

        </div>

     );
}

export default NotFoundPage;