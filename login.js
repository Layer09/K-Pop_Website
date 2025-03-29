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

        // Récupérer l'URL de la page précédente
        let previousPage = localStorage.getItem("previousPage") || "index.html"; // Page par défaut si non définie

        setTimeout(() => {
            window.location.href = previousPage;  // Redirection vers la page précédente
        }, 1500);
    } else {
        document.getElementById("message").innerText = "Identifiants incorrects.";
    }
});
