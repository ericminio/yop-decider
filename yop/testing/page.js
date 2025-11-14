import { Page as PageJSDOM } from "./page-jsdom.js";

export const Page = PageJSDOM;

Page.prototype.sortWithNameAndContent = function (tag, text) {
  return (a, b) => {
    if (a.name === text && b.name === text) {
      throw new Error(`multiple elements '${tag}' with name '${text}' found`);
    }
    if (a.name === text) return -1;
    if (b.name === text) return 1;
    return a.text.length - b.text.length;
  };
};
