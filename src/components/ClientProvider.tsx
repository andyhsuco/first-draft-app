// src/components/ClientProvider.tsx
"use client";

import React from "react";
import { Toaster } from "@/components/ui/use-toast"; // Ensure correct import

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children} {/* Render children components */}
      <Toaster /> {/* Include the Toaster component for toast notifications */}
    </>
  );
};

export default ClientProvider;
