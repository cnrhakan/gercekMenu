import React from "react";

function ValidateMessage({ message }) {
  return (
    <div className="text-red-500 text-sm pl-1 font-semibold">{message}</div>
  );
}

export default ValidateMessage;
