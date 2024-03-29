import React, { useState, useEffect } from "react";

export default function Modal({ open, onClose, children }) {
  return(
    <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/50" : "invisible" }`}>
        <div className={`bg-white rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity" : "scale-125 opacity-100"}`}>
          <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover: bg-gray-50 hover:text-gray-600">
            <p>x</p>
        </button>
          {children}
        </div>
    </div>
  )
}
