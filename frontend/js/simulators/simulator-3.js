import { SimulatorUtils } from "./simulator-utils.js";
import { saveSimulatorData } from "../simpleState.js";

document.addEventListener("DOMContentLoaded", () => {
  // === DOM Elements ===
  const totalCostInput = document.getElementById("total-cost");
  const deadlineDateInput = document.getElementById("deadline-date");
  const initialSavingsInput = document.getElementById("initial-savings");
  const calculateBtn = document.getElementById("calculate-btn");

  // Resultados
  const resultsPlaceholder = document.getElementById("results-placeholder");
  const resultsContent = document.getElementById("results-content");

  const resultMonthlySavings = document.getElementById("result-monthly-savings");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const resultTimeRemaining = document.getElementById("result-time-remaining");

  // === Listener ===
  calculateBtn.addEventListener("click", calculatePlan);

  // === Logic ===
  function calculatePlan() {
    // 1. Obtener valores
    const totalCost = parseFloat(totalCostInput.value);
    const deadlineDate = new Date(deadlineDateInput.value);
    const initialSavings = parseFloat(initialSavingsInput.value) || 0;

    // Validaciones básicas
    if (!totalCost || totalCost <= 0) {
      alert("Por favor ingresa un costo total válido.");
      return;
    }
    if (isNaN(deadlineDate.getTime())) {
      alert("Por favor selecciona una fecha límite.");
      return;
    }

    const today = new Date();

    // Calcular diferencia en meses
    let monthsRemaining;
    monthsRemaining = (deadlineDate.getFullYear() - today.getFullYear()) * 12;
    monthsRemaining -= today.getMonth();
    monthsRemaining += deadlineDate.getMonth();

    // Ajuste si el día del mes límite es menor al día actual (menos de un mes completo)
    // Pero para simplificar en simuladores, usaremos meses brutos.

    if (monthsRemaining <= 0) {
      alert("La fecha límite debe ser futura (al menos el próximo mes).");
      return;
    }

    // 2. Cálculos Financieros
    const remainingAmount = totalCost - initialSavings;
    let monthlySavingsNeeded = 0;

    if (remainingAmount > 0) {
      monthlySavingsNeeded = remainingAmount / monthsRemaining;
    }

    // Calcular Progreso
    let progressPercentage = (initialSavings / totalCost) * 100;
    if (progressPercentage > 100) progressPercentage = 100;

    // 3. Mostrar Resultados
    displayResults(monthlySavingsNeeded, progressPercentage, monthsRemaining);
  }

  async function displayResults(monthly, progress, months) {
    // Switch vista
    SimulatorUtils.showResults(resultsPlaceholder, resultsContent);

    // Textos
    resultMonthlySavings.textContent = SimulatorUtils.formatCurrency(monthly);
    resultTimeRemaining.textContent = `${months} Meses`;
    progressText.textContent = `${Math.round(progress)}%`;

    // Botón Izquierdo cambia a "Ajustar Simulación" (Azul con lápiz)
    calculateBtn.innerHTML = `Ajustar Simulación <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;

    // Barra de progreso (con delay para animación)
    SimulatorUtils.animateProgressBar(progressBar, progress, 100);

    await saveSimulatorData({
      calculated_plan_needed: monthly,
      calculated_months_needed: months,
    });
  }
});
