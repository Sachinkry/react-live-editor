import * as BabelParser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

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
  let updated = false;

  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement.name;
      if (opening.type === "JSXIdentifier" && opening.name === tag.toLowerCase()) {
        if (occurrence === index) {
          // Filter and update only JSXText or JSXExpressionContainer with text
          path.node.children = path.node.children.map((child) => {
            if (t.isJSXText(child)) {
              return t.jsxText(newText);
            } else if (
              t.isJSXExpressionContainer(child) &&
              t.isStringLiteral(child.expression)
            ) {
              return t.jsxExpressionContainer(t.stringLiteral(newText));
            }
            return child; // Preserve non-text children
          });
          updated = true;
        }
        occurrence++;
      }
    },
  });

  if (!updated) {
    console.warn(`No matching ${tag} element found at index ${index}`);
    return code; // Return original code if no update was made
  }

  return generate(ast, { retainLines: true }).code;
}