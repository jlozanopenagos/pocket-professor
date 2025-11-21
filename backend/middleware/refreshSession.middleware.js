import { supabase } from "../config/supabaseClient.js";

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["sb-refresh-token"];
    const accessToken = req.cookies["sb-access-token"];

    // continuar sin hacer nada si no hay refresh token
    if (!refreshToken) {
      return next();
    }

    // verificar que el access token no haya expirado para no renovar token innecesariamente
    if (accessToken) {
      try {
        const { data: accessData, error: errorData } = await supabase.auth.getUser(accessToken);
        if (accessData || !errorData) {
          req.user = accessData.user;
          return next();
        }
      } catch (_) {
        console.error("Access token expirado, se procedera con el refresco de este");
      }
    }

    // intentando renovar sesion
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    // si falla la renovacion (refresh expirado) limpiamos cookies
    if (error || !data.session) {
      console.error("Error al usar supabase para refresh", error);
      res.clearCookie("sb-access-token"), res.clearCookie("sb-refresh-token");
      return next();
    }

    // renovar cookies con nuevos tokens
    res.cookie("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.session.expires_in * 1000,
    });

    res.cookie("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60 * 1000,
    });

    req.user = data.user;
    next();
  } catch (error) {
    console.error("Error refrescando token", error);
    // Continuar aunque falle
    next();
  }
};
