export function autoApply() {
    console.debug("[key.pics] Auto-applying icons");
    let elements = document.querySelectorAll("i.keypics");
    for (let i = 0; i < elements.length; i++) {
        applyIcon(elements[i]);
    }
}

export function applyIcon(element) {
    if (!element) return;
    if (Array.isArray(element)) {
        for (let i = 0; i < element.length; i++) {
            applyIcon(element[i]);
        }
        return;
    }

    let labelOrPressed = element.innerHTML;
    let type = element.dataset.type || "key";// key*, mouse
    let mode = element.dataset.mode || "link";// link*, fetch


    let url;
    if (type === "key") {
        url = getKeyUrl(labelOrPressed, element.dataset);
    } else if (type === "mouse") {
        url = getMouseUrl(labelOrPressed, element.dataset);
    } else {
        throw "Unknown type " + type;
    }

    if (mode === "link") {
        let imgElement = document.createElement("img");
        for (let d in element.dataset) {
            imgElement.dataset[d] = element.dataset[d]
        }
        imgElement.innerHTML = element.innerHTML;
        imgElement.className = element.className;
        imgElement.alt = element.innerHTML;
        imgElement.src = url;
        element.parentNode.replaceChild(imgElement, element);
    } else if (mode === "fetch") {
        fetch(url)
            .then((res) => res.text())
            .then((svgData) => {
                element.innerHTML = svgData;
            })
            .catch((err) => {
                throw err;
            });
    } else {
        throw "Unknown mode " + mode;
    }
}


function getKeyUrl(label, params) {
    return "https://key.pics/key/" + label + ".svg?" + buildQueryString(params)
}

function getMouseUrl(pressed, params) {
    return "https://key.pics/mouse/" + pressed + ".svg?" + buildQueryString(params)
}

function buildQueryString(params) {
    if (!params) return "";
    return Object.keys(params)
        .map(k => k + "=" + encodeURIComponent(params[k]))
        .join("&");
}

(function () {
    autoApply();
})();