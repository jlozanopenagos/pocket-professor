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

    // === Formateador ===
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    // === LISTENERS ===

    // Slider Cantidad
    amountSlider.addEventListener('input', (e) => {
        amountDisplay.textContent = `$${e.target.value}`;
        updateSliderBackground(e.target);
    });

    // Slider Periodo
    periodSlider.addEventListener('input', (e) => {
        periodDisplay.textContent = `${e.target.value} Años`;
        updateSliderBackground(e.target);
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

    function updateSliderBackground(slider) {
        // Pinta el fondo del slider dinámicamente
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
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
        resultsPlaceholder.classList.remove('visible');
        resultsPlaceholder.classList.add('hidden');
        
        resultsContent.classList.remove('hidden');
        resultsContent.classList.add('visible');

        // 2. Insertar valores
        resultTotal.textContent = currencyFormatter.format(total);
        resultInterest.textContent = `+ ${currencyFormatter.format(interest)}`;
        
        legendCapital.textContent = `Capital: ${currencyFormatter.format(invested)}`;
        legendInterest.textContent = `+ ${currencyFormatter.format(interest)}`;

        // 3. Actualizar botón
        calculateBtn.innerHTML = `Ajustar Simulación <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;

        // 4. Animar Barra
        const capitalPercentage = (invested / total) * 100;
        
        // Pequeño delay para permitir renderizado
        setTimeout(() => {
            progressFill.style.width = `${capitalPercentage}%`;
        }, 50);
    }

    // Inicializar fondos de sliders
    updateSliderBackground(amountSlider);
    updateSliderBackground(periodSlider);
});