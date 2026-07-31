"use client";

interface Props {
    startDate: string;
    endDate: string;
    onStartChange: (value: string) => void;
    onEndChange: (value: string) => void;
}

export default function DateRangeFilter({
    startDate,
    endDate,
    onStartChange,
    onEndChange,
}: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
                <h3 className="font-semibold text-gray-800">
                    Filter by Date
                </h3>

                <p className="text-sm text-gray-500">
                    View attendance and leave records within a selected range.
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartChange(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndChange(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                />
            </div>
        </div>
    );
}