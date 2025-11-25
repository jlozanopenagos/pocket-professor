/**
 * SHARED SIMULATOR UTILITIES
 * Common functions used across all 4 simulators
 */

// === Currency Formatter ===
export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

// === Results Display Toggle ===
/**
 * Toggles between placeholder and results content
 * @param {string} placeholderId - ID of placeholder element
 * @param {string} contentId - ID of results content element
 */
export function showResults(placeholderId = 'results-placeholder', contentId = 'results-content') {
    const placeholder = document.getElementById(placeholderId);
    const content = document.getElementById(contentId);

    if (placeholder && content) {
        placeholder.classList.remove('visible');
        placeholder.classList.add('hidden');
        content.classList.remove('hidden');
        content.classList.add('visible');
    }
}

// === Slider Background Update ===
/**
 * Updates slider background to show filled portion
 * @param {HTMLInputElement} slider - The range input element
 */
export function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
}

// === Button Text Update ===
/**
 * Updates calculate button text after calculation
 * @param {string} btnId - ID of button element
 * @param {string} newText - New button text/HTML
 */
export function updateCalculateButton(btnId, newText = 'Ajustar Simulación') {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.innerHTML = newText;
    }
}

// === Format Currency (without formatter object) ===
/**
 * Quick currency formatting function
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    return currencyFormatter.format(amount);
}

// === Validate Positive Number ===
/**
 * Ensures input value is not negative
 * @param {HTMLInputElement} input - Input element to validate
 */
export function validatePositiveNumber(input) {
    input.addEventListener('change', (e) => {
        if (e.target.value < 0) e.target.value = 0;
    });
}

// === Initialize Slider Backgrounds ===
/**
 * Initialize backgrounds for multiple sliders
 * @param {HTMLInputElement[]} sliders - Array of slider elements
 */
export function initializeSliders(sliders) {
    sliders.forEach(slider => {
        if (slider) {
            updateSliderBackground(slider);
        }
    });
}
