import "@melloware/coloris-npm/dist/coloris.css";
import Coloris from "@melloware/coloris-npm";

Coloris.init();

Coloris({
    el: "#coloris",
});

Coloris.close();

document.getElementById("status").textContent = "done";

if (typeof Coloris.setInstance !== "function") {
    throw new Error("setInstance not available");
}

if (typeof Coloris.removeInstance !== "function") {
    throw new Error("removeInstance not available");
}

if (typeof Coloris.updatePosition !== "function") {
    throw new Error("updatePosition not available");
}
