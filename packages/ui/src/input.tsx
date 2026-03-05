//good input 
import React from "react";

export function Input({ type, placeholder, value, onChange }: { type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }):React.ReactElement {   
  return (  

    <input
      className="text-black h-10 w-full p-4"
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
} 