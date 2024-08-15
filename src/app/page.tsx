// src/app/page.tsx
"use client";

import React, { useState } from "react";
import NavBar from "../components/NavBar";
import TextArea from "../components/TextArea";
import "../app/globals.css";

import styles from './textarea.module.css'; // Ensure this is at the top of your component file

// The rest of your TextArea component code...

const Page: React.FC = () => {
  const [text, setText] = useState<string>("");

  return (
    <div className="App bg-gray-900 text-white min-h-screen">
      <NavBar />
      <div className="p-4 w-4/5">
        <TextArea setText={setText} />
      </div>
    </div>
  );
};

export default Page;
