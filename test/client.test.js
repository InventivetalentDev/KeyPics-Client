import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { applyIcon, buildQueryString, getKeyUrl, getMouseUrl } from "../src/index.js";

describe("url builders", () => {
    test("encode the label and drop control attributes", () => {
        assert.equal(getKeyUrl("K"), "https://key.pics/key/K.svg");
        assert.equal(getKeyUrl("ctrl", { shape: "wide", type: "key", mode: "link" }), "https://key.pics/key/ctrl.svg?shape=wide");
        assert.equal(getKeyUrl("#"), "https://key.pics/key/%23.svg");
        assert.equal(getKeyUrl("a b", { color: "#ff0000" }), "https://key.pics/key/a%20b.svg?color=%23ff0000");
        assert.equal(getKeyUrl("far:smile", { labelColor: "red" }), "https://key.pics/key/far%3Asmile.svg?labelColor=red");
        assert.equal(getMouseUrl("right", { label: "x2" }), "https://key.pics/mouse/right.svg?label=x2");
    });

    test("buildQueryString ignores empty input", () => {
        assert.equal(buildQueryString(undefined), "");
        assert.equal(buildQueryString({}), "");
        assert.equal(buildQueryString({ type: "mouse" }), "");
        assert.equal(buildQueryString({ size: 64, color: null }), "?size=64");
    });
});

/** Just enough of the DOM for applyIcon's link mode. */
class FakeElement {
    constructor(tagName, { text = "", dataset = {}, className = "" } = {}) {
        this.tagName = tagName;
        this.nodeType = 1;
        this.textContent = text;
        this.dataset = { ...dataset };
        this.className = className;
        this.replacement = null;
    }

    replaceWith(node) {
        this.replacement = node;
    }
}

describe("applyIcon", () => {
    test("replaces the element with an image in link mode", () => {
        globalThis.document = { createElement: (tagName) => new FakeElement(tagName) };
        try {
            const element = new FakeElement("i", { text: " ctrl ", dataset: { color: "blue", shape: "wide" }, className: "keypics big" });
            const img = applyIcon(element);
            assert.equal(img.tagName, "img");
            assert.equal(img.src, "https://key.pics/key/ctrl.svg?color=blue&shape=wide");
            assert.equal(img.alt, "ctrl");
            assert.equal(img.className, "keypics big");
            assert.deepEqual(img.dataset, { color: "blue", shape: "wide" });
            assert.equal(element.replacement, img);

            const mouse = new FakeElement("i", { text: "right", dataset: { type: "mouse", label: "x2" } });
            assert.equal(applyIcon(mouse).src, "https://key.pics/mouse/right.svg?label=x2");
        } finally {
            delete globalThis.document;
        }
    });

    test("handles lists and ignores unknown types without throwing", () => {
        globalThis.document = { createElement: (tagName) => new FakeElement(tagName) };
        const originalWarn = console.warn;
        console.warn = () => {};
        try {
            const good = new FakeElement("i", { text: "A" });
            const bad = new FakeElement("i", { text: "B", dataset: { type: "gamepad" } });
            const results = applyIcon([bad, good]);
            assert.equal(results[0], undefined);
            assert.equal(results[1].src, "https://key.pics/key/A.svg");
            assert.equal(applyIcon(null), undefined);
        } finally {
            console.warn = originalWarn;
            delete globalThis.document;
        }
    });
});
