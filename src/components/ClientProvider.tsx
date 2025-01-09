// src/components/ClientProvider.tsx
"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default ClientProvider;
