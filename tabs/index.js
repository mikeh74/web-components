
class TabControl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              font-family: Arial, sans-serif;
            }

            .tabs {
              display: flex;
              cursor: pointer;
              border-bottom: 2px solid #ccc;
            }

            .tabs > div {
              padding: 0.8rem 1.5rem;
              border-bottom: 2px solid transparent;
              transition: border-color 0.3s;
            }

            .tabs > div.active {
              border-bottom: 2px solid #007BFF;
              font-weight: bold;
            }

            .panels {
              padding: 0.8rem;
            }

            .panels > div {
              visibility: hidden;
              display: none;
              opacity: 0;
              height: 0;
              transition: display 0s, visibility 0s, height 0s, opacity 0.3s;
            }

            .panels > div.active {
              display: block;
              visibility: visible;
              opacity: 1;
              height: 100%;
            }

          </style>
          <div class="tabs"></div>
          <div class="panels"></div>
        `;
  }

  connectedCallback() {
    this.tabsContainer = this.shadowRoot.querySelector('.tabs');
    this.panelsContainer = this.shadowRoot.querySelector('.panels');

    this.tabs = [...this.querySelectorAll('tab[slot="tab"]')];
    this.panels = [...this.querySelectorAll('tab-panel[slot="panel"]')];

    this.tabs.forEach((tab, index) => {
      const tabElement = document.createElement('div');
      tabElement.classList.add = 'tab';
      tabElement.textContent = tab.getAttribute('name');
      tabElement.tabIndex = 0;
      tabElement.dataset.index = index;
      tabElement.addEventListener('click', () => this.activateTab(index));

      // add event listener for keyboard navigation
      tabElement.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.activateTab(index);
        }
      });

      this.tabsContainer.appendChild(tabElement);
    });

    this.panels.forEach(panel => {
      const panelElement = document.createElement('div');
      panelElement.innerHTML = panel.innerHTML;
      this.panelsContainer.appendChild(panelElement);
    });

    this.activateTab(0);
  }

  activateTab(index) {
    this.shadowRoot.querySelectorAll('.tabs > div').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });

    this.shadowRoot.querySelectorAll('.panels > div').forEach((panel, i) => {
      // panel.style.display = i === index ? 'block' : 'none';
      panel.classList.toggle('active', i === index);
      // panel.style.visibility = i === index ? 'visible' : 'hidden';
    });
  }
}

customElements.define('tab-control', TabControl);
