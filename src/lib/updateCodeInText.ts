// src/utils/updateMultipleEdits.ts
import * as BabelParser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export interface Edit {
  tag: string;
  index: number;
  text: string;
}

/**
 * Update a single JSX element's text content
 */
export function updateTextInCode(
  code: string,
  tag: string,
  index: number,
  newText: string
): string {
  const ast = BabelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  let occurrence = 0;

  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      const nameNode = opening.name;

      if (t.isJSXIdentifier(nameNode) && nameNode.name === tag) {
        if (occurrence === index) {
          // replace children with a single text node
          path.node.children = [t.jsxText(newText)];
          path.stop(); // done
        }
        occurrence++;
      }
    },
  });

  return generate(ast, { jsescOption: { quotes: "double" } }).code;
}

/**
 * Apply multiple edits one by one
 */
export function updateMultipleEdits(code: string, edits: Edit[]): string {
  let newCode = code;
  for (const e of edits) {
    newCode = updateTextInCode(newCode, e.tag, e.index, e.text);
  }
  return newCode;
}
