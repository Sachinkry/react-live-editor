"use client"
import { createContext, useContext, useState, type ReactNode } from "react"


// 1. Define context type
type CodeContextType = {
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>;
  selectedElement: { tag: string; index: number } | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<{ tag: string; index: number } | null>>;
  editorStyles: {
    fontSize: number;
    color: string;
    backgroundColor: string;
    fontWeight: boolean;
    tag: string;
  } | null;
  setEditorStyles: React.Dispatch<React.SetStateAction<CodeContextType["editorStyles"]>>;
}

// 2. Create context
const CodeContext = createContext<CodeContextType | undefined>(undefined)


const defaultCode = `
export default function Component() {
  const [count, setCount] = React.useState(0)
  return (
    <div style={{fontFamily:'sans-serif', padding: 16}}>
      <h1 style={{margin: 0, marginBottom: 12}}>Hello Renderer 👋</h1>
      <p style={{margin: 0, marginBottom: 12}}>A basic React component preview with shareable link.</p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          background: '#2563eb',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        Clicked {count} times
      </button>
    </div>
  )
}
`;

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState(defaultCode);
  const [selectedElement, setSelectedElement] = useState<{ tag: string; index: number } | null>(null);
  const [editorStyles, setEditorStyles] = useState<CodeContextType["editorStyles"]>(null);


  return (
    <CodeContext.Provider value={{ code, setCode, selectedElement, setSelectedElement, editorStyles, setEditorStyles }}>
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) throw new Error("useCode must be used within a CodeProvider");
  return context;
};
