import { supabase } from "./forms/supabaseClient";

export const saveSimulatorData = async (data) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error);
    }

    const { data: result, error: errorResult } = await supabase
      // .from("")
      .upsert(
        {
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (errorResult) {
      console.error("Error en el guardado de la data del simulator en la base de datos", errorResult);
      throw new Error(errorResult);
    }

    return result;
  } catch (err) {
    console.error("Problemas guardando datos de los simuladores", err);
  }
};

export const getUserData = async () => {
  try {
    const {
      data: { userData },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error);
    }

    const { data: result, error: errorResult } = await supabase.from("").select("*");
    eq("user_id", userData.id);
    single();

    if (errorResult && errorResult.code !== "PGRST116") {
      console.error("Error leyendo:", error);
    }

    return result;
  } catch (err) {
    console.log("error al obtener la data del usuario de la base de datos para el uso en los simuladores", err);
  }
};
