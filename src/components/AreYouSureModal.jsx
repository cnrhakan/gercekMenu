import React from "react";

function AreYouSureModal({ question, onClick, setState }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm">
      <div className="bg-white/90 rounded-2xl shadow-xl p-12 w-full max-w-sm flex flex-col items-center">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {question}
        </h3>
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={onClick}
            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition w-full"
          >
            Evet
          </button>
          <button
            onClick={() => setState(false)}
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold transition w-full"
          >
            Hayır
          </button>
        </div>
      </div>
    </div>
  );
}

export default AreYouSureModal;
