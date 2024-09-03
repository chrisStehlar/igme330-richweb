
// last output needed to unshoutify instead of going to ALL lower case
let lastOutput;

addEventListener("load", () =>{

    // setup button behaviors
    let helloButton = document.querySelector("#btn-hello");
    let goodbyeButton = document.querySelector("#btn-goodbye");

    helloButton.addEventListener("click", () => {
        greet("Hello");
    });

    goodbyeButton.addEventListener("click", () => {
        greet("Goodbye");
    });

    // set the background colors
    let paragraph = document.querySelector("p");
    paragraph.style.color = "red";
    paragraph.style.backgroundColor = "yellow";

    // rig the checkbox behavior
    document.querySelector("#shoutify").addEventListener("change", () => {
        shoutify();
    });
});

// converts the output to upper case if the shoutify is toggled
const shoutify = () => {
    let output = document.querySelector("#output");

    if(document.querySelector("#shoutify").checked)
    {
        lastOutput = output.innerHTML;
        output.innerHTML = output.innerHTML.toUpperCase();
    }
    else
    {
        output.innerHTML = lastOutput;
    }
};

// changes the output to a greeting with the input name
const greet = (greeting) => {
    let name = document.querySelector("#input-firstname").value.trim();
    let lastname = document.querySelector("#input-lastname").value.trim();
    let output = document.querySelector("#output");

    if(!name) name = "Peter";
    if(!lastname) lastname = "Parker";

    output.innerHTML = `${greeting} ${name} ${lastname}`;
    lastOutput = output.innerHTML;

    // try to shoutify if it is toggled
    shoutify();
};