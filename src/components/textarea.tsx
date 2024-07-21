// src/components/TextArea.tsx
"use client";

import React, { useState } from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps {
  setText: (text: string) => void;
}

const TextArea: React.FC<TextAreaProps> = ({ setText }) => {
  const [text, setTextState] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextState(newText);
    setText(newText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied" text after 2 seconds
  };

  return (
    <div className={styles.textAreaContainer}>
      <div className={styles.topBar}>
        <span>Words: {text.split(/\s+/).filter(Boolean).length}</span>
        <button onClick={handleCopy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <textarea
        className={styles.typingArea}
        value={text}
        onChange={handleTextChange}
        placeholder="Start typing..."
      />
    </div>
  );
};

export default TextArea;
