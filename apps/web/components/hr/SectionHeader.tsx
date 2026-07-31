"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export default function SectionHeader({
    title,
    subtitle,
}: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
        >
            <h2 className="text-3xl font-bold text-slate-900">
                {title}
            </h2>

            {subtitle && (
                <p className="mt-2 text-slate-500">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}