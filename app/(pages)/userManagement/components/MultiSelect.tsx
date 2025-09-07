"use client";
import React, { useState } from "react";

// Generic Multi-Select Component
interface MultiSelectOption {
  id: number;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: number[];
  onSelectionChange: (values: number[]) => void;
  error?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  error = false,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  label,
  required = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (optionId: number) => {
    if (selectedValues.includes(optionId)) {
      onSelectionChange(selectedValues.filter((id) => id !== optionId));
    } else {
      onSelectionChange([...selectedValues, optionId]);
    }
  };

  const removeOption = (optionId: number) => {
    onSelectionChange(selectedValues.filter((id) => id !== optionId));
  };

  const getSelectedOptionNames = () => {
    return selectedValues
      .map((id) => options.find((option) => option.id === id)?.name)
      .filter(Boolean);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-black mb-1">
          {label} {required && "*"}
        </label>
      )}

      {/* Selected Options Display */}
      <div
        className={`w-full px-3 py-2 border rounded-md cursor-pointer focus:ring-0 outline-none text-black min-h-[42px] flex flex-wrap gap-1 items-center ${
          error ? "border-red-500" : "border-gray-300"
        } ${isOpen ? "ring-2 ring-[#004953] border-[#004953]" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {getSelectedOptionNames().map((optionName, index) => {
              const optionId = selectedValues[index];
              return (
                <span
                  key={optionId}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#004953] text-white"
                >
                  {optionName}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(optionId);
                    }}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-white hover:bg-opacity-20"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        )}
        <div className="ml-auto">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004953] focus:border-transparent outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleOption(option.id)}
                >
                  <span className="text-sm text-gray-900">{option.name}</span>
                  {selectedValues.includes(option.id) && (
                    <svg className="w-4 h-4 text-[#004953]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer with selected count */}
          {selectedValues.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
              {selectedValues.length} option{selectedValues.length !== 1 ? "s" : ""} selected
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MultiSelect;


