import React from 'react'

const Spinner = ({ size = 'h-6 w-6', color = 'text-gray-500', borderWidth = 'border-2', className = '' }) => {
  return (
    <div className={`animate-spin rounded-full ${borderWidth} border-t-transparent ${color} ${size} ${className}`}></div>
  );
};

export default function LoadingComponent({ size = "h-10 w-10", color = "border-gray-500", borderWidth = "border-4" }) {
  return (
    <div className="flex absolute m-auto left-0 right-0 top-0 bottom-0 z-50 items-center justify-center h-fit w-fit p-4 rounded-full">
      <Spinner
        size={size}
        color={color}
        borderWidth={borderWidth}
        className="items-center justify-center"
      />
    </div>
  )
}
