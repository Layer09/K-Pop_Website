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

        // Récupérer l'URL de la dernière page visitée
        let lastVisited = localStorage.getItem("lastVisitedPage") || "index.html";

        // Nettoyage après redirection
        localStorage.removeItem("lastVisitedPage");

        setTimeout(() => {
            window.location.href = lastVisited;
        }, 1500);
    } else {
        document.getElementById("message").innerText = "Identifiants incorrects.";
    }
});
