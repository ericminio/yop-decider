import jsdom from "jsdom";
import { oneliner } from "./oneliner.js";
const { JSDOM } = jsdom;
const config = {
  runScripts: "dangerously",
  resources: "usable",
};
const openWithJsdom = (isUrl, isHtml) =>
  isUrl
    ? JSDOM.fromURL
    : isHtml
      ? (target, options) => new JSDOM(target, options)
      : JSDOM.fromFile;

export class Page {
  constructor() {
    this.errors = [];
  }

  async open(spec, options) {
    const isHtml = typeof spec == "string" && oneliner(spec).indexOf("<") === 0;
    const isUrl = typeof spec == "string" && spec.indexOf("http") === 0;
    const target = isUrl || isHtml ? spec : spec.pathname;
    const fetchImplementation =
      !!options && options.fetch
        ? options.fetch
        : (url, options) => {
            return isUrl && typeof url == "string" && url.indexOf("/") === 0
              ? fetch(`${new URL(spec).origin}${url}`, options)
              : fetch(url, options);
          };
    return new Promise(async (resolve, reject) => {
      try {
        const dom = await openWithJsdom(isUrl, isHtml)(target, {
          beforeParse: (window) => {
            window.fetch = fetchImplementation;
            window.__stryker__ = {
              activeMutant: process.env.__STRYKER_ACTIVE_MUTANT__,
            };
          },
          ...config,
        });

        this.window = dom.window;
        this.document = dom.window.document;
        if (this.document.readyState === "loading") {
          this.document.addEventListener("DOMContentLoaded", () => resolve());
        } else {
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async close() {
    return new Promise((resolve) => {
      this.window.close();
      resolve();
    });
  }

  executeScript(code) {
    code(this.window, this.document);
  }

  location() {
    return this.window.location.href;
  }

  title() {
    return this.document.title;
  }

  html() {
    return this.document.body.innerHTML;
  }

  section(text) {
    return this.find({ tag: "section", text })
      .text.replace(/\s\s+/g, " ")
      .trim();
  }

  color(text) {
    const label = this.find({ tag: "label", text }).element;
    const style = this.document.defaultView.getComputedStyle(label, null);

    return style.color;
  }

  activeElementId() {
    return this.document.activeElement.id;
  }

  inputValue(prompt) {
    return this.input(prompt).value;
  }

  inputId(prompt) {
    return this.input(prompt).id;
  }

  element(selector) {
    return this.document.querySelector(selector);
  }

  click(text) {
    this.find({ tag: "button", text }).element.click();
  }

  enter(prompt, value) {
    let field = this.input(prompt);
    field.value = value;
    field.dispatchEvent(new this.window.Event("input"));
  }

  input(prompt) {
    let label = this.find({ tag: "label", text: prompt }).element;
    if (label.htmlFor.length === 0) {
      throw new Error(`label with text '${prompt}' is missing for attribute`);
    }
    let candidate = this.element(`#${label.htmlFor}`);
    if (candidate === null) {
      throw new Error(`input with id '${label.htmlFor}' not found`);
    }
    return candidate;
  }

  find({ in: inDocument, tag, text }) {
    if (!this.document) {
      throw new Error("page.document must be defined");
    }
    const document = inDocument || this.document;
    const elements = Array.from(document.querySelectorAll(tag));
    const candidates = [];
    for (let i = 0; i < elements.length; i++) {
      const candidate = elements[i];
      const actualText = candidate.textContent;
      const actualName = candidate.getAttribute("name");
      if (actualText.indexOf(text) !== -1 || actualName === text) {
        candidates.push({
          element: candidate,
          text: actualText,
          name: actualName,
        });
      }
    }
    if (candidates.length === 0) {
      throw new Error(`${tag} with text or name '${text}' not found`);
    }
    candidates.sort(this.sortWithNameAndContent(tag, text));
    return candidates[0];
  }
}
