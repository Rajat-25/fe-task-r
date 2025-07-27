"use client";
import React from "react";

const SkeletonItem = () => (
  <div className="flex items-center justify-between pt-4 first:pt-0">
    <div>
      <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
  </div>
);

const Skeleton = () => {
  return (
    <div
      role="status"
      className="max-w-full h-screen animate-pulse space-y-4 divide-y divide-gray-200 rounded-sm border border-gray-200 p-4 shadow-sm md:p-6 dark:divide-gray-700 dark:border-gray-700"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;
