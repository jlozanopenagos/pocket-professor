document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const initialInvestmentInput = document.getElementById('initial-investment');
    const monthlyContributionInput = document.getElementById('monthly-contribution');
    const interestRateInput = document.getElementById('interest-rate');
    const yearsPeriodInput = document.getElementById('years-period');
    const calculateBtn = document.getElementById('calculate-btn');

    // Resultados
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const resultsContent = document.getElementById('results-content');

    const resultTotalValue = document.getElementById('result-total-value');
    const resultInterestEarned = document.getElementById('result-interest-earned');

    // === Listener ===
    calculateBtn.addEventListener('click', calculateCompoundInterest);

    // === Logic ===
    function calculateCompoundInterest() {
        // 1. Obtener valores
        const P = parseFloat(initialInvestmentInput.value) || 0; // Principal
        const PMT = parseFloat(monthlyContributionInput.value) || 0; // Aporte mensual
        const r = (parseFloat(interestRateInput.value) || 0) / 100; // Tasa decimal
        const t = parseFloat(yearsPeriodInput.value) || 0; // Tiempo en años

        const n = 12; // Capitalización mensual (estándar en estos simuladores)

        // 2. Validaciones básicas
        if (t <= 0) {
            alert("Por favor ingresa un período de tiempo válido (años).");
            return;
        }

        // 3. Cálculo: Fórmula de Valor Futuro con aportes mensuales
        // FV = P * (1 + r/n)^(nt) + PMT * [ ((1 + r/n)^(nt) - 1) / (r/n) ]

        let futureValue = 0;
        let totalInvested = 0;

        if (r === 0) {
            // Si la tasa es 0, es interés simple (suma directa)
            totalInvested = P + (PMT * 12 * t);
            futureValue = totalInvested;
        } else {
            const ratePerPeriod = r / n;
            const totalPeriods = n * t;

            const compoundFactor = Math.pow(1 + ratePerPeriod, totalPeriods);

            const fvPrincipal = P * compoundFactor;
            const fvContributions = PMT * ((compoundFactor - 1) / ratePerPeriod);

            futureValue = fvPrincipal + fvContributions;
            totalInvested = P + (PMT * 12 * t);
        }

        const totalInterest = futureValue - totalInvested;

        // 4. Mostrar Resultados
        displayResults(futureValue, totalInterest);
    }

    function displayResults(total, interest) {
        // Switch vista
        SimulatorUtils.showResults(resultsPlaceholder, resultsContent);

        // Textos
        resultTotalValue.textContent = SimulatorUtils.formatCurrency(total);
        resultInterestEarned.textContent = SimulatorUtils.formatCurrency(interest);

        // Botón Izquierdo cambia a "Ajustar Simulación" (Azul estándar)
        calculateBtn.textContent = "Ajustar Simulación";
    }
});