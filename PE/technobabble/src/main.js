import { getRandomElement } from "./utils.js";

const generateTechnobabble = (howMany) => {
    // get the words
    let json;
    const url = "data/babble-data.json";
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
        let responseText = e.target.responseText;

        try{
            json = JSON.parse(responseText);

            let words1, words2, words3;
            ({words1, words2, words3} = json);
            
            // update the output
            document.querySelector("#output").innerHTML = "";
            for (let i = 0; i < howMany; i++)
            {
                let technobabble = `${getRandomElement(words1)} ${getRandomElement(words2)} ${getRandomElement(words3)}`;
                document.querySelector("#output").innerHTML += `${technobabble}\n`;
            }
        }
        catch{
            console.log("Could not parse the JSON.");
            return;
        }
    }

    xhr.open("GET", url);
    xhr.send();

    
};

document.querySelector("#my-button").addEventListener("click", () => {
    generateTechnobabble(1);
});

document.querySelector("#five-babble-button").addEventListener("click", () => {
    generateTechnobabble(5);
});


generateTechnobabble(1);