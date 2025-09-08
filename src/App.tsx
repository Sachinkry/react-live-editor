import EditorPanel from "./components/CodeEditor";
import PreviewPanel, { type PreviewPanelHandle } from "./components/PreviewPanel";
import { ThemeProvider } from "./components/theme-provider";
import { Separator } from "./components/ui/separator";
import { CodeProvider } from "../contexts/code-context";
import { Button } from "./components/ui/button";
import React, { useRef } from "react";

function App() {
  const previewRef = useRef<PreviewPanelHandle>(null);

  const handleUpdatePreview = () => {
    previewRef.current?.updatePreview();
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CodeProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex justify-between items-center px-4">
            <h1 className="text-2xl font-bold px-4 py-4 text-neutral-100">
              React Component Renderer
            </h1>
            <div className="flex items-center gap-2">
              <Button
                className="bg-rose-500/40 text-white hover:bg-rose-500/50  ring-rose-800 ring-1 cursor-pointer"
                variant="default"
                onClick={handleUpdatePreview}
              >
                Update Preview
              </Button>
              <Button className="cursor-pointer" variant="default">
                Share Link
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row">
            <EditorPanel />
            <PreviewPanel ref={previewRef} />
          </div>
        </div>
      </CodeProvider>
    </ThemeProvider>
  );
}

export default App;
