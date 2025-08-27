function ConnectionConstructor(words) {
    if(!words) return [];
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

function ConnectionValidator(connections, charSet){
  if(connections.length == 0){
    return true;
  } else{
    for(let i = 1; i < connections.length; i++){
      if(Math.floor(charSet.indexOf(connections[i]) / 3) == Math.floor(charSet.indexOf(connections[i - 1]) / 3) || !charSet.includes(connections[i])){
        return false;
      }
    }
  }
  return true;
}

function FilterString(inputString, allowedCharacters) {
  return inputString
    .split('') // 1. Convert the string into an array of characters
    .filter(char => allowedCharacters.includes(char)) // 2. Filter the array
    .join(''); // 3. Join the filtered array back into a string
}



function CheckValidWord(word, allowedCharactersSet){
  if(word.length < 3){
    return false;
  }
  for(let i = 0; i<word.length; i++){
    if(word[i] == word[i - 1]){
      return false;
    }
    if(!allowedCharactersSet.has(word[i])){
      return false
    }
  }
  return true;
}


export { ConnectionConstructor, ConnectionValidator, FilterString, CheckValidWord}