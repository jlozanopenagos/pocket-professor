/**
 * Simulator Utilities
 * Shared functions for all financial simulators
 * Eliminates code duplication across simulator-1.js through simulator-4.js
 */

const SimulatorUtils = {
    // === Currency Formatting ===

    /**
     * Currency formatter with 2 decimal places (USD)
     */
    currencyFormatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }),

    /**
     * Currency formatter without decimals (USD)
     */
    currencyFormatterNoDecimals: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }),

    /**
     * Format currency value
     * @param {number} value - The value to format
     * @param {number} decimals - Number of decimal places (0 or 2)
     * @returns {string} Formatted currency string
     */
    formatCurrency(value, decimals = 2) {
        return decimals === 0
            ? this.currencyFormatterNoDecimals.format(value)
            : this.currencyFormatter.format(value);
    },

    // === Slider Styling ===

    /**
     * Update slider background gradient based on current value
     * Creates a visual fill effect showing the selected portion
     * @param {HTMLInputElement} slider - The range input element
     */
    updateSliderBackground(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
    },

    /**
     * Initialize slider backgrounds for multiple sliders
     * @param {...HTMLInputElement} sliders - One or more slider elements
     */
    initializeSliders(...sliders) {
        sliders.forEach(slider => this.updateSliderBackground(slider));
    },

    // === Results State Management ===

    /**
     * Toggle from placeholder to results content
     * Hides placeholder and shows calculated results
     * @param {HTMLElement} placeholderEl - The placeholder element
     * @param {HTMLElement} contentEl - The results content element
     */
    showResults(placeholderEl, contentEl) {
        placeholderEl.classList.remove('visible');
        placeholderEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
        contentEl.classList.add('visible');
    },

    /**
     * Toggle from results back to placeholder
     * Hides results and shows placeholder
     * @param {HTMLElement} placeholderEl - The placeholder element
     * @param {HTMLElement} contentEl - The results content element
     */
    showPlaceholder(placeholderEl, contentEl) {
        contentEl.classList.remove('visible');
        contentEl.classList.add('hidden');
        placeholderEl.classList.remove('hidden');
        placeholderEl.classList.add('visible');
    },

    // === Button Updates ===

    /**
     * Update calculate button to "recalculate" state with refresh icon
     * @param {HTMLButtonElement} button - The button element to update
     * @param {string} text - The button text (default: 'Ajustar Simulación')
     */
    updateButtonToRecalculate(button, text = 'Ajustar Simulación') {
        button.innerHTML = `${text} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
    },

    // === Input Validation ===

    /**
     * Prevent negative values in a number input
     * @param {HTMLInputElement} input - The input element
     */
    preventNegativeInput(input) {
        input.addEventListener('change', (e) => {
            if (e.target.value < 0) e.target.value = 0;
        });
    },

    /**
     * Apply negative prevention to multiple inputs
     * @param {...HTMLInputElement} inputs - One or more input elements
     */
    preventNegativeInputs(...inputs) {
        inputs.forEach(input => this.preventNegativeInput(input));
    },

    // === Animations ===

    /**
     * Animate progress bar width with delay
     * @param {HTMLElement} progressBar - The progress bar element
     * @param {number} percentage - Target percentage (0-100)
     * @param {number} delay - Delay in milliseconds (default: 50)
     */
    animateProgressBar(progressBar, percentage, delay = 50) {
        setTimeout(() => {
            progressBar.style.width = `${percentage}%`;
        }, delay);
    }
};

// Export for use in simulator files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimulatorUtils;
}
