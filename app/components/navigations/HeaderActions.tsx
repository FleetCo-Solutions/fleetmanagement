"use client";
import { useHeaderActions } from "@/app/context/HeaderActionsContext";

export default function HeaderActions() {
    const { headerActions } = useHeaderActions();

    return (
        <div className="flex items-center gap-3">
            {headerActions}
        </div>
    );
}
