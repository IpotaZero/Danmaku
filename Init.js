const cvs = document.getElementById("canvas0");
const ctx = cvs.getContext("2d", { willReadFrequently: true });

const width = cvs.width;    //=512
const height = cvs.height;  //=512

//キー入力
let pressed = [];
let pushed = [];

const okKey = ["KeyZ", "Space", "Enter"];
const cancelKey = ["KeyX", "Backspace", "Escape"];
document.addEventListener("keydown", (e) => {
    if (!pressed.includes(e.code)) {
        pressed.push(e.code);
        pushed.push(e.code);
        if (okKey.includes(e.code)) { pushed.push("ok"); }
        if (cancelKey.includes(e.code)) { pushed.push("cancel"); }
    }
    console.log(pressed);
});

document.addEventListener("keyup", (e) => {
    pressed = pressed.filter((f) => { return e.code != f; });
});

let fontsize = 24;

function test() {
    console.log("test");
}

console.log("Init.js_loaded");