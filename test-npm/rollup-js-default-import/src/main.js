import Coloris from "../../../dist/coloris";

Coloris.init();

Coloris({
    el: "#coloris",
});

Coloris.close();

document.getElementById("status").textContent = "done";
