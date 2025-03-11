import os
import random
from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip, ImageClip, vfx, ColorClip
from moviepy.video.fx.all import crop
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import csv

# Répertoire contenant les vidéos
video_directory = "C:/Users/laura/Videos/Vidéos/Kpop/Episodes"

nombre_elements = len(os.listdir(video_directory))
#print(f"Nombre d'éléments dans le répertoire '{video_directory}': {nombre_elements}")

# Création de la liste de tous les extraits
extraits_restants = []
for i in range(nombre_elements) :
    j = 1
    while j <= 22 :
        extraits_restants.append((i+1,j))
        j = j+1
print(f"Nombre d'extraits restant (début) : {len(extraits_restants)}")
#print(extraits_restants)

# Écriture dans le fichier CSV
with open("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Tous_les_extraits.csv", mode="w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(extraits_restants)


# Compter le nombre de lignes dans le fichier CSV
with open("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Extraits_restants.csv", mode='r+', newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    # Utilisation de `sum` pour compter les lignes
    nombre_de_lignes = sum(1 for row in reader)
    #print(f"Le fichier CSV contient {nombre_de_lignes} lignes.")
    # Revenir au début du fichier pour la lecture réelle
    csvfile.seek(0)
    if nombre_de_lignes < 22 :
        writer = csv.writer(csvfile)
        writer.writerows(extraits_restants)
        with open("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Episode.csv", mode="w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerows([['0']])
    else :
        extraits_restants = []
        for row in reader:
            extraits_restants.append(tuple(map(int, row)))
        #print(len(extraits_restants))
#print(f"extraits_restants = {extraits_restants}")

with open("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Episode.csv", mode='r', newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        episode = int(row[0])
        #print(f"episode = {episode}")


# Lister tous les fichiers MP4 dans le répertoire
video_files = [f for f in os.listdir(video_directory) if f.endswith('.mp4')]

# Fonction pour créer un texte sous forme d'image
def create_text_image(text, fontsize=44, color="#00c4d6"):
    font = ImageFont.truetype("arial.ttf", fontsize)
    size = font.getbbox(text)[2:]
    image = Image.new("RGBA", size, (255, 255, 255, 0))  # Transparent background
    draw = ImageDraw.Draw(image)

    # Simule le gras en dessinant le texte plusieurs fois avec de petits décalages
    for offset in [(0, 0), (1, 0), (0, 1), (1, 1)]:
        draw.text(offset, text, font=font, fill=color)

    return np.array(image)


# Fonction pour sélectionner un extrait aléatoire avec texte
def get_random_clip():
    element_aleatoire = random.choice(extraits_restants)
    #print(f"L'élément sélectionné est : {element_aleatoire}")
    random_video = str("Kpop" + str(element_aleatoire[0]) + ".mp4")
    #print(f"random_video = {random_video}")
    video_path = os.path.join(video_directory, random_video)
    video = VideoFileClip(video_path)
    start = 6 + 21*element_aleatoire[1] -21
    end = start + 20
    #print(f"start = {start} ; end = {end}")

    extraits_restants.remove(element_aleatoire)

    with open("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Extraits_restants.csv", mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        lignes = [row for row in reader]

    # Filtrer les lignes pour enlever celle qui correspond à 'element_aleatoire'
    lignes_filtrees = [ligne for ligne in lignes if tuple(map(int, ligne)) != element_aleatoire]

    # Écrire le fichier CSV sans la ligne à supprimer
    with open("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Extraits_restants.csv", mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(lignes_filtrees)

    # Extraire le nom de la vidéo sans l'extension
    video_name = os.path.splitext(random_video)[0]
    #print(video_name)

    video_clip = video.subclip(start, end)

    # Extraire le nom de la vidéo sans l'extension
    video_name = os.path.splitext(random_video)[0]
    #print(video_name)
    
    # Extraire les rectangles
    rect1_temp = video_clip.crop(x1=195, y1=18, x2=826, y2=90).without_audio()   # Rectangle 1 ("Artiste")
    rect2_temp = video_clip.crop(x1=1192, y1=993, x2=1802, y2=1070).without_audio()  # Rectangle 2 ("Titre")

    small_rect = ColorClip(size=(676 - 635, 90 - 73), color=(0, 0, 0))
    small_rect = small_rect.set_position((635 - 195, 73 - 18))  # Position par rapport au crop de rect1_temp

    # Superposer le petit rectangle noir sur rect1
    rect1 = CompositeVideoClip([rect1_temp, small_rect])

    small_rect1 = ColorClip(size=(1286 - 1253, 1001 - 993), color=(0, 0, 0))
    small_rect1 = small_rect1.set_position((1253 - 1192, 993 - 993))  # Position par rapport au crop de rect2_temp

    small_rect2 = ColorClip(size=(1802 - 1796, 1070 - 1050), color=(0, 0, 0))
    small_rect2 = small_rect2.set_position((1796 - 1192, 1050 - 993))  # Position par rapport au crop de rect2_temp

    # Superposer le petit rectangle noir sur rect1
    rect2 = CompositeVideoClip([rect2_temp, small_rect1, small_rect2])

    extrait_video = video_clip.crop(x1=546, y1=131, x2=1372, y2=939).without_audio()
    extrait_video_small = extrait_video.fl_image(lambda frame: frame[::2, ::2, :]) #réduit la taille de l'extrait de pause (divisé par 2)

    # Créer une image de texte
    text_image = create_text_image(video_name)
    text_clip = ImageClip(text_image).set_duration(video_clip.duration).set_position((1134, 25))

    # Superposer le texte sur la vidéo
    video_with_text = CompositeVideoClip([video_clip, text_clip])

    return video_with_text, rect1, rect2, extrait_video_small

# Charger la vidéo de pause "Cadre_minuteur"
stop_1s = VideoFileClip("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/Videos/Mini_pause.mp4")
stop_5s = stop_1s.fx(vfx.speedx, 0.2)
pause_clip = VideoFileClip("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/Videos/Minuteur_cadre-5s.mp4")
debut_clip = VideoFileClip("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/Videos/Debut.mp4")

# Liste pour stocker tous les clips
all_clips = [debut_clip]

episode = int(episode)+1

for _ in range(11):
    # Sélectionner deux extraits aléatoires
    clip1, rect1_clip1, rect2_clip1, extrait_video1 = get_random_clip()
    clip2, rect1_clip2, rect2_clip2, extrait_video2 = get_random_clip()

    pause = CompositeVideoClip([
        pause_clip,
        extrait_video1.set_position((256, 308)).set_duration(pause_clip.duration),  # Extrait 1
        extrait_video2.set_position((1259, 308)).set_duration(pause_clip.duration),  # Extrait 2
        rect1_clip1.set_position((243, 247)).set_duration(pause_clip.duration),  # Artiste extrait 1
        rect2_clip1.set_position((240, 713)).set_duration(pause_clip.duration),  # Titre extrait 1
        rect1_clip2.set_position((1248, 247)).set_duration(pause_clip.duration),  # Artiste extrait 2
        rect2_clip2.set_position((1244, 713)).set_duration(pause_clip.duration),  # Titre extrait 2
    ])
    
    # Regrouper les deux clips et la pause
    group = concatenate_videoclips([clip1, stop_1s, clip2, pause])
    
    # Ajouter ce groupe à la liste des clips
    all_clips.append(group)

    """
    # Fermer les clips intermédiaires
    clip1.close()
    clip2.close()
    rect1_clip1.close()
    rect2_clip1.close()
    extrait_video1.close()
    rect1_clip2.close()
    rect2_clip2.close()
    extrait_video2.close()
    """

    print(f"Nombre d'extraits restant (en cours) : {len(extraits_restants)}")

print(f"Nombre d'extraits restant (fin) : {len(extraits_restants)}")

#finit avec une courte pause
all_clips.append(stop_5s)

# Fusionner tous les groupes en une seule vidéo
final_video = concatenate_videoclips(all_clips)

# Diminuer le son (20% du volume initial)
final_video = final_video.volumex(0.2)

# Enregistrer la vidéo finale
nom_video = "C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/XXL"+str(episode)+"-Save_one-Drop_one.mp4"
final_video.write_videofile(nom_video)

with open("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Episode.csv", mode='w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows([[episode]])
