// Import the LitElement base class and html helper function
import { LitElement, html, css } from "lit-element";
import { styleMap } from "lit-html/directives/style-map";

// You should design your element’s template as a pure function of its properties.
// To do this, make sure the render function:

// Does not change the element’s state.
// Does not have any side effects.
// Only depends on the element’s properties.
// Returns the same result when given the same property values.

const LIST_HEIGHT = 800;
const ITEM_HEIGHT = 43;
const ITEM_COUNT = 10000;

export class LitScroll extends LitElement {
  static get properties() {
    return {
      elements: { type: Array },
      startIndex: { type: Number },
      endIndex: { type: Number },
      scrollyToppy: { type: Number }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          height: ${LIST_HEIGHT}px;
          overflow-y: scroll;
          border: 1px solid black;
        }
      `,
      css`
        * {
          box-sizing: border-box;
        }
      `,
      css`
        .user-element {
          border: 1px solid green;
          height: ${ITEM_HEIGHT}px;
        }
      `,
      css`
        .scroll-helper {
          // border: 1px solid red;
          height: ${ITEM_COUNT * ITEM_HEIGHT}px;
        }
      `,
      css`
        .count {
          position: absolute;
          top: 0;
          left: 30%;
        }
      `
    ];
  }

  constructor() {
    super();
    this.elements = testArray();
    this.elementsRenderedCount = Math.ceil(LIST_HEIGHT / ITEM_HEIGHT) + 1;
    this.startIndex = 0;
    this.endIndex = this.elementsRenderedCount;
    this.scrollyToppy = 0;

    const scrollArea = document.querySelector("#scroll-area");

    scrollArea.addEventListener("scroll", () => {
      window.requestAnimationFrame(() => {
        this.scrollyToppy = scrollArea.scrollTop;
        this.startIndex = this.calculateStartIndex(this.scrollyToppy);
        this.endIndex = this.startIndex + this.elementsRenderedCount;
      });
    });
  }

  calculateStartIndex(scrollTop) {
    return Math.floor(scrollTop / ITEM_HEIGHT);
  }

  render() {
    const { elements, startIndex, endIndex } = this;
    const shownElements = elements.slice(startIndex, endIndex);
    return html`
      <div class="scroll-helper">
        ${shownElements.map(
          item =>
            html`
              <div
                class="scroll-ele"
                style=${styleMap({
                  transform: `translateY(${this.startIndex * ITEM_HEIGHT}px)`
                })}
              >
                ${item}
              </div>
            `
        )}
      </div>
      <div class="count">
        <div>${this.startIndex}</div>
        <div>${this.endIndex}</div>
        <div>${this.scrollyToppy}</div>
      </div>
    `;
  }
}

// Register the new element with the browser.
customElements.define("lit-scroll", LitScroll);

function testArray() {
  const elements = [];
  for (let i = 0; i < ITEM_COUNT; i++) {
    elements.push(
      html`
        <div id=${i} class="user-element">
          testsasssssssssssssssssssssss${i}
        </div>
      `
    );
  }
  return elements;
}
