document.addEventListener('DOMContentLoaded', () => {
    // === Elementos del DOM ===
    const amountSlider = document.getElementById('amount-slider');
    const amountDisplay = document.getElementById('amount-display');
    const periodSlider = document.getElementById('period-slider');
    const periodDisplay = document.getElementById('period-display');
    const btnWeekly = document.getElementById('btn-weekly');
    const btnMonthly = document.getElementById('btn-monthly');
    const calculateBtn = document.getElementById('calculate-btn');

    // === Elementos de Resultados ===
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const resultsContent = document.getElementById('results-content');
    const resultTotal = document.getElementById('result-total');
    const resultInterest = document.getElementById('result-interest');
    const legendCapital = document.getElementById('legend-capital');
    const legendInterest = document.getElementById('legend-interest');
    const progressFill = document.getElementById('progress-fill');

    // === Variables de Estado ===
    let frequency = 'weekly';
    const interestRate = 0.03; // Tasa 3% anual

    // === LISTENERS ===

    // Slider Cantidad
    amountSlider.addEventListener('input', (e) => {
        amountDisplay.textContent = `$${e.target.value}`;
        SimulatorUtils.updateSliderBackground(e.target);
    });

    // Slider Periodo
    periodSlider.addEventListener('input', (e) => {
        periodDisplay.textContent = `${e.target.value} Años`;
        SimulatorUtils.updateSliderBackground(e.target);
    });

    // Botones de Frecuencia
    btnWeekly.addEventListener('click', () => setFrequency('weekly'));
    btnMonthly.addEventListener('click', () => setFrequency('monthly'));

    // Botón Calcular
    calculateBtn.addEventListener('click', calculateSavings);

    // === FUNCIONES LÓGICAS ===

    function setFrequency(freq) {
        frequency = freq;
        if (freq === 'weekly') {
            btnWeekly.classList.add('active');
            btnMonthly.classList.remove('active');
        } else {
            btnMonthly.classList.add('active');
            btnWeekly.classList.remove('active');
        }
    }

    function calculateSavings() {
        const contribution = parseFloat(amountSlider.value);
        const years = parseFloat(periodSlider.value);

        let n; // periodos por año
        let ratePerPeriod;

        if (frequency === 'weekly') {
            n = 52;
            ratePerPeriod = interestRate / 52;
        } else {
            n = 12;
            ratePerPeriod = interestRate / 12;
        }

        const totalPeriods = years * n;

        // Fórmula de Valor Futuro de una anualidad (Interés Compuesto)
        const futureValue = contribution * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);

        const totalInvested = contribution * totalPeriods;
        const totalInterest = futureValue - totalInvested;

        displayResults(futureValue, totalInterest, totalInvested);
    }

    function displayResults(total, interest, invested) {
        // 1. Switch de vistas
        SimulatorUtils.showResults(resultsPlaceholder, resultsContent);

        // 2. Insertar valores
        resultTotal.textContent = SimulatorUtils.formatCurrency(total);
        resultInterest.textContent = `+ ${SimulatorUtils.formatCurrency(interest)}`;

        legendCapital.textContent = `Capital: ${SimulatorUtils.formatCurrency(invested)}`;
        legendInterest.textContent = `+ ${SimulatorUtils.formatCurrency(interest)}`;

        // 3. Actualizar botón
        SimulatorUtils.updateButtonToRecalculate(calculateBtn);

        // 4. Animar Barra
        const capitalPercentage = (invested / total) * 100;
        SimulatorUtils.animateProgressBar(progressFill, capitalPercentage);
    }

    // Inicializar fondos de sliders
    SimulatorUtils.initializeSliders(amountSlider, periodSlider);
});