"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="mb-0 px-4 text-center text-gray-500 w-full bg-white fixed bottom-0">
      <small className="mb-2 block text-xs">
        &copy; 2024 ganjinfu. All rights reserved.
      </small>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS,
        andVercel hosting.
      </p>
    </footer>
  );
}
