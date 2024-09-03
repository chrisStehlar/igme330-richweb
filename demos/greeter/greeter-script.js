
// 1 - get a reference to the button
// 2 - add a click event to button that calls a `sayHello` function
// 3 - create a `sayHello()` function
// 3A - get name of person from the <input>
// 3B - get a reference to the #output <p>
// 3C - update HTML of #output <p>

addEventListener("load", ()=>{
    let helloButton = document.querySelector("#btn-hello");
    let goodbyeButton = document.querySelector("#btn-goodbye");

    helloButton.addEventListener("click", () => {
        greet("Hello");
    });

    goodbyeButton.addEventListener("click", () => {
        greet("Goodbye");
    });

    let paragraph = document.querySelector("p");
    paragraph.style.color = "red";
    paragraph.style.backgroundColor = "yellow";
});

function greet(greeting)
{
    let name = document.querySelector("#input-firstname").value.trim();
    let lastname = document.querySelector("#input-lastname").value.trim();
    let output = document.querySelector("#output");

    if(!name) name = "Peter";
    if(!lastname) lastname = "Parker";

    output.innerHTML = `${greeting} ${name} ${lastname}`;
}