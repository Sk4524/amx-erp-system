"use client";

interface Props {
    search: string;
    onSearchChange: (value: string) => void;

    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
}

export default function HRFilterToolbar({
    search,
    onSearchChange,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: Props) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <input
                    type="text"
                    placeholder="Search employee, department or status..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="border rounded-xl px-4 py-3"
                />

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="border rounded-xl px-4 py-3"
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="border rounded-xl px-4 py-3"
                />

            </div>
        </div>
    );
}