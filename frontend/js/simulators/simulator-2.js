import { saveSimulatorData } from "../simpleState";

document.addEventListener("DOMContentLoaded", () => {
  // === DOM Elements ===
  const expensesInput = document.getElementById("expenses-input");
  const monthsSlider = document.getElementById("months-slider");
  const monthsDisplay = document.getElementById("months-display");
  const savingsInput = document.getElementById("savings-input");
  const calculateBtn = document.getElementById("calculate-btn");

  // Resultados
  const resultsPlaceholder = document.getElementById("results-placeholder");
  const resultsContent = document.getElementById("results-content");
  const resultTotal = document.getElementById("result-total");
  const resultCalculation = document.getElementById("result-calculation");
  const resultMonths = document.getElementById("result-months");
  const resultYears = document.getElementById("result-years");
  const timeDescription = document.getElementById("time-description");

  // === Event Listeners ===

  // Slider de Meses: Actualiza el texto al moverlo
  monthsSlider.addEventListener("input", (e) => {
    monthsDisplay.textContent = `${e.target.value} Meses`;
    SimulatorUtils.updateSliderBackground(e.target);
  });

  // Validar inputs numéricos (evitar negativos)
  SimulatorUtils.preventNegativeInputs(expensesInput, savingsInput);

  calculateBtn.addEventListener("click", calculateEmergencyFund);

  // === Funciones ===

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

  async function displayResults(total, expenses, months, savings, timeMonths, timeYears) {
    // Switch de vista
    SimulatorUtils.showResults(resultsPlaceholder, resultsContent);

    // Actualizar textos
    resultTotal.textContent = SimulatorUtils.formatCurrency(total, 0);
    resultCalculation.textContent = `${SimulatorUtils.formatCurrency(expenses, 0)}/mes × ${months} meses`;

    resultMonths.textContent = typeof timeMonths === "number" ? `${timeMonths} Meses` : timeMonths;
    resultYears.textContent = timeYears;

    timeDescription.innerHTML = `Ahorrando <strong>${SimulatorUtils.formatCurrency(savings, 0)}</strong> mensualmente.`;

    // Cambiar texto del botón a "Recalcular"
    SimulatorUtils.updateButtonToRecalculate(calculateBtn, "Recalcular");

    await saveSimulatorData({
      emergency_fund_needed: total,
      emergency_fund_savings: savings,
      emergency_months_to_goal: typeof timeMonths === "number" ? timeMonths : null,
    });
  }

  // Inicializar color del slider
  SimulatorUtils.initializeSliders(monthsSlider);
});
