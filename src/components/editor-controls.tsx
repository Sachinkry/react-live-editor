import React, { useState, useEffect } from "react";
import { useCode } from "../../contexts/code-context";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandItem } from "./ui/command";
import ColorPicker from "./color-picker";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { Badge } from "./ui/badge";

const EditorControls: React.FC = () => {
    
  const [selectedHeading, setSelectedHeading] = useState("32px");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);

  const headingOptions = [
    { value: "32px", label: "H1" },
    { value: "24px", label: "H2" },
    { value: "18px", label: "H3" },
    { value: "16px", label: "H4" },
  ];

//   useEffect(() => {
//     const updateCode = `
//       const Component = () => (
//         <${selectedHeading} style={{ 
//           backgroundColor: "${bgColor}", 
//           color: "${textColor}", 
//           fontSize: "${fontSize}px", 
//           fontWeight: ${isBold ? "bold" : "normal"}
//         }}>
//           Preview Text
//         </${selectedHeading}>
//       );
//       export default Component;
//     `;
//     setCode(updateCode);
//   }, [selectedHeading, bgColor, textColor, fontSize, isBold, setCode]);

  return (
    <div className="flex items-center space-x-2 text-sm ">
      <Popover>
        <PopoverTrigger asChild>
          <Badge
            variant="outline"
            className=" text-xs cursor-pointer justify-between bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
          >
            {headingOptions.find(h => h.value === selectedHeading)?.label || "Select Heading"}
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-[100px] p-0 bg-neutral-800 border-neutral-700">
          <Command className="bg-neutral-800">
            <CommandGroup>
              {headingOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {}}
                  className="text-white hover:bg-neutral-700 cursor-pointer text-xs"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Badge className="text-xs cursor-pointer bg-neutral-800 hover:bg-neutral-700" variant="outline">BG Color</Badge>
        </PopoverTrigger>
        <PopoverContent>
          <ColorPicker value={bgColor} onChange={setBgColor} />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Badge className="text-xs cursor-pointer bg-neutral-800 hover:bg-neutral-700" variant="outline">Text Color</Badge>
        </PopoverTrigger>
        <PopoverContent>
          <ColorPicker value={textColor} onChange={setTextColor} />
        </PopoverContent>
      </Popover>
      <Badge
        variant="outline"
        onClick={() => setIsBold(!isBold)}
        className={isBold ? "text-purple-500 bg-purple-500/40 cursor-pointer ring-1 ring-purple-600" : "cursor-pointer text-white bg-neutral-800 hover:bg-neutral-700"}
      >
        Bold
      </Badge>
      <input
        type="number"
        value={fontSize}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        min="8"
        max="72"
        className="w-16 p-1 text-xs bg-neutral-800 text-white border hover:bg-neutral-700 border-neutral-700 rounded-md"
      />
      
    </div>
  );
};

export default EditorControls;