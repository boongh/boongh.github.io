import { useEffect, useState } from 'react'
import { cn } from './cn.jsx'
import Grid from './component/grid.jsx'
import InputField from './component/inputfield.jsx'
import WordsList from './component/wordsList.jsx'
import ConfigData from './component/data.jsx'
import { ConnectionConstructor, ConnectionValidator, FilterString, CheckValidWord} from './functions/wordFunc.jsx'


const DatamuseAPI = "https://api.datamuse.com/"
const RandomWordAPI = "https://random-word-api.herokuapp.com/word?number=100";
const DictionaryAPI = "https://freedictionaryapi.com/api/v1/entries/en/"

//Guarantees to return an array of return 12 letters that can be solved
//Use Datamuse API
async function GetWords(Alphabets){
  let charArrangement = [];
  let valid = false;
  const AllowedCharlc = new Set(Alphabets.all.map((c) => {return c.toLowerCase()}))
  const AllowedVowelslc = new Set(Alphabets.vowels.map((c) => {return c.toLowerCase()}))

  let firstword;
  let secondWord
  
  while(!valid){
    const jsondata = await (await fetch(RandomWordAPI)).json();

    for(const theme of jsondata){
      console.log("theme: ", theme)
      if(!CheckValidWord(theme, AllowedCharlc)) continue;
      
      firstword = theme;
      let themeCharSet = new Set(theme);
      let query = DatamuseAPI + `words?sp=${theme.charAt(theme.length - 1) + "?".repeat(Math.max(12 - theme.length, 0))}*-${Array.from(AllowedVowelslc.difference(new Set(theme))).join("")}&rl_bgb=${theme}&max=100`
      console.log(query)
      let secondWords = await (await fetch(query)).json();

      for(const secondWordEntries of Object.values(secondWords)){
        secondWord = secondWordEntries.word
        if(!CheckValidWord(secondWord, AllowedCharlc)) continue;

        let secondWordCharSet = new Set(secondWord);

        let charSet = themeCharSet.union(secondWordCharSet);
        //Check for 12 distinct characters
        if(charSet.size != 12) continue;

        console.log("For word ", theme, " and " , secondWord)
        console.log("Generating puzzle for connection ", charSet)

        for(let i = 0; i < 100; i++){
          let AvailableSide = new Set([0, 1, 2, 3]);

          charArrangement = [
            [],
            [],
            [],
            []
          ];

          let lastSide = null;

          for(const c of charSet){
            console.log(`Picking sides from ${Array.from(AvailableSide.difference(new Set([lastSide])))}`)
            let side = ChooseRandom(Array.from(AvailableSide.difference(new Set([lastSide]))));
            if(side == null) 
            {
              break;
            }
            console.log(`From ${lastSide} to ${side}`)
            lastSide = side;

            charArrangement[side].push(c);
            if(charArrangement[side].length == 3){
              AvailableSide.delete(side);
            }
          }

          charArrangement = charArrangement.flat();
          if(charArrangement.length == 12 && ConnectionValidator(ConnectionConstructor([firstword, secondWord]), Array.from(charArrangement)))
          {
            valid = true;
            charArrangement = charArrangement.map((c) => {return c.toUpperCase()})
            break;
          }
          
        }
        if(valid) break;
      }
      
      if(valid) break;
    }

  }

  console.log(`Puzzle found for ${charArrangement} | ${firstword} and ${secondWord}`);
  return charArrangement
}

function ChooseRandom(choiceArr){
  console.log("RNG chose: ", Math.floor(Math.random() * choiceArr.length), " from ", choiceArr)
  return choiceArr[Math.floor(Math.random() * choiceArr.length)];
}

function App() {

  const [textFieldValue, setTextField] = useState("");
  const [wordsList, setWordsList] = useState([]);
  const [connections, setconnections] = useState([]);
  const [validCharSet, setValidCharSet] = useState(null);

  async function GeneratePuzzle(){
    const config = await ConfigData()
    let charset = await GetWords(config.alphabets)
    setValidCharSet(charset);
    console.log(charset)
  }

  useEffect(() => { 
    GeneratePuzzle();
  }, [])

  if(!validCharSet){
    return <div>Loading...</div>
  }

  return (
    <>
      <div 
      className={
        cn(
          "bg-[#FFC5D3]",
          "h-screen w-screen duration-50",
          "flex items-center justify-center flex-col",
        )
      }>
        <h1 className={cn(
          "font-bold duration-50 text-center ",
          "text-0 lg:text-5xl",
          "m-0 lg:m-8",
          "text-white"
        )}>Letter Boxed Unlimited</h1>
        <div className='flex flex-col lg:flex-row-reverse items-center justify-center'>
          <Grid charSetArr = {validCharSet}
                charSequenceArr={connections}
                wordsList = {wordsList}
          />
            <div className="flex flex-col items-center justify-center">
            <WordsList wordArray = {wordsList}/>
            <InputField
              setTextField={setTextField} 
              textFieldValue={textFieldValue}
              onReset={() => {
                setTextField("");
                setWordsList([]);
                setconnections([]);
              }}
              OnRefresh={() => {
                GeneratePuzzle();
              }}
              onSubmit={async () => {
                let filteredtext = FilterString(textFieldValue, validCharSet);
                if(filteredtext != ""){
                  let wordReponse = await fetch(DictionaryAPI + `${filteredtext.toLowerCase()}`);
                  let wordEntry = await wordReponse.json();
                  console.log(wordEntry.entries);
                  if(wordEntry.entries.length > 0){
                    setWordsList([...wordsList, textFieldValue])
                    setTextField(textFieldValue.charAt(textFieldValue.length - 1))
                  }
                }
              }}
              OnChange={(e) => {
                e.target.value = e.target.value.toUpperCase()
                if(wordsList.length > 0 && FilterString(e.target.value, validCharSet) == ""){
                  let latestword = wordsList[wordsList.length - 1];
                  setWordsList(wordsList.slice(0, wordsList.length - 1))
                  e.target.value = latestword;
                  console.log("Previous word: ",e.target.value)
                }
                let fullconnection = ConnectionConstructor([...wordsList, e.target.value]);
                let canChange = ConnectionValidator(fullconnection, validCharSet);
                console.log(fullconnection)
                if(canChange){
                  setconnections(fullconnection)
                  setTextField(e.target.value)
                }
              }}
              />  
            </div>
        </div>
      </div>
      
    </>
  )
}

export default App
