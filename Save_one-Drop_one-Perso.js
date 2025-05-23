document.addEventListener("DOMContentLoaded", () => {
    let username = localStorage.getItem("loggedInUser");
    const videoSources = ['./videos/001-BTS-War_of_hormones-Ep01-01.mp4', './videos/002-Stray_Kids-Hellevator-Ep01-02.mp4', './videos/003-Gidle-Latata-Ep01-03.mp4', './videos/004-Exo-Monster-Ep01-04.mp4', './videos/005-Ateez-Crazy_form-Ep01-05.mp4', './videos/006-Jennie-Solo-Ep01-06.mp4', './videos/007-Wanna_one-Beautiful-Ep01-07.mp4', './videos/008-Stray_Kids-Red_lights-Ep01-08.mp4', './videos/009-Dreamcatcher-Scream-Ep01-09.mp4', './videos/010-BTS-Save_me-Ep01-10.mp4', './videos/011-NCT_127-Fact_check-Ep01-11.mp4', './videos/012-BlackPink-Ddu_du_ddu_du-Ep01-12.mp4', './videos/013-Agust_D-Agust_D-Ep01-13.mp4', './videos/014-TXT-Loser=Lover-Ep01-14.mp4', './videos/015-Hwa_Sa-Maria-Ep01-15.mp4', './videos/016-BTS-Run-Ep01-16.mp4', './videos/017-Itzy-Loco-Ep01-17.mp4', './videos/018-Enhypen-Fever-Ep01-18.mp4', './videos/019-Stray_Kids-Miroh-Ep01-19.mp4', './videos/020-Twice-One_spark-Ep01-20.mp4', './videos/021-Seventeen-Rock_with_you-Ep01-21.mp4', './videos/022-Psy-That_that-Ep01-22.mp4', './videos/023-BigBang-Fantastic_baby-Ep02-01.mp4', './videos/024-Aespa-Drama-Ep02-02.mp4', './videos/025-Seventeen-Super-Ep02-03.mp4', './videos/026-Stray_Kids-Maniac-Ep02-04.mp4', './videos/027-Le_Sserafim-Antifragile-Ep02-05.mp4', './videos/028-BTS-NO-Ep02-06.mp4', './videos/029-Jung_Kook-Seven-Ep02-07.mp4', './videos/030-BlackPink-How_you_like_that-Ep02-08.mp4', './videos/031-Stray_Kids-District_9-Ep02-09.mp4', './videos/032-Exo-Love_shot-Ep02-10.mp4', './videos/033-Nmixx-Soñar-Ep02-11.mp4', './videos/034-Ateez-Inception-Ep02-12.mp4', './videos/035-Enhypen-Sweet_venom-Ep02-13.mp4', './videos/036-Lisa-Lalisa-Ep02-14.mp4', './videos/037-Stray_Kids-Thunderous-Ep02-15.mp4', './videos/038-Jennie-You_&_Me-Ep02-16.mp4', './videos/039-BTS-Idol-Ep02-17.mp4', './videos/040-Dreamcatcher-Boca-Ep02-18.mp4', './videos/041-TXT-Back_for_more-Ep02-19.mp4', './videos/042-Jimin-Set_me_free-Ep02-20.mp4', './videos/043-Ive-I_am-Ep02-21.mp4', './videos/044-BTS-Not_today-Ep02-22.mp4', './videos/045-iKon-Love_scenario-Ep03-01.mp4', './videos/046-Aespa-Black_mamba-Ep03-02.mp4', './videos/047-Stray_Kids-The_sound-Ep03-03.mp4', './videos/048-Itzy-Born_to_be-Ep03-04.mp4', './videos/049-Treasure-Move-Ep03-05.mp4', './videos/050-BabyMonster-Batter_up-Ep03-06.mp4', './videos/051-Got7-If_you_do-Ep03-07.mp4', './videos/052-BTS-Stay_gold-Ep03-08.mp4', './videos/053-Lisa-Money-Ep03-09.mp4', './videos/054-TXT-Good_boy_gone_bad-Ep03-10.mp4', './videos/055-Stray_Kids-Megaverse-Ep03-11.mp4', './videos/056-Jisoo-Flower-Ep03-12.mp4', './videos/057-BTS-Fire-Ep03-13.mp4', './videos/058-Jung_Kook-Standing_next_to_you-Ep03-14.mp4', './videos/059-Everglow-Dun_dun-Ep03-15.mp4', './videos/060-Seventeen-Fighting-Ep03-16.mp4', './videos/061-Girls_Generation-Run_devil_run-Ep03-17.mp4', './videos/062-BTS-MIC_drop-Ep03-18.mp4', './videos/063-Ateez-Bouncy-Ep03-19.mp4', './videos/064-BlackPink-Pink_venom-Ep03-20.mp4', './videos/065-Stray_Kids-Back_door-Ep03-21.mp4', './videos/066-Enhypen-Drunk_Dazed-Ep03-22.mp4', './videos/067-Dreamcatcher-Odd_eye-Ep04-01.mp4', './videos/068-BTS-Butter-Ep04-02.mp4', './videos/069-Jung_Kook-3D-Ep04-03.mp4', './videos/070-BlackPink-Kill_this_love-Ep04-04.mp4', './videos/071-Stray_Kids-Social_path-Ep04-05.mp4', './videos/072-Kai-Rover-Ep04-06.mp4', './videos/073-Illit-Magnetic-Ep04-07.mp4', './videos/074-BigBang-Bang_bang_bang-Ep04-08.mp4', './videos/075-TXT-Chasing_that_feeling-Ep04-09.mp4', './videos/076-Aespa-Supernova-Ep04-10.mp4', './videos/077-BTS-I_need_U-Ep04-11.mp4', './videos/078-Gidle-Super_lady-Ep04-12.mp4', './videos/079-Stray_Kids-Topline-Ep04-13.mp4', './videos/080-Ateez-Wonderland-Ep04-14.mp4', './videos/081-Le_Sserafim-Smart-Ep04-15.mp4', './videos/082-Shaun-Way_back_home-Ep04-16.mp4', './videos/083-Treasure-Jikjin-Ep04-17.mp4', './videos/084-Nayeon-Abcd-Ep04-18.mp4', './videos/085-BTS-On-Ep04-19.mp4', './videos/086-Seventeen-Maestro-Ep04-20.mp4', './videos/087-Lisa-Rockstar-Ep04-21.mp4', './videos/088-Stray_Kids-Lalalala-Ep04-22.mp4', './videos/089-2Ne1-I_am_the_best-Ep05-01.mp4', './videos/090-Monsta_X-Dramarama-Ep05-02.mp4', './videos/091-Jimin-Like_crazy-Ep05-03.mp4', './videos/092-Twice-What_is_love-Ep05-04.mp4', './videos/093-Stray_Kids-Gods_menu-Ep05-05.mp4', './videos/094-TWS-Plot_twist-Ep05-06.mp4', './videos/095-Gidle-Queencard-Ep05-07.mp4', './videos/096-BTS-Spring_day-Ep05-08.mp4', './videos/097-Seventeen-Hot-Ep05-09.mp4', './videos/098-NewJeans-Eta-Ep05-10.mp4', './videos/099-Stray_Kids-Lose_my_breath-Ep05-11.mp4', './videos/100-Treasure-Bona_bona-Ep05-12.mp4', './videos/101-Stella_Jang-Colors-Ep05-13.mp4', './videos/102-BTS-Danger-Ep05-14.mp4', './videos/103-NCT_Dream-ISTJ-Ep05-15.mp4', './videos/104-Red_Velvet-Psycho-Ep05-16.mp4', './videos/105-TXT-0X1=Lovesong-Ep05-17.mp4', './videos/106-Ateez-Deja_vu-Ep05-18.mp4', './videos/107-BabyMonster-Sheesh-Ep05-19.mp4', './videos/108-BTS-Permission_to_dance-Ep05-20.mp4', './videos/109-Stray_Kids-Stray_Kids-Ep05-21.mp4', './videos/110-BlackPink-Shut_down-Ep05-22.mp4', './videos/111-Riize-Get_a_guitar-Ep06-01.mp4', './videos/112-BTS-Fake_love-Ep06-02.mp4', './videos/113-BlackPink-Boombayah-Ep06-03.mp4', './videos/114-Stray_Kids-Jjam-Ep06-04.mp4', './videos/115-NewJeans-Super_shy-Ep06-05.mp4', './videos/116-Enhypen-Bite_me-Ep06-06.mp4', './videos/117-Got7-Hard_carry-Ep06-07.mp4', './videos/118-Bibi-Bibi_vengeance-Ep06-08.mp4', './videos/119-TXT-Sugar_rush_ride-Ep06-09.mp4', './videos/120-BTS-Dynamite-Ep06-10.mp4', './videos/121-Momoland-Bboom_bboom-Ep06-11.mp4', './videos/122-P1Harmony-Killin_it-Ep06-12.mp4', './videos/123-Itzy-Untouchable-Ep06-13.mp4', './videos/124-Stray_Kids-Mountains-Ep06-14.mp4', './videos/125-Ateez-Halazia-Ep06-15.mp4', './videos/126-Kiss_of_life-Bad_news-Ep06-16.mp4', './videos/127-BTS-Life_goes_on-Ep06-17.mp4', './videos/128-Seventeen-Left_&_Right-Ep06-18.mp4', './videos/129-Twice-I_cant_stop_me-Ep06-19.mp4', './videos/130-Winner-Really_really-Ep06-20.mp4', './videos/131-Ive-Heya-Ep06-21.mp4', './videos/132-Stray_Kids-Chk_chk_boom-Ep06-22.mp4', './videos/133-NewJeans-OMG-Ep06-01.mp4', './videos/134-Got7-Just_right-Ep07-02.mp4', './videos/135-Stray_Kids-My_pace-Ep07-03.mp4', './videos/136-Aespa-Armageddon-Ep07-04.mp4', './videos/137-BTS-No_more_dream-Ep07-05.mp4', './videos/138-TXT-Run_away-Ep07-06.mp4', './videos/139-Ive-Love_dive-Ep07-07.mp4', './videos/140-Seventeen-Very_nice-Ep07-08.mp4', './videos/141-Mamamoo-Hip-Ep07-09.mp4', './videos/142-Ateez-Work-Ep07-10.mp4', './videos/143-BTS-Anpanman-Ep07-11.mp4', './videos/144-BlackPink-As_if_its_your_last-Ep07-12.mp4', './videos/145-Stray_Kids-Domino-Ep07-13.mp4', './videos/146-BabyMonster-Forever-Ep07-14.mp4', './videos/147-Enhypen-XO-Ep07-15.mp4', './videos/148-BAP-One_shot-Ep07-16.mp4', './videos/149-Itzy-Wannabe-Ep07-17.mp4', './videos/150-Treasure-Darari-Ep07-18.mp4', './videos/151-Stray_Kids-S_Class-Ep07-19.mp4', './videos/152-f_x-Electric_shock-Ep07-20.mp4', './videos/153-BTS-Boy_with_luv-Ep07-21.mp4', './videos/154-Everglow-La_di_da-Ep07-22.mp4', './videos/155-Psy-Gangnam_style-Ep08-01.mp4', './videos/156-Stray_Kids-Christmas_EveL-Ep08-02.mp4', './videos/157-Twice-Fancy-Ep08-03.mp4', './videos/158-BTS-Blood_sweat_&_tears-Ep08-04.mp4', './videos/159-Treasure-Hello-Ep08-05.mp4', './videos/160-BlackPink-Pretty_Savage-Ep08-06.mp4', './videos/161-TXT-Crown-Ep08-07.mp4', './videos/162-SHINee-Ring_ding_dong-Ep08-08.mp4', './videos/163-Le_Sserafim-Crazy-Ep08-09.mp4', './videos/164-BTS-Run_BTS-Ep08-10.mp4', './videos/165-Red_Velvet-Zimzalabim-Ep08-11.mp4', './videos/166-Stray_Kids-Double_knot-Ep08-12.mp4', './videos/167-Ateez-Guerrilla-Ep08-13.mp4', './videos/168-Aespa-Next_level-Ep08-14.mp4', './videos/169-NCT_U-Boss-Ep08-15.mp4', './videos/170-Super_junior-Mamacita-Ep08-16.mp4', './videos/171-Izone-Panorama-Ep08-17.mp4', './videos/172-BTS-My_universe-Ep08-18.mp4', './videos/173-Seventeen-God_of_music-Ep08-19.mp4', './videos/174-NewJeans-Hype_boy-Ep08-20.mp4', './videos/175-Stray_Kids-Case_143-Ep08-21.mp4', './videos/176-Enhypen-Polaroid_love-Ep08-22.mp4', './videos/177-TXT-Deja_vu-Ep09-01.mp4', './videos/178-Gidle-Oh_my_god-Ep09-02.mp4', './videos/179-Stray_Kids-Charmer-Ep09-03.mp4', './videos/180-Pentagon-Shine-Ep09-04.mp4', './videos/181-BlackPink-Lovesick_girls-Ep09-05.mp4', './videos/182-BTS-Boy_in_luv-Ep09-06.mp4', './videos/183-Nmixx-O_O-Ep09-07.mp4', './videos/184-BAP-Young_wild_&_free-Ep09-08.mp4', './videos/185-Stray_Kids-Venom-Ep09-09.mp4', './videos/186-NewJeans-Ditto-Ep09-10.mp4', './videos/187-Enhypen-Given_Taken-Ep09-11.mp4', './videos/188-BTS-Black_swan-Ep09-12.mp4', './videos/189-Momoland-I_m_so_hot-Ep09-13.mp4', './videos/190-Seventeen-Dont_Wanna_Cry-Ep09-14.mp4', './videos/191-Red_Velvet-Red_flavor-Ep09-15.mp4', './videos/192-Stray_Kids-I_like_it-Ep09-16.mp4', './videos/193-Got7-You_calling_my_name-Ep09-17.mp4', './videos/194-Ive-After_like-Ep09-18.mp4', './videos/195-BTS-Dionysus-Ep09-19.mp4', './videos/196-Le_Sserafim-Easy-Ep09-20.mp4', './videos/197-Ateez-Say_my_name-Ep09-21.mp4', './videos/198-Super_junior-Sorry_sorry-Ep09-22.mp4', './videos/199-Fifty_fifty-Cupid-Ep10-01.mp4', './videos/200-Stray_Kids-Get_lit-Ep10-02.mp4', './videos/201-Mamamoo-Gogobebe-Ep10-03.mp4', './videos/202-BTS-Jump-Ep10-04.mp4', './videos/203-Kep1er-Wa_da_da-Ep10-05.mp4', './videos/204-BoyNextDoor-Earth_Wind_&_Fire-Ep10-06.mp4', './videos/205-TXT-Blue_hour-Ep10-07.mp4', './videos/206-Girls_Generation-The_boys-Ep10-08.mp4', './videos/207-Ateez-The_black_cat_Nero-Ep10-09.mp4', './videos/208-Stray_Kids-Cheese-Ep10-10.mp4', './videos/209-Ive-Eleven-Ep10-11.mp4', './videos/210-BTS-We_are_bulletproof-Ep10-12.mp4', './videos/211-Got7-Lullaby-Ep10-13.mp4', './videos/212-Everglow-Bon_bon_chocolat-Ep10-14.mp4', './videos/213-Jimin-Who-Ep10-15.mp4', './videos/214-Itzy-Dalla_dalla-Ep10-16.mp4', './videos/215-Seventeen-Cheers-Ep10-17.mp4', './videos/216-Stray_Kids-Circus-Ep10-18.mp4', './videos/217-BlackPink-Playing_with_fire-Ep10-19.mp4', './videos/218-BTS-DNA-Ep10-20.mp4', './videos/219-Aespa-Girls-Ep10-21.mp4', './videos/220-Treasure-I_love_you-Ep10-22.mp4', './videos/221-BTS-Make_it_right-Ep11-01.mp4', './videos/222-Kiss_of_life-Midas_touch-Ep11-02.mp4', './videos/223-J_Hope-Chicken_noodle_soup-Ep11-03.mp4', './videos/224-Riize-Boom_boom_bass-Ep11-04.mp4', './videos/225-BlackPink-Forever_young-Ep11-05.mp4', './videos/226-TXT-Cant_you_see_me-Ep11-06.mp4', './videos/227-BTS-Dope-Ep11-07.mp4', './videos/228-Ive-Baddie-Ep11-08.mp4', './videos/229-Stray_Kids-Levanter-Ep11-09.mp4', './videos/230-Ateez-Answer-Ep11-10.mp4', './videos/231-Wonder_Girls-Be_my_baby-Ep11-11.mp4', './videos/232-Treasure-King_kong-Ep11-12.mp4', './videos/233-NCT_127-Kick_it-Ep11-13.mp4', './videos/234-Le_Sserafim-Perfect_night-Ep11-14.mp4', './videos/235-Stray_Kids-Slash-Ep11-15.mp4', './videos/236-Wanna_one-Boomerang-Ep11-16.mp4', './videos/237-Aespa-Spicy-Ep11-17.mp4', './videos/238-Seventeen-Clap-Ep11-18.mp4', './videos/239-BTS-Go_go-Ep11-19.mp4', './videos/240-BabyMonster-Like_that-Ep11-20.mp4', './videos/241-Stray_Kids-Side_Effects-Ep11-21.mp4', './videos/242-Psy-Gentleman-Ep11-22.mp4', './videos/243-BigBang-Loser-Ep12-01.mp4', './videos/244-Twice-Likey-Ep12-02.mp4', './videos/245-Ateez-Horizon-Ep12-03.mp4', './videos/246-BTS-Airplane-Ep12-04.mp4', './videos/247-Sunmi-Gashina-Ep12-05.mp4', './videos/248-TXT-Puma-Ep12-06.mp4', './videos/249-Stray_Kids-Victory_song-Ep12-07.mp4', './videos/250-Everglow-Slay-Ep12-08.mp4', './videos/251-Eric_Nam-Congratulations-Ep12-09.mp4', './videos/252-Le_Sserafim-Unforgiven-Ep12-10.mp4', './videos/253-CIX-Movie_star-Ep12-11.mp4', './videos/254-Nuest-Face-Ep12-12.mp4', './videos/255-Badvillain-Badvillain-Ep12-13.mp4', './videos/256-BTS-For_youth-Ep12-14.mp4', './videos/257-Gidle-Hwaa-Ep12-15.mp4', './videos/258-Seventeen-Change_up-Ep12-16.mp4', './videos/259-NCT_Dream-Hot_sauce-Ep12-17.mp4', './videos/260-BlackPink-The_Girls-Ep12-18.mp4', './videos/261-The_boyz-Reveal-Ep12-19.mp4', './videos/262-Stray_Kids-Insomnia-Ep12-20.mp4', './videos/263-Rosé-On_the_Ground-Ep12-21.mp4', './videos/264-P1Harmony-Jump-Ep12-22.mp4', './videos/265-Seventeen-_World-Ep13-01.mp4', './videos/266-Super_junior-Black_suit-Ep13-02.mp4', './videos/267-StayC-Asap-Ep13-03.mp4', './videos/268-Pentagon-Dr_Bebe-Ep13-04.mp4', './videos/269-Twice-Talk_that_talk-Ep13-05.mp4', './videos/270-Day6-Shoot_me-Ep13-06.mp4', './videos/271-Ateez-Wave-Ep13-07.mp4', './videos/272-Jeon_somi-Fast_forward-Ep13-08.mp4', './videos/273-SF9-Good_guy-Ep13-09.mp4', './videos/274-Wonder_Girls-Why_so_lonely-Ep13-10.mp4', './videos/275-SHINee-View-Ep13-11.mp4', './videos/276-Stray_Kids-Freeze-Ep13-12.mp4', './videos/277-Ive-Accendio-Ep13-13.mp4', './videos/278-BTS-Yet_to_come-Ep13-14.mp4', './videos/279-N_Flying-Oh_Really-Ep13-15.mp4', './videos/280-BlackPink-Whistle-Ep13-16.mp4', './videos/281-TXT-Cat_&_dog-Ep13-17.mp4', './videos/282-Oneus-Come_back_home-Ep13-18.mp4', './videos/283-Izone-La_vie_en_rose-Ep13-19.mp4', './videos/284-Zerobaseone-In_bloom-Ep13-20.mp4', './videos/285-Yena_&_Yuqi-Hate_Rodrigo-Ep13-21.mp4', './videos/286-Stray_Kids-Astronaut-Ep13-22.mp4', './videos/287-Wendy-Wish_you_hell-Ep14-01.mp4', './videos/288-SuperM-Jopping-Ep14-02.mp4', './videos/289-Monsta_X-Hero-Ep14-03.mp4', './videos/290-Nmixx-Dash-Ep14-04.mp4', './videos/291-Taemin-Want-Ep14-05.mp4', './videos/292-Red_Velvet-Naughty-Ep14-06.mp4', './videos/293-NCT_127-Fire_truck-Ep14-07.mp4', './videos/294-Psy-Daddy-Ep14-08.mp4', './videos/295-Izone-Violeta-Ep14-09.mp4', './videos/296-TXT-Tinnitus-Ep14-10.mp4', './videos/297-Hwa_Sa-Na-Ep14-11.mp4', './videos/298-VIXX-Chained_up-Ep14-12.mp4', './videos/299-Stray_Kids-Gone_days-Ep14-13.mp4', './videos/300-Gfriend-Me_gustas_tu-Ep14-14.mp4', './videos/301-Xdinary_Heroes-Love_and_fear-Ep14-15.mp4', './videos/302-BlackPink-Stay-Ep14-16.mp4', './videos/303-Exo-The_eve-Ep14-17.mp4', './videos/304-Seventeen-Darl+ing-Ep14-18.mp4', './videos/305-Lisa-New_women-Ep14-19.mp4', './videos/306-BTS-Just_one_day-Ep14-20.mp4', './videos/307-Ateez-Not_okay-Ep14-21.mp4', './videos/308-Dreamcatcher-Justice-Ep14-22.mp4', './videos/309-MCND-Spring-Ep15-01.mp4', './videos/310-Le_Sserafim-Eve_psyche_&_the_bluebeard_wife-Ep15-02.mp4', './videos/311-Xikers-Tricky_house-Ep15-03.mp4', './videos/312-Everglow-Adios-Ep15-04.mp4', './videos/313-Zerobaseone-Good_so_bad-Ep15-05.mp4', './videos/314-Day6-Sweet_chaos-Ep15-06.mp4', './videos/315-Chung_Ha-Snapping-Ep15-07.mp4', './videos/316-Pentagon-Naughty_boy-Ep15-08.mp4', './videos/317-NCT_Dream-Smoothie-Ep15-09.mp4', './videos/318-Loona-Paint_the_town-Ep15-10.mp4', './videos/319-Wanna_one-Energetic-Ep15-11.mp4', './videos/320-StayC-Bubble-Ep15-12.mp4', './videos/321-Kang_Daniel-Movie-Ep15-13.mp4', './videos/322-Stray_Kids-Voices-Ep15-14.mp4', './videos/323-Huh_Yunjin-I_≠_DOLL-Ep15-15.mp4', './videos/324-Astro-Blue_flame-Ep15-16.mp4', './videos/325-N_Flying-Rooftop-Ep15-17.mp4', './videos/326-Mamamoo-Aya-Ep15-18.mp4', './videos/327-The_rose-Back_to_me-Ep15-19.mp4', './videos/328-Aespa-Savage-Ep15-20.mp4', './videos/329-P1Harmony-Sad_song-Ep15-21.mp4', './videos/330-Agust_D-Daechwita-Ep15-22.mp4', './videos/331-Gidle-Wife-Ep16-01.mp4', './videos/332-Nuest-I_m_in_trouble-Ep16-02.mp4', './videos/333-Block_B-Shall_we_dance-Ep16-03.mp4', './videos/334-Sunmi-Noir-Ep16-04.mp4', './videos/335-N_Flying-The_real-Ep16-05.mp4', './videos/336-NCT_127-Walk-Ep16-06.mp4', './videos/337-Itzy-Cake-Ep16-07.mp4', './videos/338-ONF-Why-Ep16-08.mp4', './videos/339-SF9-Mamma_mia-Ep16-09.mp4', './videos/340-Twice-Set_me_free-Ep16-10.mp4', './videos/341-Enhypen-Brought_the_heat_back-Ep16-11.mp4', './videos/342-StayC-Beautiful_monster-Ep16-12.mp4', './videos/343-The_Boyz-No_air-Ep16-13.mp4', './videos/344-Pentagon-Spring_snow-Ep16-14.mp4', './videos/345-Everglow-First-Ep16-15.mp4', './videos/346-NCT_Dream-Boom-Ep16-16.mp4', './videos/347-Riize-Impossible-Ep16-17.mp4', './videos/348-Jeon_somi-Dumb_dumb-Ep16-18.mp4', './videos/349-Stray_Kids-Get_cool-Ep16-19.mp4', './videos/350-Just_B-Medusa-Ep16-20.mp4', './videos/351-Kep1er-Up!-Ep16-21.mp4', './videos/352-iKon-Killing_me-Ep16-22.mp4', './videos/353-Nmixx-Love_me_like_this-Ep17-01.mp4', './videos/354-NCT_127-2_Baddies-Ep17-02.mp4', './videos/355-Oneus-Baila_conmigo-Ep17-03.mp4', './videos/356-Minute-Crazy-Ep17-04.mp4', './videos/357-Xdinary_Heroes-Freakin_bad-Ep17-05.mp4', './videos/358-Viviz-Maniac-Ep17-06.mp4', './videos/359-Psy-New_face-Ep17-07.mp4', './videos/360-Super_junior-Mr_Simple-Ep17-08.mp4', './videos/361-NewJeans-How_sweet-Ep17-09.mp4', './videos/362-Ampers&one-On_and_on-Ep17-10.mp4', './videos/363-Jihyo-Killin_me_good-Ep17-11.mp4', './videos/364-Stray_Kids-All_in-Ep17-12.mp4', './videos/365-Block_B-Her-Ep17-13.mp4', './videos/366-Gidle-Klaxon-Ep17-14.mp4', './videos/367-NCT_Dream-We_go_up-Ep17-15.mp4', './videos/368-Girls_Generation-Gee-Ep17-16.mp4', './videos/369-P1Harmony-Back_down-Ep17-17.mp4', './videos/370-Exo-Call_me_baby-Ep17-18.mp4', './videos/371-XG-Puppet_show-Ep17-19.mp4', './videos/372-SuperM-Tiger_inside-Ep17-20.mp4', './videos/373-Red_Velvet-Cosmic-Ep17-21.mp4', './videos/374-Yeonjun-Ggum-Ep17-22.mp4', './videos/375-Samuel-One-Ep18-01.mp4', './videos/376-2_PM-Heartbeat-Ep18-02.mp4', './videos/377-Twice-Cheer_up-Ep18-03.mp4', './videos/378-The_KingDom-Flip_that_coin-Ep18-04.mp4', './videos/379-Dreamcatcher-Chase_me-Ep18-05.mp4', './videos/380-Stray_Kids-Why-Ep18-06.mp4', './videos/381-NCT_U-Make_a_wish-Ep18-07.mp4', './videos/382-Gidle-Tomboy-Ep18-08.mp4', './videos/383-BoyNextDoor-Nice_guy-Ep18-09.mp4', './videos/384-Zerobaseone-Crush-Ep18-10.mp4', './videos/385-Red_Velvet-Bad_boy-Ep18-11.mp4', './videos/386-Xdinary_Heroes-Little_things-Ep18-12.mp4', './videos/387-Rosé-APT-Ep18-13.mp4', './videos/388-Exo-Ko_ko_bop-Ep18-14.mp4', './videos/389-Oneus-Erase_me-Ep18-15.mp4', './videos/390-Izone-Secret_story_of_the_swan-Ep18-16.mp4', './videos/391-Seventeen-Oh_my!-Ep18-17.mp4', './videos/392-Tempest-Lighthouse-Ep18-18.mp4', './videos/393-Yena-Wicked_love-Ep18-19.mp4', './videos/394-Lucy-Boogie_man-Ep18-20.mp4', './videos/395-2Ne1-Come_back_home-Ep18-21.mp4', './videos/396-The_boyz-Trigger-Ep18-22.mp4', './videos/397-The_rose-Alive-Ep19-01.mp4', './videos/398-GOT_the_beat-Step_back-Ep19-02.mp4', './videos/399-TXT-Everlasting_shine-Ep19-03.mp4', './videos/400-Dreamcatcher-Piri-Ep19-04.mp4', './videos/401-Dongkiz-Lupin-Ep19-05.mp4', './videos/402-Day6-Time_of_our_life-Ep19-06.mp4', './videos/403-Yena-NemoNemo-Ep19-07.mp4', './videos/404-8Turn-Excel-Ep19-08.mp4', './videos/405-Ftisland-I_wish-Ep19-09.mp4', './videos/406-Loossemble-TTYL-Ep19-10.mp4', './videos/407-Pentagon-Daisy-Ep19-11.mp4', './videos/408-Oneus-Valkyrie-Ep19-12.mp4', './videos/409-Twice-Dance_the_night_away-Ep19-13.mp4', './videos/410-Xikers-Bittersweet-Ep19-14.mp4', './videos/411-AleXa-Revolution-Ep19-15.mp4', './videos/412-BigBang-This_love-Ep19-16.mp4', './videos/413-Xdinary_Heroes-Boy_comics-Ep19-17.mp4', './videos/414-Exid-I_love_you-Ep19-18.mp4', './videos/415-Enhypen-No_doubt-Ep19-19.mp4', './videos/416-Gidle-Lion-Ep19-20.mp4', './videos/417-Lucy-Villain-Ep19-21.mp4', './videos/418-Stray_Kids-Top-Ep19-22.mp4', './videos/419-Xdinary_Heroes-Happy_death_day-Ep20-01.mp4', './videos/420-Sunmi-Siren-Ep20-02.mp4', './videos/421-Bus-Liar-Ep20-03.mp4', './videos/422-Uniq-Eoeo-Ep20-04.mp4', './videos/423-Dreamcatcher-OODT-Ep20-05.mp4', './videos/424-AB6IX-Breathe-Ep20-06.mp4', './videos/425-Weekly-After_school-Ep20-07.mp4', './videos/426-8Turn-Ru_pum_pum-Ep20-08.mp4', './videos/427-Cnblue-Love_girl-Ep20-09.mp4', './videos/428-Nmixx-Dice-Ep20-10.mp4', './videos/429-X1-Flash-Ep20-11.mp4', './videos/430-Brave_Girls-Rollin-Ep20-12.mp4', './videos/431-Cravity-Ready_or_not-Ep20-13.mp4', './videos/432-Jackson_Wang-Bullet_to_the_heart-Ep20-14.mp4', './videos/433-Loona-Why_not-Ep20-15.mp4', './videos/434-NCT_Dream-When_I_m_with_you-Ep20-16.mp4', './videos/435-Stray_Kids-Giant-Ep20-17.mp4', './videos/436-Tzuyu-Run_away-Ep20-18.mp4', './videos/437-Woodz-Drowning-Ep20-19.mp4', './videos/438-Twice-More_&_more-Ep20-20.mp4', './videos/439-Enhypen-Hey_Tayo-Ep20-21.mp4', './videos/440-Seventeen-Hit-Ep20-22.mp4'];
    let firstVideo = ''; 
    let secondVideo = '';
    var titres_restants = {
        '0': [],
        '5': [],
        '10': [],
        '15' : [],
        '20' : [],
        '25' : [],
        '30' : [],
        '35' : [],
        '40' : [],
        '45' : [],
        '50' : [],
        '55' : [],
        '60' : [],
        '65' : [],
        '70' : [],
        '75' : [],
        '80' : [],
        '85' : [],
        '90' : [],
        '95' : [],
        '100' : []
    };
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
                    const videoPath = videoSources.find(path => path.includes(id));
                    const rawNote = values[noteIndex].trim();
                    const note = rawNote * 10;
                    if (!titres_restants.hasOwnProperty(note)) {
                        titres_restants[note] = [];
                    }
                    if (videoPath) {
                        titres_restants[note].push(videoPath);
                    }
                }
    
                return titres_restants;
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
        
        
        function getStandNote(include = null) {
                 if (include != null) {
                     return include;
                 } else {
                     //console.log("titres_restants =", titres_restants);
                     let catego = null;
                     const cles = Object.keys(titres_restants);
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
     
         function getRandomVideo(titres_restants, include = null, exclude = null) {
             include = getStandNote(include);  // Assurer que include a une valeur valide
             // Ajouter une validation avant d'accéder à titres_restants[include]
             console.log("titres_restants :", titres_restants);
             console.log("include :", include);
             const liste = titres_restants[include];
             console.log("liste :", liste);
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
            if (titres_restants === []) {
            (async () => {
                const titres_restants = await chargerCSV(csvPath);
                //console.log("titres_restants :", titres_restants);
                //console.log("titres_restants.length :", Object.keys(titres_restants).length);
            })();
            }
            
            // Supprimer les anciennes vidéos avant de commencer une nouvelle
            cleanupVideos();
    
            // Créer et ajouter le conteneur pour la première vidéo
            console.log("titres_restants =", titres_restants);
            [include, firstVideo] = getRandomVideo(titres_restants);
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
                [includeBonus, secondVideo] = getRandomVideo(titres_restants, include, firstVideo);
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
            startChallenge(titres_restants);
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
    
        window.onload = startChallenge(titres_restants);
        } else {
        alert("Connecte-toi d'abord !");
        window.location.href = "Login.html";
    }
});
