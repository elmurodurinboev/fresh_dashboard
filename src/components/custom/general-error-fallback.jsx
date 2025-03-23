export function GeneralErrorFallback({error, resetErrorBoundary}) {
    return (
        <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-300">
            <p><strong>Something went wrong:</strong> {error.message}</p>
            <button
                onClick={resetErrorBoundary}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
            >
                Try Again
            </button>
        </div>
    );
}
