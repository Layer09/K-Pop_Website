document.addEventListener("DOMContentLoaded", () => {
    // NAVIGATION DYNAMIQUE
    const container = document.getElementById("nav-container");
    if (container) {
        fetch("nav.html")
            .then(response => response.text())
            .then(data => {
                container.innerHTML = data;
            })
            .catch(error => {
                console.error("Erreur lors du chargement du menu de navigation :", error);
            });
    }

    // VOLUME GLOBAL
    const globalVolumeInput = document.getElementById('globalVolume');
    const volumeValueDisplay = document.getElementById('volumeValue');

    let savedVolume = localStorage.getItem('volumeGlobal');
    if (savedVolume === null) {
        savedVolume = 50;
        localStorage.setItem('volumeGlobal', savedVolume);
    } else {
        savedVolume = parseFloat(savedVolume);
    }

    if (globalVolumeInput && volumeValueDisplay) {
        globalVolumeInput.value = savedVolume;
        volumeValueDisplay.textContent = savedVolume + '%';

        globalVolumeInput.addEventListener('input', () => {
            savedVolume = parseFloat(globalVolumeInput.value);
            localStorage.setItem('volumeGlobal', savedVolume);
            volumeValueDisplay.textContent = savedVolume + '%';
            applyGlobalVolume();
        });
    }

    // Fonction d'application du volume global (accessible globalement)
    window.applyGlobalVolume = () => {
        const realVolume = (savedVolume / 100) * 0.2;
        document.querySelectorAll('video').forEach(video => {
            video.volume = realVolume;
        });
    };

    // Appliquer le volume initial aux vidéos existantes
    applyGlobalVolume();

    // Observer les vidéos ajoutées dynamiquement
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
});
