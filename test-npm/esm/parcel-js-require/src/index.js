const Coloris = require("@melloware/coloris-npm");

Coloris.init();

Coloris.coloris({
    el: "#coloris",
});

Coloris.default({
    el: "#coloris2",
});

Coloris.close();

document.getElementById("status").textContent = "done";
