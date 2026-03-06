import React from "react";

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-3xl">
          shield
        </span>
        <span className="material-symbols-outlined text-secondary absolute text-sm bottom-0 right-0 fill-current">
          water_drop
        </span>
      </div>
      <span className="text-xl font-semibold tracking-tight uppercase">
        NeerKavach
      </span>
    </div>
  );
};

export default Logo;
