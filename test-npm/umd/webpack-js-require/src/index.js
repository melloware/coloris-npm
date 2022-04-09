const Coloris = require("@melloware/coloris-npm");

Coloris.init();

Coloris({
    el: "#coloris",
});

Coloris.close();

document.getElementById("status").textContent = "done";
