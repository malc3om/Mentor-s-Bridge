import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4] brutalist-grid relative overflow-hidden font-mono">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[1px] h-full bg-[#d1d1d1] -z-10" />
            <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[1px] h-full bg-[#d1d1d1] -z-10" />

            <div className="z-10 bg-white p-2 border-4 border-[#111] shadow-[16px_16px_0px_#111] relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ff6a00]" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#111]" />
                <SignIn signUpUrl="/sign-up" forceRedirectUrl="/dashboard-router" />
            </div>
        </div>
    );
}
