import { useEffect, useState } from 'react'
import { cn } from './cn.jsx'
import Grid from './component/grid.jsx'
import InputField from './component/inputfield.jsx'
import WordsList from './component/wordsList.jsx'
import ConfigData from './component/Data.jsx'


const DatamuseAPI = "https://api.datamuse.com/words?"
const RandomWordAPI = "https://random-word-api.herokuapp.com/word?number=1";
const DictionaryAPI = "https://freedictionaryapi.com/api/v1/entries/en/"

//Guarantees to return an array of return 12 letters that can be solved
//Use Datamuse API
async function GetWords(AllowedChar){
  let CurrentCharSet = [];
  const randomwordfetch = await fetch(RandomWordAPI)
  const jsondata = await randomwordfetch.json();
  const theme = jsondata[0]

  console.log("Theme: ", theme)
  let query = DatamuseAPI + `sp=${theme.charAt(theme.length - 1) + "?".repeat(5)}&rl_bgb=${theme}&max=20`
  while(true){
    let firstWord = await (await fetch(query)).json()

    console.log(query);
    console.log("first word:", firstWord);


    break;
  }

  while(CurrentCharSet.length < 12){
    let newchar = AllowedChar[Math.floor(Math.random() * 26)]
    if(!CurrentCharSet.includes(newchar)){
      CurrentCharSet = [...CurrentCharSet, newchar]
    }
  }
  return CurrentCharSet;
}

function FakeConnection(Chars, len){
  let connections = [];
  while(connections.length <= len){
    let newConnection = Math.floor(Math.random() * 12)
    if(Math.floor(newConnection / 3) != Math.floor(connections[connections.length - 1] / 3)){
      connections = [...connections, Chars[newConnection]]
    }
  }

  console.log("Fake connections: ", connections)
  return connections
}

function ConnectionValidator(connections, charSet){
  if(connections.length == 0){
    return true;
  } else{
    for(let i = 0; i < connections.length; i++){
      if(Math.floor(charSet.indexOf(connections[i]) / 3) == Math.floor(charSet.indexOf(connections[i - 1]) / 3) || !charSet.includes(connections[i])){
        return false;
      }
    }
  }
  return true;
}

function ConnectionConstructor(words) {
  console.log("Generating connection from: ", words)
  const allCharacters = [];
  words.forEach((word, index)=> {
    if(index !== 0){
      allCharacters.pop();
    }
    for (const char of word) {
      allCharacters.push(char);
    }
  });
  console.log("Got: ", allCharacters)
  return allCharacters;
}

function filterString(inputString, allowedCharacters) {
  return inputString
    .split('') // 1. Convert the string into an array of characters
    .filter(char => allowedCharacters.includes(char)) // 2. Filter the array
    .join(''); // 3. Join the filtered array back into a string
}

function App() {

  const [textFieldValue, setTextField] = useState("");
  const [wordsList, setWordsList] = useState([]);
  const [connections, setconnections] = useState([]);
  const [validCharSet, setValidCharSet] = useState(null);

function ValidWord(word, validCharSet, lastChar) {

    // 1. Check the first letter against the lastChar of the previous word
    if (lastChar && word[0] !== lastChar) {
        console.log(`Word must start with ${lastChar}`);
        return false;
    }

    // 2. Iterate through the word to check for valid characters and same-side rule
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        
        // a. Check if character exists in the overall validCharSet
        if (!validCharSet.includes(char)) {
            console.log(`Invalid character: ${char}`);
            return false;
        }

        // b. Check the same-side rule for consecutive characters
        if (i > 0) {
            const prevChar = word[i-1];
            // Assuming your validCharSet is structured in sides of 3
            // e.g., ['a', 'b', 'c', 'd', 'e', 'f', ...]
            const prevSide = Math.floor(validCharSet.indexOf(prevChar) / 3);
            const currentSide = Math.floor(validCharSet.indexOf(char) / 3);
            
            if (prevSide === currentSide) {
                console.log(`Consecutive letters from the same side: ${prevChar} and ${char}`);
                return false;
            }
        }
    }
    
    console.log("Valid word");
    return true;
}

  useEffect(() => { 
  ConfigData().then((data) => {
    return GetWords(data.alphabets.all)
  }).then((words) => {
    setValidCharSet(words);
    console.log(validCharSet);
  });
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
                confirmedcharSeqArr={ConnectionConstructor(wordsList)}
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
              onSubmit={async () => {
                let filteredtext = filterString(textFieldValue, validCharSet);
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
                if(wordsList.length > 0 && filterString(e.target.value, validCharSet) == ""){
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
