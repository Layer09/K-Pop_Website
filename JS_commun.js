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
        const loginContainer = document.getElementById("login-container");
        const loginLink = document.getElementById("login-link");
        const userInfo = document.getElementById("user-info");
        const usernameDisplay = document.getElementById("username-display");
        const dropdownMenu = document.getElementById("dropdown-menu");
        const logoutBtn = document.getElementById("logout");
    
        // Affiche l'état connecté ou non
        const user = localStorage.getItem("user");
        if (user) {
            loginContainer.classList.add("hidden");
            userInfo.classList.remove("hidden");
            usernameDisplay.textContent = user;
        } else {
            loginContainer.classList.remove("hidden");
            userInfo.classList.add("hidden");
        }
    
        // Redirection vers login avec paramètre de retour
        loginLink.addEventListener("click", function (e) {
            e.preventDefault();
            const currentPage = window.location.href;
            window.location.href = `Login.html?redirect=${encodeURIComponent(currentPage)}`;
        });
    
        // Menu déroulant utilisateur
        userInfo.addEventListener("click", function () {
            dropdownMenu.classList.toggle("show");
        });
    
        // Déconnexion
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("user");
            window.location.reload();
        });
    });
