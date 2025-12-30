import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-lg shadow-lg ${className}`}
    >
      {title && (
        <div className="border-b border-slate-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
