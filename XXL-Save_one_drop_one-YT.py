import os
import random
from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip, ImageClip, vfx, ColorClip
from moviepy.video.fx.all import crop
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import csv
from pytube import YouTube

# Liste des URLs YouTube pour les vidéos
video_urls = {
    "K-Pop_01": "https://youtu.be/fyJr4CEKXkA",
    "K-Pop_02": "https://youtu.be/rc0Fl6Fs6X4",
    "K-Pop_03": "https://youtu.be/2KxjKWK_rdg",
    "K-Pop_04": "https://youtu.be/dRgOcrMnLWQ",
    "K-Pop_05": "https://youtu.be/thHay-4169o",
    "K-Pop_06": "https://youtu.be/34UzRxwr1Mc",
    "K-Pop_07": "https://youtu.be/f5JcMapB6Ro",
    "K-Pop_08": "https://youtu.be/JTOFo8VwbXc",
    "K-Pop_09": "https://youtu.be/jcm2-gAmuOY",
    "K-Pop_10": "https://youtu.be/j5HycOw2cuo",
    "K-Pop_11": "https://youtu.be/xPKYA3c3qbE",
    "K-Pop_12": "https://youtu.be/CrsWqDTWm4U",
    "K-Pop_13": "https://youtu.be/71y1sD5CD_s",
    "K-Pop_14": "https://youtu.be/GJJeF5kMPqQ",
    "K-Pop_15": "https://youtu.be/TFDf6sEukkg",
    "K-Pop_16": "https://youtu.be/9KHrxeI9LII",
    "K-Pop_17": "https://youtu.be/7Y19u5x1h6w",
    "K-Pop_18": "https://youtu.be/iRXC488cqQE",
    "K-Pop_19": "https://youtu.be/bQOwCLr2exw",
    "K-Pop_20": "https://youtu.be/Nl9U_brLCwo"
}

# Répertoire temporaire pour stocker les vidéos téléchargées
temp_video_dir = "C:/Users/laura/Videos/Vidéos/Kpop/Temp_Videos"
os.makedirs(temp_video_dir, exist_ok=True)

# Télécharger les vidéos YouTube
def download_video(url, video_name):
    yt = YouTube(url)
    stream = yt.streams.filter(file_extension="mp4", resolution="720p").first()  # Choisir le stream en 720p
    output_path = os.path.join(temp_video_dir, video_name + ".mp4")
    stream.download(output_path=output_path)
    return output_path

# Répertoire pour les extraits et les sauvegardes
video_directory = temp_video_dir
nombre_elements = len(video_urls)

# Création de la liste de tous les extraits
extraits_restants = []
for i in range(nombre_elements):
    j = 1
    while j <= 22:
        extraits_restants.append((i+1, j))
        j = j + 1

# Écriture dans le fichier CSV
with open("C:/Users/laura/Videos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Tous_les_extraits.csv", mode="w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(extraits_restants)

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
    video_name = f"K-Pop_{element_aleatoire[0]}"
    video_url = video_urls[video_name]
    
    # Télécharger la vidéo YouTube
    video_path = download_video(video_url, video_name)
    video = VideoFileClip(video_path)
    
    start = 6 + 21 * element_aleatoire[1] - 21
    end = start + 20

    extraits_restants.remove(element_aleatoire)

    with open("C:/Users/laura/Vidéos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Extraits_restants.csv", mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        lignes = [row for row in reader]

    # Filtrer les lignes pour enlever celle qui correspond à 'element_aleatoire'
    lignes_filtrees = [ligne for ligne in lignes if tuple(map(int, ligne)) != element_aleatoire]

    # Écrire le fichier CSV sans la ligne à supprimer
    with open("C:/Users/laura/Vidéos/Vidéos/Kpop/Save_one-Drop_one/EpisodeXXL/Extraits_restants.csv", mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(lignes_filtrees)

    video_clip = video.subclip(start, end)
    
    # Récupérer des parties spécifiques de la vidéo
    rect1_temp = video_clip.crop(x1=195, y1=18, x2=826, y2=90).without_audio()
    rect2_temp = video_clip.crop(x1=1192, y1=993, x2=1802, y2=1070).without_audio()

    # Créer une image de texte
    text_image = create_text_image(video_name)
    text_clip = ImageClip(text_image).set_duration(video_clip.duration).set_position((1134, 25))

    # Superposer le texte sur la vidéo
    video_with_text = CompositeVideoClip([video_clip, text_clip])

    return video_with_text, rect1_temp, rect2_temp

# Charger les vidéos de pause et d'intro
stop_1s = VideoFileClip("C:/Users/laura/Vidéos/Vidéos/Kpop/Save_one-Drop_one/Videos/Mini_pause.mp4")
pause_clip = VideoFileClip("C:/Users/laura/Vidéos/Vidéos/Kpop/Save_one-Drop_one/Videos/Minuteur_cadre-5s.mp4")
debut_clip = VideoFileClip("C:/Users/laura/Vidéos/Vidéos/Kpop/Save_one-Drop_one/Videos/Debut.mp4")

# Liste pour stocker tous les clips
all_clips = [debut_clip]

episode = 1  # Vous pouvez ajuster ce numéro en fonction de la logique de votre programme

for _ in range(11):
    # Sélectionner deux extraits aléatoires
    clip1, rect1_clip1, rect2_clip1 = get_random_clip()
    clip2, rect1_clip2, rect2_clip2 = get_random_clip()

    pause = CompositeVideoClip([
        pause_clip,
        rect1_clip1.set_position((243, 247)).set_duration(pause_clip.duration),  # Artiste extrait 1
        rect2_clip1.set_position((240, 713)).set_duration(pause_clip.duration),  # Titre extrait 1
        rect1_clip2.set_position((1248, 247)).set_duration(pause_clip.duration),  # Artiste extrait 2
        rect2_clip2.set_position((1244, 713)).set_duration(pause_clip.duration),  # Titre extrait 2
    ])
    
    # Regrouper les deux clips et la pause
    group = concatenate_videoclips([clip1, stop_1s, clip2, pause])
    
    # Ajouter ce groupe à la liste des clips
    all_clips.append(group)

print(f"Nombre d'extraits restant (fin) : {len(extraits_restants)}")

# Fusionner tous les groupes en une seule vidéo
final_video = concatenate_videoclips(all_clips)

# Diminuer le son (20% du volume initial)
final_video = final_video.volumex(0.2)

# Enregistrer la vidéo finale
nom_video = f"C:/Users/laura/Vidéos/Vidéos/Kpop/Save_one-Drop_one/XXL{episode}-Save_one-Drop_one.mp4"
final_video.write_videofile(nom_video)

# Nettoyage des fichiers temporaires téléchargés
for video_file in os.listdir(temp_video_dir):
    os.remove(os.path.join(temp_video_dir, video_file))
