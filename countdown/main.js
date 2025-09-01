class CountdownTimer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.interval = null;
    }

    static get observedAttributes() {
        return ['date'];
    }

    connectedCallback() {
        this.render();
        this.startCountdown();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'date' && oldValue !== newValue) {
            this.render();
            this.startCountdown();
        }
    }

    disconnectedCallback() {
        if (this.interval) clearInterval(this.interval);
    }

    startCountdown() {
        if (this.interval) clearInterval(this.interval);
        const targetDate = new Date(this.getAttribute('date'));
        if (isNaN(targetDate)) {
            this.renderTimer('<span>Invalid date</span>');
            return;
        }
        const update = () => {
            const now = new Date();
            const diff = targetDate - now;
            if (diff <= 0) {
                this.renderTimer('<span>Deadline passed</span>');
                clearInterval(this.interval);
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (days > 1) {
                this.renderTimer(`<span>${days} days</span>`);
                // If more than 2 days, stop updating after first render
                if (days > 2) {
                    if (this.interval) clearInterval(this.interval);
                    return;
                }
            } else if (days === 1) {
                this.renderTimer(`<span>1 day</span>`);
            } else {
                // Less than 24 hours, show live countdown
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                this.renderTimer(`<span>${hours.toString().padStart(2, '0')}:` +
                    `${minutes.toString().padStart(2, '0')}:` +
                    `${seconds.toString().padStart(2, '0')}</span>`);
            }
        };
        // Initial update
        update();
        // Set interval based on time left
        const now = new Date();
        const diff = targetDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (diff <= 0) return;
        if (days > 2) {
            // No interval, only render once
            return;
        } else if (days > 1) {
            // Update every hour
            this.interval = setInterval(update, 60 * 60 * 1000);
        } else if (diff < 24 * 60 * 60 * 1000) {
            // Update every second
            this.interval = setInterval(update, 1000);
        } else {
            // Update every minute
            this.interval = setInterval(update, 60 * 1000);
        }
    }

    renderTimer(timerHtml) {
        this.shadowRoot.innerHTML = `
            <slot></slot>
            <span class="timer">${timerHtml}</span>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <slot></slot>
            <span class="timer">Loading...</span>
        `;
    }
}

customElements.define('countdown-timer', CountdownTimer);
