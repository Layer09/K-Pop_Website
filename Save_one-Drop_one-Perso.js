document.addEventListener("DOMContentLoaded", () => {
    let username = localStorage.getItem("loggedInUser");
    let firstVideo = ''; 
    let secondVideo = '';
    var liste_liste = ['0','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100'];
    var liste0 = [];
    var liste5 = [];
    var liste10 = [];
    var liste15 = [];
    var liste20 = [];
    var liste25 = [];
    var liste30 = [];
    var liste35 = [];
    var liste40 = [];
    var liste45 = [];
    var liste50 = [];
    var liste55 = [];
    var liste60 = [];
    var liste65 = [];
    var liste70 = [];
    var liste75 = [];
    var liste80 = [];
    var liste85 = [];
    var liste90 = [];
    var liste95 = [];
    var liste100 = [];
    if (username) {
        const usernameDisplay = document.getElementById("username-display");
        if (usernameDisplay) {
            usernameDisplay.textContent = username;
        }
        let usernameMAJ = username.charAt(0).toUpperCase() + username.slice(1);
        const csvPath = `./Donnees_CSV/${usernameMAJ}/${usernameMAJ}_Stats_Titres.csv`;
    
        async function chargerCSV(csvPath) {
            try {
                const response = await fetch(csvPath);
                if (!response.ok) {
                    throw new Error("Impossible de charger le fichier CSV.");
                }
    
                const csvText = await response.text();
                const lines = csvText.split("\n").filter(line => line.trim() !== "");
                const headers = lines[0].split(",");
    
                const idIndex = headers.findIndex(h => h.trim().toLowerCase() === "id");
                const noteIndex = headers.findIndex(h => h.trim().toLowerCase() === "note");
    
                const titres_restants = {};
    
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(",");
                    let rawId = values[idIndex].trim();
                    let id = rawId.padStart(3, "0");
                    const videoPath = videoList.find(path => path.includes(id));
                    const rawNote = values[noteIndex].trim();
                    const note = rawNote * 10;
                    var nomListe = 'liste' + note;
                    if (videoPath) {
                        nomListe.push(videoPath);
                    }
                }
            } catch (error) {
                console.error("Erreur lors du traitement du CSV :", error);
                return {};
            }
        }
    
        // Appel asynchrone
        (async () => {
            const titres_restants = await chargerCSV(csvPath);
            //console.log("titres_restants :", titres_restants);
            //console.log("titres_restants.length :", Object.keys(titres_restants).length);
        })();
        
        function getRandomList() {
            // Filtrer toutes les listes non vides
            var listesNonVides = liste_liste.filter(function(suffixe) {
                var nomListe = 'liste' + suffixe;
                //console.log("nomListe :", nomListe);
                var liste = window[nomListe];
                return Array.isArray(liste) && liste.length > 0;
            });
        
            // Si aucune liste non vide, afficher un message et retourner null
            if (listesNonVides.length === 0) {
                alert("Tu as finis le challenge ! Tu n'as pas trop soufert ?");
                return null;
            }
        
            // Choisir aléatoirement une liste non vide
            var suffixe = listesNonVides[Math.floor(Math.random() * listesNonVides.length)];
            var nomListe = 'liste' + suffixe;
            var listeSelectionnee = window[nomListe];
        
            return [...listeSelectionnee]; // Retourner une copie
        }
        
        function getStandNote(include = null) {
                 if (include != null) {
                     return include;
                 } else {
                     //console.log("titres_restants =", titres_restants);
                     let catego = null;
                     const cles = Object.keys(liste_liste);
                     //console.log("cles =", cles);
                     const clesNonVides = cles.filter(cle => cles.length > 0);
                     //console.log("clesNonVides =", clesNonVides);
                     // Vérifier s'il y a au moins une liste non vide
                     if (clesNonVides.length > 0) {
                       // Choisir une clé aléatoire parmi celles non vides
                       const catego = clesNonVides[Math.floor(Math.random() * clesNonVides.length)];
                       return catego;
                     }
               }
         }
     
         function getRandomVideo(liste, include = null, exclude = null) {
             include = getStandNote(include);  // Assurer que include a une valeur valide
             // Ajouter une validation avant d'accéder à titres_restants[include]
             console.log("liste :", liste);
             console.log("include :", include);
             const cles = Object.keys(liste);
             console.log("cles :", cles);
             let available = cles[Math.floor(Math.random() * cles.length)]//.filter(v => v !== exclude);
             //console.log("available", available);
    
             // Si il y a des vidéos disponibles, on en retourne une au hasard
             if (available.length > 0) {
                 video = available[Math.floor(Math.random() * available.length)];
                 console.log("video :", video);
                 return [include, video];
             } else {
                 console.error("Aucune vidéo disponible après filtrage");
                 return [include, null];
             }
         }
    
        function startChallenge(titres_restants) {
            if (liste_liste == []) {
            (async () => {
                const titres_restants = await chargerCSV(csvPath);
                //console.log("titres_restants :", titres_restants);
                //console.log("titres_restants.length :", Object.keys(titres_restants).length);
            })();
            }
            
            // Supprimer les anciennes vidéos avant de commencer une nouvelle
            cleanupVideos();
    
            // Créer et ajouter le conteneur pour la première vidéo
            //console.log("titres_restants =", titres_restants);
            liste = getRandomList(liste_liste);
            [include, firstVideo] = getRandomVideo(liste_liste);
            const singleContainer = document.createElement('div');
            singleContainer.id = 'single-video';
            singleContainer.classList.add('single-video');
            singleContainer.innerHTML = `<video width="720" height="405" id="videoA" controls></video>`;
            document.body.appendChild(singleContainer);
    
            let videoA = document.getElementById('videoA');
            videoA.src = firstVideo;
            /* videoA.volume = 0.1; */
            videoA.play();
    
            videoA.onended = () => {
                // Supprimer complètement le conteneur vidéo A
                videoA.pause();
                singleContainer.remove();  // Retirer le conteneur et la vidéo
    
                // Créer et ajouter le conteneur pour la deuxième vidéo
                [includeBonus, secondVideo] = getRandomVideo(liste_liste, include, firstVideo);
                const secondContainer = document.createElement('div');
                secondContainer.id = 'second-video';
                secondContainer.classList.add('single-video');
                secondContainer.innerHTML = `<video width="720" height="405" id="videoB" controls></video>`;
                document.body.appendChild(secondContainer);
    
                let videoB = document.getElementById('videoB');
                videoB.src = secondVideo;
                /* videoB.volume = 0.1; */
                videoB.play();
    
                videoB.onended = () => {
                    // Supprimer complètement le conteneur vidéo B
                    videoB.pause();
                    secondContainer.remove();  // Retirer le conteneur et la vidéo
    
                    // Montrer les petites vidéos
                    document.getElementById('dual-videos').classList.remove('hidden');
                    choiceA.src = firstVideo;
                    choiceB.src = secondVideo;
                    choiceA.play();
                    choiceB.play();
                };
            };
        }
    
        function cleanupVideos() {
            // Vérifie si un conteneur vidéo existe déjà et le supprime
            let oldSingleVideo = document.getElementById('single-video');
            let oldSecondVideo = document.getElementById('second-video');
    
            if (oldSingleVideo) oldSingleVideo.remove();
            if (oldSecondVideo) oldSecondVideo.remove();
    
            // Supprime aussi les vidéos petites (si elles existent déjà)
            let choiceA = document.getElementById('choiceA');
            let choiceB = document.getElementById('choiceB');
    
            if (choiceA) {
                choiceA.pause();
                choiceA.setAttribute('disableRemotePlayback', true);
                choiceA.src = '';
            }
            if (choiceB) {
                choiceB.pause();
                choiceB.setAttribute('disableRemotePlayback', true);
                choiceB.src = '';
            }
    
            // Masquer la section de choix des petites vidéos
            document.getElementById('dual-videos').classList.add('hidden');
        }
    
        choiceA.onclick = () => {
            /* alert('Tu as choisi la première vidéo !'); */
            cleanupChoices();
        };
    
        choiceB.onclick = () => {
            /* alert('Tu as choisi la deuxième vidéo !'); */
            cleanupChoices();
        };
    
        function cleanupChoices() {
            // Arrêter les petites vidéos quand l'utilisateur fait un choix
            cleanupVideos();
    
            // Démarrer un nouveau challenge (vider les éléments et recharger)
            startChallenge(liste_liste);
        }
    
        let hoverTimeoutA;
        let hoverTimeoutB;
    
        choiceA.addEventListener('mouseenter', () => {
            hoverTimeoutA = setTimeout(() => {
                choiceA.muted = false;
                /* choiceA.volume = 0.1; */
            }, 1000);
        });
    
        choiceA.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeoutA);
            choiceA.muted = true;
        });
    
        choiceB.addEventListener('mouseenter', () => {
            hoverTimeoutB = setTimeout(() => {
                choiceB.muted = false;
                /* choiceB.volume = 0.1; */
            }, 1000);
        });
    
        choiceB.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeoutB);
            choiceB.muted = true;
        });
    
        window.onload = startChallenge(liste_liste);
        } else {
        alert("Connecte-toi d'abord !");
        window.location.href = "Login.html";
    }
});
