import { supabase } from "./supabaseClient.js";

const btnGoogleLogin = document.querySelectorAll(".google-login");
const btnFacebookLogin = document.querySelectorAll(".facebook-login");

const loginWithProvider = async (provider) => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/pocket-professor/frontend/auth/callback.html`,
      },
    });

    if (error) {
      throw new Error(error);
    }
  } catch (err) {
    console.error("error logueando con google", err);
  }
};

btnGoogleLogin.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    loginWithProvider("google");
  });
});

btnFacebookLogin.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    loginWithProvider("facebook");
  });
});
