"use client";
import React from "react";
import { useHeaderActions } from "@/app/context/HeaderActionsContext";
import NotificationDrawer from "../notification/NotificationDrawer";
import UserDropdown from "./UserDropdown";
import HeaderActions from "./HeaderActions";

interface TopNavActionsProps {
    session: any;
}

export default function TopNavActions({ session }: TopNavActionsProps) {
    const { hideGlobalActions } = useHeaderActions();

    return (
        <div className="flex gap-3 items-center">
            <HeaderActions />
            {!hideGlobalActions && (
                <>
                    <NotificationDrawer />
                    <UserDropdown
                        imageSrc="https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100149.jpg?t=st=1753541121~exp=1753544721~hmac=97d073003530b562fde1ff78c4045722159b9f30825be2ed48e9d2acad9799f5&w=1380"
                        userName={session?.user?.name}
                        userRole={session?.user?.role[0]}
                    />
                </>
            )}
        </div>
    );
}
