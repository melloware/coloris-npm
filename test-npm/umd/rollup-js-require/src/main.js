const Coloris = require("@melloware/coloris-npm");

Coloris.init();

Coloris.coloris({
    el: "#coloris",
});

Coloris.close();

document.getElementById("status").textContent = "done";
