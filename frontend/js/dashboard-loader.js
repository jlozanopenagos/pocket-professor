import { getDashboardData } from "./simpleState.js";

/**
 * Format currency
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(amount);
};

/**
 * Initialize Dashboard
 */
const initDashboard = async () => {
    const guestView = document.getElementById("guest-view");
    const userDashboard = document.getElementById("user-dashboard");

    if (!guestView || !userDashboard) {
        console.log("Dashboard containers not found, skipping init");
        return;
    }

    // Fetch data
    const data = await getDashboardData();

    if (data) {
        // User is logged in and data fetched
        console.log("Dashboard data loaded:", data);

        // Hide guest view, show dashboard
        guestView.style.display = "none";
        userDashboard.style.display = "block";

        // Populate Auto Savings
        if (data.autoSavings) {
            document.getElementById("dash-auto-total").textContent = formatCurrency(data.autoSavings.total_saved || 0);
            document.getElementById("dash-auto-interest").textContent = formatCurrency(data.autoSavings.interest_earned || 0);
        }

        // Populate Emergency Fund
        if (data.emergencyFund) {
            document.getElementById("dash-emergency-total").textContent = formatCurrency(data.emergencyFund.total_e_fund || 0);
            // Using estimated_time as it reflects the calculated result
            document.getElementById("dash-emergency-months").textContent = data.emergencyFund.estimated_time || 0;
        }

        // Populate Savings Goal
        if (data.savingsGoal) {
            document.getElementById("dash-goal-monthly").textContent = `${formatCurrency(data.savingsGoal.monthly_savings || 0)}/mes`;
            // Using remaining_time from the log
            document.getElementById("dash-goal-months").textContent = data.savingsGoal.remaining_time || 0;
        }

        // Populate Compound Interest
        if (data.compoundInterest) {
            document.getElementById("dash-compound-total").textContent = formatCurrency(data.compoundInterest.total_projected || 0);
            document.getElementById("dash-compound-interest").textContent = formatCurrency(data.compoundInterest.interest_earned || 0);
        }

    } else {
        // User not logged in or error
        console.log("No dashboard data (user logged out or error)");
        guestView.style.display = "block";
        userDashboard.style.display = "none";
    }
};

// Listen for layouts loaded event
document.addEventListener("layouts:loaded", () => {
    initDashboard();
});
