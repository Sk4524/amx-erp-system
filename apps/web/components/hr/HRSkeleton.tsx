"use client";

export default function HRSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">

            {/* Hero */}
            <div className="h-44 rounded-[36px] bg-slate-200" />

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="h-36 rounded-[30px] bg-slate-200"
                    />
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-96 rounded-[30px] bg-slate-200"
                    />
                ))}
            </div>

            {/* AI Insights */}
            <div className="h-72 rounded-[36px] bg-slate-200" />

            {/* Form */}
            <div className="h-80 rounded-[36px] bg-slate-200" />

            {/* Tables */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-[500px] rounded-[36px] bg-slate-200" />
                <div className="h-[500px] rounded-[36px] bg-slate-200" />
            </div>

        </div>
    );
}