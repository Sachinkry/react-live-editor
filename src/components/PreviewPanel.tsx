import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useCode } from "../../contexts/code-context";
import EditorControls from "./editor-controls";

const iframeHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const rootEl = document.getElementById("root");
      window.addEventListener("message", (event) => {
        const code = event.data;
        try {
          const transpiled = Babel.transform(code, {
            presets: ["env", "react"],
          }).code;

          const module = { exports: {} };
          const func = new Function("module", "exports", "React", transpiled + "\\nreturn module.exports;");
          const exportsObj = func(module, module.exports, React);
          const Component = exportsObj.default || exportsObj;

          if (typeof Component === "function") {
            ReactDOM.createRoot(rootEl).render(React.createElement(Component));
          } else {
            rootEl.innerHTML = "<pre style='color:red'>No valid default export</pre>";
          }
        } catch (err) {
          rootEl.innerHTML = "<pre style='color:red'>Error: " + err.message + "</pre>";
        }
      });
    </script>
  </body>
</html>
`;

export type PreviewPanelHandle = {
  updatePreview: () => void;
};

const PreviewPanel = forwardRef<PreviewPanelHandle>((_, ref) => {
  const { code } = useCode();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Expose updatePreview to parent via ref
  useImperativeHandle(ref, () => ({
    updatePreview: () => {
      try {
        iframeRef.current?.contentWindow?.postMessage(code, "*");
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    },
  }));

  return (
    <div className="flex-1 pr-4 h-screen overflow-y-auto pl-4">
      <div className="flex justify-between items-center py-2 mt-1">
        <h2 className="text-md text-neutral-200">Preview</h2>
        <EditorControls />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {code ? (
        <div className="ring-1 ring-neutral-700 bg-neutral-100 rounded-md h-[70%]">
          <iframe
            ref={iframeRef}
            title="Preview"
            sandbox="allow-scripts"
            style={{ width: "100%", height: "100%", border: "none" }}
            srcDoc={iframeHTML}
          />
        </div>
      ) : (
        <div className="ring-1 ring-neutral-700 bg-neutral-900 rounded-md h-[70%] flex items-center justify-center">
          <p className="text-neutral-500">No code loaded</p>
        </div>
      )}
    </div>
  );
});

export default PreviewPanel;
