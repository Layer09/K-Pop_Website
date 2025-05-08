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
    
        const loggedInUser = localStorage.getItem("loggedInUser");
    
        if (loggedInUser) {
            // Utilisateur connecté
            const formattedName = loggedInUser.charAt(0).toUpperCase() + loggedInUser.slice(1);
            usernameDisplay.textContent = formattedName;
    
            // Affiche le bloc utilisateur et cache "Me connecter"
            if (userIsLoggedIn) {
                document.querySelector('.guest').classList.add('hidden');
                document.querySelector('.logged').classList.remove('hidden');
            } else {
                document.querySelector('.guest').classList.remove('hidden');
                document.querySelector('.logged').classList.add('hidden');
            }
    
            // Affiche ou masque le menu au clic sur la zone utilisateur
            userInfo.addEventListener("click", (event) => {
                event.stopPropagation();
                dropdownMenu.classList.toggle("hidden");
            });
    
            // Ferme le menu si on clique ailleurs
            document.addEventListener("click", (event) => {
                if (!userInfo.contains(event.target)) {
                    dropdownMenu.classList.add("hidden");
                }
            });
    
        } else {
            // Utilisateur non connecté
            userInfo.classList.add("hidden");
            loginLink.classList.remove("hidden");
    
            // Enregistre la page actuelle avant redirection
            if (loginLink) {
                loginLink.addEventListener("click", () => {
                    const currentPath = window.location.pathname;
                    const currentURL = window.location.href;
                    localStorage.setItem("lastVisitedPage", currentPath !== "/Login.html" ? currentPath : currentURL);
                });
            }
        }
    
        // Déconnexion
        if (logoutButton) {
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("loggedInUser");
                window.location.reload();
            });
        }
    });
