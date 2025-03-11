import os
import random
from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip, ImageClip, vfx
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from concurrent.futures import ProcessPoolExecutor, as_completed

# Répertoire contenant les vidéos
video_directory = "C:/Users/laura/Videos/Vidéos/Kpop/Episodes"

# Chemin de sauvegarde des clips temporaires
temp_clip_dir = "C:/Users/laura/Videos/Vidéos/Kpop/Blind_test/Videos/Temp"
os.makedirs(temp_clip_dir, exist_ok=True)

# Plages de temps prédéfinies (format: (début, fin))
time_ranges = [
    (6, 26.99), (27, 47.99), (48, 68.99), (69, 89.99), (90, 110.99),
    (111, 131.99), (132, 152.99), (153, 173.99), (174, 194.99),
    (195, 215.99), (216, 236.99), (237, 257.99), (258, 278.99), 
    (279, 299.99), (300, 320.99), (321, 341.99), (342, 362.99),
    (363, 383.99), (384, 404.99), (405, 425.99), (426, 446.99),
    (447, 467.99)
]

# Liste pour éviter les répétitions
deja_pris = []

# Charger les vidéos du répertoire une seule fois
video_files = [f for f in os.listdir(video_directory) if f.endswith('.mp4')]
loaded_videos = {f: VideoFileClip(os.path.join(video_directory, f)) for f in video_files}

# Création d'image texte
def create_text_image(text, fontsize=44, color="#00c4d6"):
    font = ImageFont.truetype("arial.ttf", fontsize)
    size = font.getbbox(text)[2:]
    image = Image.new("RGBA", size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)

    for offset in [(0, 0), (1, 0), (0, 1), (1, 1)]:
        draw.text(offset, text, font=font, fill=color)

    return np.array(image)

# Génération d'un extrait vidéo avec texte
def get_random_clip(index):
    double = False
    video_name, start, end = "None", 0, 0

    while not double:
        random_video = random.choice(video_files)
        video = loaded_videos[random_video]
        start, end = random.choice(time_ranges)
        video_name = os.path.splitext(random_video)[0]

        if (video_name, (start, end)) not in deja_pris:
            double = True
            deja_pris.append((video_name, (start, end)))

    video_clip = video.subclip(start, end)
    text_image = create_text_image(video_name)
    text_clip = ImageClip(text_image).set_duration(20).set_position((1134, 25))

    video_with_text = CompositeVideoClip([video_clip, text_clip])
    return video_with_text

# Fonction pour générer et enregistrer un clip
def create_and_save_clip(index, minuteur_path):
    video_with_text = get_random_clip(index)
    minuteur = VideoFileClip(minuteur_path).set_position((0, 0)).without_audio()
    blind_test_final = CompositeVideoClip([video_with_text, minuteur])
    blind_test_path = os.path.join(temp_clip_dir, f"temp_clip_{index}.mp4")
    blind_test_final.write_videofile(blind_test_path, codec='libx264', fps=48)
    return blind_test_path

# Code principal
if __name__ == '__main__':
    # Chemin du minuteur
    minuteur_path = "C:/Users/laura/Videos/Vidéos/Kpop/Blind_test/Videos/Minuteur_cadre-10s.mp4"
    debut_clip = VideoFileClip("C:/Users/laura/Videos/Vidéos/Kpop/Blind_test/Videos/Debut.mp4").without_audio()
    stop_3s = ImageClip("C:/Users/laura/Videos/Vidéos/Kpop/Blind_test/Videos/Pause.png").set_duration(3).without_audio()

    # Génération des clips en parallèle avec un maximum de 8 processus
    clip_paths = []
    with ProcessPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(create_and_save_clip, i, minuteur_path) for i in range(10)]
        for future in as_completed(futures):
            clip_paths.append(future.result())

    # Chargement et concaténation des clips finaux
    valid_clip_paths = [debut_clip] + [VideoFileClip(path) for path in clip_paths if path and os.path.exists(path)] + [stop_3s]
    final_video = concatenate_videoclips(valid_clip_paths).volumex(0.2)

    # Export de la vidéo finale
    final_video.write_videofile("C:/Users/laura/Videos/Vidéos/Kpop/Blind_test/Blind_test.mp4", remove_temp=True, codec='libx264', fps=48)

    # Suppression des clips temporaires après exportation
    for path in clip_paths:
        if os.path.exists(path):
            os.remove(path)

    # Fermeture des clips
    for video in loaded_videos.values():
        video.close()
    stop_3s.close()
    debut_clip.close()
    final_video.close()
