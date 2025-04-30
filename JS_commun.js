    document.addEventListener("DOMContentLoaded", () => {
      // VOLUME
        // Gestion du volume global
        const globalVolumeInput = document.getElementById('globalVolume');
        const volumeValueDisplay = document.getElementById('volumeValue');
    
        let savedVolume = localStorage.getItem('volumeGlobal');
        if (savedVolume === null) {
            savedVolume = 50;
            localStorage.setItem('volumeGlobal', savedVolume);
        } else {
            savedVolume = parseFloat(savedVolume);
        }
    
        globalVolumeInput.value = savedVolume;
        volumeValueDisplay.textContent = savedVolume + '%';
    
        const applyGlobalVolume = () => {
            const realVolume = (savedVolume / 100) * 0.2;
            document.querySelectorAll('video').forEach(video => {
                video.volume = realVolume;
            });
        };
    
        applyGlobalVolume();
    
        globalVolumeInput.addEventListener('input', () => {
            savedVolume = parseFloat(globalVolumeInput.value);
            localStorage.setItem('volumeGlobal', savedVolume);
            volumeValueDisplay.textContent = savedVolume + '%';
            applyGlobalVolume();
        });
    
        // Observer pour les vidéos dynamiques
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'VIDEO') {
                        node.volume = (savedVolume / 100) * 0.2;
                    }
                    if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(video => {
                            video.volume = (savedVolume / 100) * 0.2;
                        });
                    }
                });
            });
        });
    
        observer.observe(document.body, { childList: true, subtree: true });

        
      //CONNEXION UTILISATEUR
        // Gestion de la connexion utilisateur
        const loginLink = document.getElementById("login-link");
        const userInfo = document.getElementById("user-info");
        const usernameDisplay = document.getElementById("username-display");
        const dropdownMenu = document.getElementById("dropdown-menu");
        const logoutButton = document.getElementById("logout");
        
        // Vérification de la connexion utilisateur avec localStorage
        let loggedInUser = localStorage.getItem("loggedInUser");
        
        if (loggedInUser) {
            let formattedName = loggedInUser.charAt(0).toUpperCase() + loggedInUser.slice(1);
        
            usernameDisplay.textContent = formattedName;
            loginLink.classList.add("hidden");        // Cache le lien "Se connecter"
            userInfo.classList.remove("hidden");      // Affiche le menu utilisateur
        
            // Toggle du menu déroulant au clic sur l'élément utilisateur
            userInfo.addEventListener("click", function (e) {
                e.stopPropagation(); // Empêche la fermeture immédiate par le document
                dropdownMenu.classList.toggle("hidden");
            });
        
            // Ferme le menu si on clique ailleurs
            document.addEventListener("click", function (e) {
                if (!userInfo.contains(e.target)) {
                    dropdownMenu.classList.add("hidden");
                }
            });
        
        } else {
            userInfo.classList.add("hidden");        // Cache le menu utilisateur
            loginLink.classList.remove("hidden");    // Affiche le lien "Se connecter"
        
            // Enregistre la page actuelle quand on clique sur "Se connecter"
            if (loginLink) {
                loginLink.addEventListener("click", (event) => {
                    localStorage.setItem("lastVisitedPage", window.location.href);
                    if (window.location.pathname !== "/Login.html") {
                        localStorage.setItem("lastVisitedPage", window.location.pathname);
                    }
                });
            }
        }
        
        // Afficher/masquer le menu déroulant
        if (userInfo) {
            userInfo.addEventListener("click", (event) => {
                event.stopPropagation(); // Empêche la fermeture immédiate après ouverture
                dropdownMenu.classList.toggle("hidden");
            });
        
            // Fermer le menu si on clique ailleurs
            document.addEventListener("click", (event) => {
                if (!userInfo.contains(event.target)) {
                    dropdownMenu.classList.add("hidden");
                }
            });
        }
        
        // Déconnexion
        if (logoutButton) {
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("loggedInUser");
                window.location.reload();
            });
        }
    });
