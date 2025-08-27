import { cn } from "../cn";

const InputField = ({
  OnRefresh,
  textFieldValue,
  onReset, 
  onSubmit,
  OnChange
}) => {
  const classNameButton = cn(
            "bg-white rounded-2xl m-2",
            "focus:outline-none px-4 py-2 text-[#ffadc1]",
            "border-b-white border-b-2 font-bold",
            "hover:bg-gray-200 duration-50",
            "w-[80px] h-[30px] text-xs",
            "md:w-[120px] md:h-[50px] md:text-lg"
          )

  return <>
    <div className="flex flex-col items-center justify-center">

      <input type="text" placeholder="Enter word here" className={cn(
        "bg-[#ffadc1] rounded-2xl",
        "focus:outline-none pl-4 text-white duration-50",
        "border-b-white border-b-2 font-bold",
        "w-[300px] h-[50px] text-xs",
        "md:w-[350px] md:h-[60px] md:text-2xl",
        "lg:w-[400px]"
      )}
      value = {textFieldValue}
      onChange = {(e) => {OnChange(e)}}
      />
      <div className="flex flex-row">
        <button className={classNameButton} onClick={() => {OnRefresh()}}>Refresh</button>
        <button className={classNameButton} onClick={() => {onReset()}}>Reset</button>
        <button className={classNameButton} onClick={() => {onSubmit()}}>Submit</button>
      </div>
    </div>
  </>
}

export default InputField;