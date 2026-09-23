/**
 * key.pics browser client.
 *
 * Turns `<i class="keypics" data-…>label</i>` elements into key or mouse
 * icons served by https://key.pics. Every `data-*` attribute except
 * `data-type` and `data-mode` is passed to the image API as a query
 * parameter, e.g. `data-color="blue"` becomes `?color=blue`.
 */

const BASE_URL = "https://key.pics";
const SELECTOR = "i.keypics";
/** data attributes that configure this library rather than the image */
const CONTROL_ATTRIBUTES = new Set(["type", "mode"]);
const ELEMENT_NODE = 1;

/** Builds the query string for an image request from a params object (or an element's dataset). */
export function buildQueryString(params) {
    if (!params) return "";
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (CONTROL_ATTRIBUTES.has(key) || value === undefined || value === null) continue;
        search.append(key, String(value));
    }
    const query = search.toString();
    return query ? `?${query}` : "";
}

/** URL of a keyboard key image, e.g. getKeyUrl("ctrl", { shape: "wide" }). */
export function getKeyUrl(label, params) {
    return `${BASE_URL}/key/${encodeURIComponent(label)}.svg${buildQueryString(params)}`;
}

/** URL of a mouse image, e.g. getMouseUrl("left", { label: "x2" }). */
export function getMouseUrl(pressed, params) {
    return `${BASE_URL}/mouse/${encodeURIComponent(pressed)}.svg${buildQueryString(params)}`;
}

function warn(message, element) {
    if (typeof console !== "undefined") console.warn(`[key.pics] ${message}`, element);
}

function replaceWithImage(element, url, label) {
    const img = document.createElement("img");
    for (const [key, value] of Object.entries(element.dataset)) img.dataset[key] = value;
    img.className = element.className;
    img.alt = label;
    img.src = url;
    element.replaceWith(img);
    return img;
}

function inlineSvg(element, url) {
    return fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error(`key.pics responded with ${response.status} for ${url}`);
            return response.text();
        })
        .then((svgText) => {
            const svg = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;
            if (!svg || svg.nodeName.toLowerCase() !== "svg") throw new Error(`key.pics returned no SVG for ${url}`);
            element.replaceChildren(document.importNode(svg, true));
            return element;
        })
        .catch((error) => {
            element.classList.add("keypics-error");
            warn(error.message, element);
            return element;
        });
}

/**
 * Applies the icon to one element, or to every element of an array/NodeList.
 *
 * - `data-type`: `key` (default) or `mouse`
 * - `data-mode`: `link` (default) replaces the element with an `<img>`;
 *   `fetch` downloads the SVG and inlines it into the element.
 *
 * Returns the `<img>` in link mode, a Promise in fetch mode.
 */
export function applyIcon(element) {
    if (!element) return undefined;
    if (element.nodeType !== ELEMENT_NODE) {
        if (typeof element[Symbol.iterator] === "function") {
            return Array.from(element, (item) => applyIcon(item));
        }
        return undefined;
    }

    const label = (element.textContent || "").trim();
    const type = element.dataset.type || "key";
    const mode = element.dataset.mode || "link";

    let url;
    if (type === "key") {
        url = getKeyUrl(label, element.dataset);
    } else if (type === "mouse") {
        url = getMouseUrl(label, element.dataset);
    } else {
        warn(`Unknown type "${type}" (expected "key" or "mouse")`, element);
        return undefined;
    }

    if (mode === "link") return replaceWithImage(element, url, label);
    if (mode === "fetch") return inlineSvg(element, url);
    warn(`Unknown mode "${mode}" (expected "link" or "fetch")`, element);
    return undefined;
}

/** Applies icons to all `<i class="keypics">` elements below `root` (default: the whole document). */
export function autoApply(root = document) {
    return applyIcon(root.querySelectorAll(SELECTOR));
}

// Apply automatically when loaded in a browser. Elements that come after the
// script tag are still picked up because we wait for the DOM to be parsed.
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => autoApply(), { once: true });
    } else {
        autoApply();
    }
}
