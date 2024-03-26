let i = 0;
let placeholder = "";
const txt = "Continue from where you stopped...";
const speed = 120;

function type() {
    if (i < txt.length) {
        placeholder += txt.charAt(i);
        document.getElementById("text-id").setAttribute("placeholder", placeholder);
        i++;
        setTimeout(type, speed);
    } else {
        setTimeout(resetType, 10000); // Wait for 5 seconds before resetting
    }
}

function resetType() {
    i = 0;
    placeholder = "";
    setTimeout(type, 0); // Start typing immediately after resetting
}

type(); // Start typing initially
