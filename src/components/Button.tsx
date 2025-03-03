import React from "react";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

export default Button;
