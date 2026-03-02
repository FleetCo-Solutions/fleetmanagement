"use client";
import { useHeaderActions } from "@/app/context/HeaderActionsContext";

export default function TopSubTabs() {
    const { subTabs } = useHeaderActions();

    if (!subTabs) return null;

    return (
        <div className="flex items-center px-9 bg-white border-t border-black/5 h-[6vh] transition-all">
            {subTabs}
        </div>
    );
}
