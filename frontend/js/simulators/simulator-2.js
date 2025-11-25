document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const expensesInput = document.getElementById('expenses-input');
    const monthsSlider = document.getElementById('months-slider');
    const monthsDisplay = document.getElementById('months-display');
    const savingsInput = document.getElementById('savings-input');
    const calculateBtn = document.getElementById('calculate-btn');

    // Resultados
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const resultsContent = document.getElementById('results-content');
    const resultTotal = document.getElementById('result-total');
    const resultCalculation = document.getElementById('result-calculation');
    const resultMonths = document.getElementById('result-months');
    const resultYears = document.getElementById('result-years');
    const timeDescription = document.getElementById('time-description');

    // === Formateador de Moneda ===
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    // === Event Listeners ===

    // Slider de Meses: Actualiza el texto al moverlo
    monthsSlider.addEventListener('input', (e) => {
        monthsDisplay.textContent = `${e.target.value} Meses`;
        updateSliderBackground(e.target);
    });

    // Validar inputs numéricos (evitar negativos)
    [expensesInput, savingsInput].forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.value < 0) e.target.value = 0;
        });
    });

    calculateBtn.addEventListener('click', calculateEmergencyFund);

    // === Funciones ===

    function updateSliderBackground(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
    }

    function calculateEmergencyFund() {
        // 1. Obtener valores
        const monthlyExpenses = parseFloat(expensesInput.value) || 0;
        const coverageMonths = parseInt(monthsSlider.value);
        const monthlySavings = parseFloat(savingsInput.value) || 0;

        // 2. Cálculos principales
        const totalFundNeeded = monthlyExpenses * coverageMonths;

        // Calcular tiempo para la meta
        // Si el ahorro es 0, el tiempo es infinito (manejamos ese caso)
        let monthsToGoal = 0;
        let yearsToGoalString = "";

        if (monthlySavings > 0) {
            monthsToGoal = Math.ceil(totalFundNeeded / monthlySavings);

            // Calcular texto de años
            const years = (monthsToGoal / 12).toFixed(1);
            if (monthsToGoal < 12) {
                yearsToGoalString = "Menos de 1 año";
            } else if (monthsToGoal === 12) {
                yearsToGoalString = "1 año";
            } else {
                yearsToGoalString = `${years} años`;
            }
        } else {
            monthsToGoal = "∞";
            yearsToGoalString = "Nunca (Ahorro $0)";
        }

        // 3. Mostrar Resultados
        displayResults(totalFundNeeded, monthlyExpenses, coverageMonths, monthlySavings, monthsToGoal, yearsToGoalString);
    }

    function displayResults(total, expenses, months, savings, timeMonths, timeYears) {
        // Switch de vista
        resultsPlaceholder.classList.remove('visible');
        resultsPlaceholder.classList.add('hidden');
        resultsContent.classList.remove('hidden');
        resultsContent.classList.add('visible');

        // Actualizar textos
        resultTotal.textContent = currencyFormatter.format(total);
        resultCalculation.textContent = `${currencyFormatter.format(expenses)}/mes × ${months} meses`;

        resultMonths.textContent = typeof timeMonths === 'number' ? `${timeMonths} Meses` : timeMonths;
        resultYears.textContent = timeYears;

        timeDescription.innerHTML = `Ahorrando <strong>${currencyFormatter.format(savings)}</strong> mensualmente.`;

        // Cambiar texto del botón a "Recalcular"
        calculateBtn.innerHTML = `Recalcular <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
    }

    // Inicializar color del slider
    updateSliderBackground(monthsSlider);
});