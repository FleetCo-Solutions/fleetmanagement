"use client";

import React, { useState } from "react";
import AssetMapDrawer from "./AssetMapDrawer";

export default function AssetHeaderActions() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors"
      >
        On Map
      </button>
      <AssetMapDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
