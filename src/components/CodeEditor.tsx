import { Textarea } from "@/components/ui/textarea"
import { useCode } from "../../contexts/code-context"

const EditorPanel = () => {
    const {code, setCode} = useCode()
  return (
    <div className="w-1/2 min-w-sm py-2 pl-4 h-screen overflow-y-auto">
      <div className="flex justify-between items-center py-2 ">
        <h2 className="text-md  text-neutral-200">Code</h2>
      </div>
      <Textarea
        placeholder="Paste your React component JSX here..."
        value={code}
        className="w-full max-h-screen h-[70%] mb-4 pr-1"
        onChange={(e) => {
            setCode(e.target.value)
        }}
      />
      
    </div>
  )
}

export default EditorPanel