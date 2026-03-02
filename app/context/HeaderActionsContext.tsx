"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeaderActionsContextType {
    headerActions: ReactNode | null;
    setHeaderActions: (actions: ReactNode | null) => void;
    titleOverride: string | null;
    setTitleOverride: (title: string | null) => void;
    statusBadge: ReactNode | null;
    setStatusBadge: (badge: ReactNode | null) => void;
    subTabs: ReactNode | null;
    setSubTabs: (tabs: ReactNode | null) => void;
    hideGlobalActions: boolean;
    setHideGlobalActions: (hide: boolean) => void;
}

const HeaderActionsContext = createContext<HeaderActionsContextType | undefined>(undefined);

export const HeaderActionsProvider = ({ children }: { children: ReactNode }) => {
    const [headerActions, setHeaderActions] = useState<ReactNode | null>(null);
    const [titleOverride, setTitleOverride] = useState<string | null>(null);
    const [statusBadge, setStatusBadge] = useState<ReactNode | null>(null);
    const [subTabs, setSubTabs] = useState<ReactNode | null>(null);
    const [hideGlobalActions, setHideGlobalActions] = useState<boolean>(false);

    return (
        <HeaderActionsContext.Provider
            value={{
                headerActions,
                setHeaderActions,
                titleOverride,
                setTitleOverride,
                statusBadge,
                setStatusBadge,
                subTabs,
                setSubTabs,
                hideGlobalActions,
                setHideGlobalActions,
            }}
        >
            {children}
        </HeaderActionsContext.Provider>
    );
};

export const useHeaderActions = () => {
    const context = useContext(HeaderActionsContext);
    if (context === undefined) {
        throw new Error("useHeaderActions must be used within a HeaderActionsProvider");
    }
    return context;
};
