// src/pages/test.tsx
import React from "react";
import ToastTest from "@/components/ToastTest";
import { Toaster } from "@/components/ui/toaster";

// export default function TestPage() {
//   return (

//   );
// }

// src/components/YourComponent.tsx

const YourComponent: React.FC = () => {
  return (
    <div>
      <h2>This is YourComponent</h2>
      <>
        <ToastTest />
        <Toaster /> {/* Ensure Toaster is included to render toasts */}
      </>
    </div>
  );
};

export default YourComponent;
