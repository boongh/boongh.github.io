import { ImportJson } from "../functions/ImportJson";

const ConfigData = async () => {
    let data = await ImportJson("/LetterBoxedData.json");
    console.log(data);
    return data;
}

export default ConfigData;