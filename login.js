document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    // Hachage du mot de passe en SHA-256
    let hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    let user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === hashedPassword);

    if (user) {
        localStorage.setItem("loggedInUser", username);  // Sauvegarde de la session
        document.getElementById("message").innerText = "Connexion réussie ! Redirection...";
        setTimeout(() => {
            window.location.href = "dashboard.html";  // Redirection après connexion
        }, 1500);
    } else {
        document.getElementById("message").innerText = "Identifiants incorrects.";
    }
});
