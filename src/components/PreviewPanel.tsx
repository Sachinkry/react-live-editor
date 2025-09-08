import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useCode } from "../../contexts/code-context";
import EditorControls from "./editor-controls";
import { updateTextInCode } from "@/lib/updateCodeInText";
import { RefreshCcw } from "lucide-react";
import traverse from "@babel/traverse";
import * as BabelParser from "@babel/parser"

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
      let root = ReactDOM.createRoot(rootEl);

       function makeEditable() {
        // Select all elements under #root (except root itself)
        const nodes = document.querySelectorAll("#root *");

        // Maintain per-tag counters
        const counters = Object.create(null);

        nodes.forEach((el) => {
          const tag = el.tagName.toLowerCase();
          counters[tag] = (counters[tag] || 0) + 1;
          const index = counters[tag] - 1; // 0-based index

          el.setAttribute("data-tag", tag);
          el.setAttribute("data-tag-index", String(index));
          el.contentEditable = "true";

          el.addEventListener("input", () => {
            window.parent.postMessage(
              {
                type: "TEXT_EDIT",
                tag,
                index,
                text: el.innerText,
              },
              "*"
            );
          });
        });
      }

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
            root.render(React.createElement(Component)); 
          const observer = new MutationObserver(() => {
            makeEditable();
            observer.disconnect();
          });
        observer.observe(rootEl, { childList: true, subtree: true });
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
  const { code, setCode } = useCode();
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  // local state to hold preview edits (not committed to code yet)
  const [pendingEdits, setPendingEdits] = useState<
    { tag: string; text: string; index: number }[]
  >([]);

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

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data.type === "TEXT_EDIT") {
        const { tag, text, index } = event.data;
        console.log("tag/text/index::: ", tag, text, index)
  
        setPendingEdits((prev) => {
          const filtered = prev.filter(
            (e) => !(e.tag === tag && e.index === index)
          );
          return [...filtered, { tag, text, index }];
        });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setCode]);

   // apply edits to code string when Sync is clicked
   function handleSync() {
    let newCode = code;
    for (const edit of pendingEdits) {
      const { tag, index, text } = edit;
      // Validate tag and index
      const ast = BabelParser.parse(newCode, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });
      let count = 0;
      traverse(ast, {
        JSXElement(path) {
          const opening = path.node.openingElement.name;
          if (opening.type === "JSXIdentifier" && opening.name === tag.toLowerCase()) {
            count++;
          }
        },
      });
      if (index >= count) {
        console.warn(`Invalid index ${index} for tag ${tag}. Only ${count} elements found.`);
        continue;
      }
      try {
        newCode = updateTextInCode(newCode, tag, index, text);
      } catch (err) {
        console.error(`Failed to apply edit for ${tag} at index ${index}:`, err);
      }
    }
    setCode(newCode);
    setPendingEdits([]); // Clear buffer
    // Trigger preview update
    iframeRef.current?.contentWindow?.postMessage(newCode, "*");
  }

  return (
    <div className="flex-1 pr-4 h-screen overflow-y-auto pl-4">
      <div className="flex justify-between items-center py-2 mt-1">
        <h2 className="text-md text-neutral-200">Preview</h2>
        {pendingEdits.length > 0 && (
            <span onClick={handleSync} className="flex items-center cursor-pointer gap-1 text-xs bg-amber-600 rounded-md px-1 ">Sync<RefreshCcw className="h-3 w-3"></RefreshCcw></span>
           
          )}
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
