import { supabase } from "./supabaseClient.js";

supabase.auth.onAuthStateChange(async (event, session) => {
  console.log("Auth Event", event);

  if (event === "SIGNED_IN" && session) {
    console.log("Usuario autenticado", session.user);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_in: session.expires_in,
        }),
      });

      if (response.ok) {
        window.location.href = "/pocket-professor/frontend/index.html";
      } else {
        console.error("Failed to sync session with backend");
        window.location.href = "/pocket-professor/frontend/index.html";
      }
    } catch (e) {
      console.error("Error syncing session", e);
      window.location.href = "/pocket-professor/frontend/index.html";
    }
  }
});

setTimeout(() => {
  console.warn("Timeout Alcanzado, redirigiendo");
  window.location.href = "/pocket-professor/frontend/index.html";
}, 5000);
