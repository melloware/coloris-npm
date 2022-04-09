import "@melloware/coloris-npm/dist/coloris.css";
import Coloris from "@melloware/coloris-npm";

Coloris.init();

Coloris({
    el: "#coloris",
});

Coloris.close();

document.getElementById("status").textContent = "done";
