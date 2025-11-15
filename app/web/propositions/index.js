customElements.define(
    'yop-propositions',
    class extends HTMLElement {
        constructor() {
            super();
        }

        async connectedCallback() {
            this.innerHTML = await fetch('/templates/propositions/index.html').then(
                (response) => response.text()
            );
            this.loadPropositions();
        }

        async loadPropositions() {
            const response = await fetch('/propositions');
            const data = await response.json();
            const propositions = data.propositions;
            const html = propositions.map(
              ({ text, owner }) => `<li>${owner}: ${text}</li>`,
            );
            this.querySelector('#propositions-list').innerHTML = html.join("");
        }
    }
);
