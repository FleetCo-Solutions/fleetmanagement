"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";

const FleetMap = dynamic(() => import("./FleetMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Loading Map...</div>
    </div>
  ),
});

interface AssetMapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssetMapDrawer: React.FC<AssetMapDrawerProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity h-[100vh]"
          onClick={onClose}
        />
      )}

      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] lg:w-[60%] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Fleet Map</h2>
              <p className="text-sm text-gray-500">
                Real-time vehicle locations
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Map Content */}
          <div className="flex-1 relative">{isOpen && <FleetMap />}</div>
        </div>
      </div>
    </>
  );
};

export default AssetMapDrawer;
