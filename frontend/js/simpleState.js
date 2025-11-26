import { supabase } from "./forms/supabaseClient.js";

/**
 * Save Automatic Scheduled Savings data
 * Maps to: automatic_scheduled_savings table
 */
export const saveAutomaticSavings = async (data) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated");
      return null;
    }

    // Check if user already has a record
    const { data: existing } = await supabase
      .from("automatic_scheduled_savings")
      .select("id")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    let result;
    let operation;
    if (existing) {
      // Update existing record
      operation = "UPDATED";
      const { data: updated, error } = await supabase
        .from("automatic_scheduled_savings")
        .update({
          frequency: data.frequency,
          amount_per_save: data.amount_per_save,
          total_saved: data.total_saved,
          interest_earned: data.interest_earned,
          plan_name: data.plan_name || "Auto Savings Plan",
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = updated;
    } else {
      // Insert new record
      operation = "INSERTED";
      const { data: inserted, error } = await supabase
        .from("automatic_scheduled_savings")
        .insert({
          user_id: user.id,
          frequency: data.frequency,
          amount_per_save: data.amount_per_save,
          total_saved: data.total_saved,
          interest_earned: data.interest_earned,
          plan_name: data.plan_name || "Auto Savings Plan",
        })
        .select()
        .single();

      if (error) throw error;
      result = inserted;
    }

    console.log(`Automatic savings ${operation}:`, result);
    return result;
  } catch (error) {
    console.error("Error saving automatic savings:", error);
    throw error;
  }
};

/**
 * Save Emergency Fund data
 * Maps to: emergency_fund table
 */
export const saveEmergencyFund = async (data) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated");
      return null;
    }

    const { data: existing } = await supabase
      .from("emergency_fund")
      .select("id")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    let result;
    if (existing) {
      const { data: updated, error } = await supabase
        .from("emergency_fund")
        .update({
          monthly_expense: data.monthly_expense,
          target_months: data.target_months,
          total_e_fund: data.total_e_fund,
          estimated_time: data.estimated_time,
          fund_name: data.fund_name || "Emergency Fund",
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = updated;
    } else {
      const { data: inserted, error } = await supabase
        .from("emergency_fund")
        .insert({
          user_id: user.id,
          monthly_expense: data.monthly_expense,
          target_months: data.target_months,
          total_e_fund: data.total_e_fund,
          estimated_time: data.estimated_time,
          fund_name: data.fund_name || "Emergency Fund",
        })
        .select()
        .single();

      if (error) throw error;
      result = inserted;
    }

    console.log("Emergency fund saved:", result);
    return result;
  } catch (error) {
    console.error("Error saving emergency fund:", error);
    throw error;
  }
};

/**
 * Save Savings Goal data
 * Maps to: savings_goal table
 */
export const saveSavingsGoal = async (data) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated");
      return null;
    }

    const { data: existing } = await supabase
      .from("savings_goal")
      .select("id")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    let result;
    if (existing) {
      const { data: updated, error } = await supabase
        .from("savings_goal")
        .update({
          target_amount: data.target_amount,
          current_amount: data.current_amount,
          monthly_savings: data.monthly_savings,
          remaining_time: data.remaining_time,
          goal_name: data.goal_name || "Savings Goal",
          description: data.description || null,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = updated;
    } else {
      const { data: inserted, error } = await supabase
        .from("savings_goal")
        .insert({
          user_id: user.id,
          target_amount: data.target_amount,
          current_amount: data.current_amount,
          monthly_savings: data.monthly_savings,
          remaining_time: data.remaining_time,
          goal_name: data.goal_name || "Savings Goal",
          description: data.description || null,
        })
        .select()
        .single();

      if (error) throw error;
      result = inserted;
    }

    console.log("Savings goal saved:", result);
    return result;
  } catch (error) {
    console.error("Error saving savings goal:", error);
    throw error;
  }
};

/**
 * Save Compound Interest data
 * Maps to: compound_interest table
 */
export const saveCompoundInterest = async (data) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated");
      return null;
    }

    const { data: existing } = await supabase
      .from("compound_interest")
      .select("id")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    let result;
    if (existing) {
      const { data: updated, error } = await supabase
        .from("compound_interest")
        .update({
          principal: data.principal,
          rate: data.rate,
          time_period: data.time_period,
          frequency: data.frequency,
          total_projected: data.total_projected,
          interest_earned: data.interest_earned,
          calculation_name: data.calculation_name || "Compound Interest",
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = updated;
    } else {
      const { data: inserted, error } = await supabase
        .from("compound_interest")
        .insert({
          user_id: user.id,
          principal: data.principal,
          rate: data.rate,
          time_period: data.time_period,
          frequency: data.frequency,
          total_projected: data.total_projected,
          interest_earned: data.interest_earned,
          calculation_name: data.calculation_name || "Compound Interest",
        })
        .select()
        .single();

      if (error) throw error;
      result = inserted;
    }

    console.log("Compound interest saved:", result);
    return result;
  } catch (error) {
    console.error("Error saving compound interest:", error);
    throw error;
  }
};

/**
 * Get all simulator data for the dashboard
 */
export const getDashboardData = async () => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Fetch data from all tables in parallel
    const [autoSavings, emergencyFund, savingsGoal, compoundInterest] = await Promise.all([
      supabase
        .from("automatic_scheduled_savings")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .maybeSingle(),
      supabase
        .from("emergency_fund")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .maybeSingle(),
      supabase
        .from("savings_goal")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .maybeSingle(),
      supabase
        .from("compound_interest")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .maybeSingle(),
    ]);

    return {
      autoSavings: autoSavings.data,
      emergencyFund: emergencyFund.data,
      savingsGoal: savingsGoal.data,
      compoundInterest: compoundInterest.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};

// Legacy functions - kept for backward compatibility
export const saveSimulatorData = async (data) => {
  console.warn("saveSimulatorData is deprecated. Use specific save functions instead.");
  return null;
};

export const getUserData = async () => {
  console.warn("getUserData is deprecated. Use specific get functions instead.");
  return null;
};
