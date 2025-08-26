async function ImportJson(path){
    return fetch(path)
        .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
        })
        .then((data) => {
            console.log("json data: ",data);
            return data;
        })
        .catch((error) => {
        console.error('Error fetching JSON:', error);
        return null;
        });
}

export { ImportJson };