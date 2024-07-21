// src/app/page.tsx
"use client";

import React, { useState } from "react";
import NavBar from "../components/NavBar";
import TextArea from "../components/TextArea";
import "../app/globals.css";

const Page: React.FC = () => {
  const [text, setText] = useState<string>("");

  return (
    <div className="App bg-gray-900 text-white min-h-screen">
      <NavBar />
      <div className="p-4">
        <TextArea setText={setText} />
      </div>
    </div>
  );
};

export default Page;
