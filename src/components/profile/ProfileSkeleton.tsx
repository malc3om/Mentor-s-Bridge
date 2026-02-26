export default function ProfileSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse brutalist-grid min-h-screen">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="h-16 bg-neutral-200 rounded-none border-2 border-black w-3/4 md:w-1/2 mx-auto mb-4"></div>
                <div className="h-6 bg-neutral-200 w-1/3 mx-auto border-2 border-black"></div>
            </div>

            {/* Summary Card */}
            <div className="mb-8 p-8 bg-neutral-200 border-4 border-black h-80 box-shadow-[8px_8px_0px_#111]"></div>

            {/* Two columns */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-neutral-200 border-4 border-black h-64 box-shadow-[8px_8px_0px_#111]"></div>
                <div className="bg-neutral-200 border-4 border-black h-64 box-shadow-[8px_8px_0px_#111]"></div>
            </div>

            {/* Full width */}
            <div className="bg-neutral-200 border-4 border-black h-48 mb-8 box-shadow-[8px_8px_0px_#111]"></div>
            <div className="bg-neutral-200 border-4 border-black h-64 mb-8 box-shadow-[8px_8px_0px_#111]"></div>
        </div>
    );
}
