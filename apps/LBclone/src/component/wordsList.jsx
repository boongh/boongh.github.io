import { cn } from "../cn.jsx"
import SingleWordHighlight from "./singleWord.jsx";

const WordList = ({wordArray}) => {
    wordArray = wordArray || [];
    return <div>
        <h2 className="text-2xl font-bold text-center text-white mb-4">Words List</h2>
        <div className = {cn(
            "flex w-screen max-w-[400px] flex-row flex-wrap gap-2 max-h-[150px] p-4",
            "bg-black/5 rounded-2xl",
            "font-bold text-white",
            "lg:max-h-none "
        )}>
            {wordArray.map((word, index) => {
                return <div className="flex flex-row items-center" key={index}>
                    <SingleWordHighlight word = {word} index = {index} total = {wordArray.length} 
                    textFormat={
                        cn("text-white text-md font-bold text-white",
                        "text-xs md:text-xl lg:text-2xl")
                    }
                    highlightFormat={
                        cn("text-pink-500")
                    }
                    />
                    {index <= wordArray.length - 2 && <p>&nbsp; —</p>}
                </div>
            })}
        </div>
    </div>
}

export default WordList;