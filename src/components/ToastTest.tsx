// src/components/ToastTest.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ToastTest: React.FC = () => {
  const { toast } = useToast();

  return (
    <div>
      <Button
        onClick={() => {
          toast({ description: "Test Toast Message" });
          console.log("Test Toast button clicked");
        }}
        className="p-2 bg-blue-600 text-white"
      >
        Test Toast
      </Button>
    </div>
  );
};

export default ToastTest;
