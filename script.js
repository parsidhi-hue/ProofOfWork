// LOGIN AND SIGNUP TOGGLE

const authForm = document.getElementById("authForm");
const toggleAuth = document.getElementById("toggleAuth");
const authButton = document.getElementById("authButton");
const nameField = document.getElementById("nameField");
const fullName = document.getElementById("fullName");

let isSignup = false;

toggleAuth.addEventListener("click", function(event) {

    event.preventDefault();

    isSignup = !isSignup;

    if (isSignup) {

        nameField.style.display = "block";
        fullName.required = true;
        document.querySelector(".auth-box h1").textContent =
            "Create Account";

        document.querySelector(".auth-box > p").textContent =
            "Start building your professional identity.";

        authButton.textContent = "Sign Up";

        toggleAuth.textContent = "Login";

        toggleAuth.parentElement.firstChild.textContent =
            "Already have an account? ";

    } else {
            nameField.style.display = "none";
            fullName.required = false;
            fullName.value = "";

        document.querySelector(".auth-box h1").textContent =
            "Welcome Back!";

        document.querySelector(".auth-box > p").textContent =
            "Continue building your professional identity.";

        authButton.textContent = "Login";

        toggleAuth.textContent = "Create an account";

        toggleAuth.parentElement.firstChild.textContent =
            "New here? ";
    }

});

// SUPABASE AUTHENTICATION

authForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    authButton.disabled = true;

    try {
        if (isSignup) {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName.value
                    }
                }
            });

            if (error) throw error;

            const message = document.getElementById("authMessage");
        message.textContent = "Account created! Check your email for confirmation.";
            message.style.color = "#4ade80";
        } else {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            
            window.location.href = "dashboard.html";
        }
    } catch (error) {
    const message = document.getElementById("authMessage");
message.textContent = error.message;
message.style.color = "#ff6b6b";
    } finally {
        authButton.disabled = false;
    }
});