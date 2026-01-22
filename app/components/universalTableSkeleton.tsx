'use client'
import React from 'react'

// Skeleton shimmer animation component
export const SkeletonShimmer = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
)

// Props for the skeleton table
interface UniversalTableSkeletonProps {
  title?: string
  showSearch?: boolean
  showFilters?: boolean
  showChildren?: boolean
  rows?: number
  columns?: number
  showPagination?: boolean
  className?: string
}

export default function UniversalTableSkeleton({
  title,
  showSearch = true,
  showFilters = true,
  showChildren = true,
  rows = 5,
  columns = 4,
  showPagination = true,
  className = ""
}: UniversalTableSkeletonProps) {
  return (
    <div className={`bg-white border border-black/20 rounded-xl p-6 ${className}`}>
      {/* Header Skeleton */}
      {(title || showSearch || showFilters || showChildren) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Title Skeleton */}
            {title && (
              <SkeletonShimmer className="h-7 w-48" />
            )}
            
            {/* Search and Filters Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              {showSearch && (
                <SkeletonShimmer className="h-10 w-48" />
              )}
              
              {showFilters && (
                <SkeletonShimmer className="h-10 w-36" />
              )}
            </div>
          </div>
          
          {/* Children (buttons) Skeleton */}
          {showChildren && (
            <div className="flex gap-3">
              <SkeletonShimmer className="h-10 w-24" />
              <SkeletonShimmer className="h-10 w-20" />
            </div>
          )}
        </div>
      )}

      {/* Table Skeleton */}
      <div className="rounded-md border border-black/20">
        <table className="min-w-full divide-y divide-gray-300">
          {/* Table Header Skeleton */}
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-3 py-3.5 text-left">
                  <SkeletonShimmer className="h-5 w-20" />
                </th>
              ))}
              {/* Actions column skeleton */}
              <th className="px-3 py-3.5 text-left">
                <SkeletonShimmer className="h-5 w-16" />
              </th>
            </tr>
          </thead>
          
          {/* Table Body Skeleton */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="whitespace-nowrap px-3 py-4">
                    <SkeletonShimmer className="h-4 w-24" />
                  </td>
                ))}
                {/* Actions column skeleton */}
                <td className="whitespace-nowrap px-3 py-4">
                  <div className="flex gap-2">
                    <SkeletonShimmer className="h-6 w-12" />
                    <SkeletonShimmer className="h-6 w-12" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between gap-2 mt-4">
          {/* Pagination buttons skeleton */}
          <div className="flex items-center gap-2">
            <SkeletonShimmer className="h-8 w-8" />
            <SkeletonShimmer className="h-8 w-8" />
            <SkeletonShimmer className="h-8 w-8" />
            <SkeletonShimmer className="h-8 w-8" />
            <SkeletonShimmer className="h-5 w-24" />
          </div>

          {/* Results count skeleton */}
          <div className="text-sm">
            <SkeletonShimmer className="h-4 w-32" />
          </div>
          
          {/* Page size selector skeleton */}
          <SkeletonShimmer className="h-8 w-20" />
        </div>
      )}
    </div>
  )
}

// // Usage example component
// export function UniversalTableSkeletonExample() {
//   return (
//     <div className="p-6 space-y-6">
//       {/* Default skeleton */}
//       <UniversalTableSkeleton 
//         title="Loading Table..."
//         rows={3}
//         columns={5}
//       />
      
//       {/* Minimal skeleton */}
//       <UniversalTableSkeleton 
//         showSearch={false}
//         showFilters={false}
//         showChildren={false}
//         showPagination={false}
//         rows={2}
//         columns={3}
//       />
      
//       {/* Large skeleton */}
//       <UniversalTableSkeleton 
//         title="Large Dataset Loading..."
//         rows={8}
//         columns={6}
//       />
//     </div>
//   )
// }