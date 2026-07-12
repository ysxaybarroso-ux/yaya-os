
document.addEventListener("DOMContentLoaded", function () {
    setInterval(function () {
        document.querySelector("#time").innerHTML = new Date().toLocaleString();
    }, 100);

    // Rendre l'élément draggable :
    dragElement(document.getElementById("welcome"));
    dragElement(document.getElementById("wiki"));

    var wikiScreen = document.querySelector("#wiki")
    var wikiScreenClose = document.querySelector("#wikiclose")

    var welcomeScreen = document.querySelector("#welcome")// define screen
    var welcomeScreenClose = document.querySelector("#welcomeclose")
    var welcomeScreenOpen = document.querySelector("#welcomeopen")
    var selectedIcon = undefined

    function dragElement(elmnt) {
        var initialX = 0;
        var initialY = 0;
        var currentX = 0;
        var currentY = 0;

        if (document.getElementById(elmnt.id + "header")) {
            // s'il existe un header, on drag depuis le header
            document.getElementById(elmnt.id + "header").onmousedown = startDragging;
        } else {
            // sinon, on drag depuis n'importe où dans la div
            elmnt.onmousedown = startDragging;
        }

        function startDragging(e) {
            e = e || window.event;
            e.preventDefault();
            initialX = e.clientX;
            initialY = e.clientY;
            document.onmouseup = stopDragging;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            currentX = initialX - e.clientX;
            currentY = initialY - e.clientY;
            initialX = e.clientX;
            initialY = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - currentY) + "px";
            elmnt.style.left = (elmnt.offsetLeft - currentX) + "px";
        }

        function stopDragging() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    //elt close
    function closeWindow(element) {
        element.style.display = "none";
        if (element == welcomeScreen) {
            welcomeScreenOpen.style.backgroundColor = "rgb(253, 0, 0)";
            welcomeScreenOpen.innerHTML = "CLOSED";
        }
    }
    //elt open
    function openWindow(element) {
        element.style.display = "block";
        BringToFront(element);
        if (element == welcomeScreen) {
            welcomeScreenOpen.style.backgroundColor = "rgb(120, 255, 18)";
            welcomeScreenOpen.innerHTML = "OPEN";
        }
    }

    welcomeScreenClose.addEventListener("click", function () {
        closeWindow(welcomeScreen);
    });

    welcomeScreenOpen.addEventListener("click", function () {
        openWindow(welcomeScreen);
    });


    function SelectIcon(element) {
        element.classList.add("icon_selected");

        selectedIcon = element;
    }
    function DeselectIcon(element) {
        element.classList.remove("icon_selected");

        selectedIcon = undefined;
    }

    function handleIconTap(element, screen) {
        if (element.classList.contains("icon_selected")) {
            DeselectIcon(element)
            openWindow(screen)
        } else {
            SelectIcon(element)
        }
    }

    wikiScreenClose.addEventListener("click", () => closeWindow(wikiScreen));

    function InitializeIcon(name) {
        var icon = document.querySelector("#" + name + "Icon")
        var screen = document.querySelector("#" + name)

        icon.addEventListener("click", () => handleIconTap(icon, screen))
    }

    function InitializeWindow(elementName) {
        var screen = document.querySelector("#" + elementName)
        var close = document.querySelector("#" + elementName + "close")

        AddWindowTapHandling(screen)
        if (elementName != "welcome") {
            closeWindow(screen)
        }
        dragElement(screen)
        if (elementName != "welcome" && elementName != "radiosettings") {
            InitializeIcon(elementName)
        }

        close.addEventListener("click", () => closeWindow(screen))
    }
    InitializeWindow("welcome")
    InitializeWindow("wiki")
    InitializeWindow("radio")
    InitializeWindow("radiosettings")

    var biggestIndex = 1;
    var topBar = document.querySelector(".header_out_win");

    function BringToFront(element) {
        biggestIndex++;
        element.style.zIndex = biggestIndex;
        topBar.style.zIndex = biggestIndex + 1;
    }
    function AddWindowTapHandling(element) {
        element.addEventListener("mousedown", function () {
            BringToFront(element);
        });
    }







    var content = [
        {
            idea: "la cyberpsychose",
            date: "09/07/2074",
            content: '<p class="notecontent">chap 1 david martinez he is a young teenager trying to reach arasaka tower top ...  IMPLANT: Symptomes</p>'
        },
        {
            idea: "pls give me stardust to make hardware project mouhahaha",
            date: "09/072026",
            content: '<p class="notecontent"> i love hackclub i want to work in hackclub i will love to study in their school if they have one :) </p>'
        }
    ];

    function setNoteContent(index) {
        var note = content[index];
        var noteContentDiv = document.querySelector("#notezone");
        noteContentDiv.innerHTML = `
        <p class="notetittle" ><strong>${note.idea}</strong></p>
        <p class="notedate">${note.date}</p>
        ${note.content}
    `;
    }

    function addToSideBar(index) {
        var sidebar = document.querySelector("#sidebar");
        var note = content[index];

        var newDiv = document.createElement("div");
        newDiv.style.cursor = "pointer";
        newDiv.style.padding = "6px";
        newDiv.innerHTML = `
        <p class="notetittle">${note.idea}</p>
        <p class="notedate">${note.date}</p>
        <button class="delete_button"><img src="../../images/trashcan.png" width="20" height="20"></button>
        `;
        var deleteBtn = newDiv.querySelector(".delete_button");
        deleteBtn.addEventListener("click", (e) => { 
            e.stopPropagation();
            content.splice(index,1);
            SaveNotes();
            RefreshSidebar();
        })

        newDiv.addEventListener("click", function () {
            setNoteContent(index);
        });

        sidebar.appendChild(newDiv);
    }
    LoadNotes();
    for (let i = 0; i < content.length; i++) {
        addToSideBar(i);
    }

    setNoteContent(0);
    //sauvgarde les notes pour le client
    function SaveNotes(){
    var texte = JSON.stringify(content);

    localStorage.setItem("notes" , texte);
    }

    function LoadNotes(){
    var texte = localStorage.getItem("notes");

    if (texte !== null){
        content = JSON.parse(texte);
    }
    }
    function AddNotes(){
        var titleInput = document.querySelector("#newNoteTitle");
        var contentInput = document.querySelector("#newNoteContent");

        var newNote = {

            idea: titleInput.value,
            date: new Date().toLocaleString(),
            content: `<p class="notecontent">${contentInput.value}</p>`,
        }

        content.push(newNote);

        var newIndex = content.length - 1;

        addToSideBar(newIndex);
        SaveNotes();

        titleInput.value = "";
        contentInput.value = "";
    }
    // if i delete a note the whole side bar as to be refresh
    function RefreshSidebar(){
        var sideBar = document.querySelector("#sidebar")
        sideBar.innerHTML = "";

        for (let i = 0; i < content.length; i++) {
        addToSideBar(i);
    }
    }

    //met un listener sur le btn submit
    document.querySelector("#addNoteBtn").addEventListener("click", () => {
        AddNotes();
        });





    //create the playlist array
    var playlists = [
        {
            name: "JAZZY AND SOUL NOMADE",
            tracks: [
                { titre: "ACOUSTIC BLUES | AUDIONAUTIX", src: '../../musics/playlist_jazz/Acoustic-Blues-Audionautix.mp3' },
                { titre: "BEER BELLY BLUE | JOHN DELEY", src: '../../musics/playlist_jazz/Beer-Belly-Blues_John-Deley.mp3' },
                { titre: "IF I CAN'T DANCE IT'S NOT MY REVOLUTION | QUANTIUMM JAZZ", src: "../../musics/playlist_jazz/If-I-Cant-Dance-Its-Not-My-Revolution.mp3" },
                { titre: "JUMPIN WOOGIE BOOGIE | AUDIONAUTIX", src: "../../musics/playlist_jazz/Jumpin-Boogie-Woogie-Audionautix.mp3" },
                { titre: "ON THE GROUND | KEVIN MACLEOD", src: "../../musics/playlist_jazz/Kevin-MacLeod-On-the-Ground.mp3" },
                { titre: "PLAY SONG | JOHN DELEY", src: "../../musics/playlist_jazz/Play-Song-John-Deley.mp3" },
            ]
        },
        {
            name: "SAMOURAI QG",
            tracks: [
                { titre: "BROKEN | UNKNOW", src: '../../musics/playlist_metal_rock/Metal-Cyberpunk-Broken.mp3.' },
                { titre: "UNKNOW | HARDWARE", src: '../../musics/playlist_metal_rock/Metal-Hardware.mp3' },
                { titre: "DOOM-STYLE | TORN FLESH", src: '../../musics/playlist_metal_rock/Doom-Style-Torn-Flesh.mp3' },
                { titre: "INDEPENDECE | INFRACTION", src: '../../musics/playlist_metal_rock/by-Infraction-independece.mp3' },
            ]
        },
        {
            name: "BEACH CHOOM",
            tracks: [
                { titre: 'BAILA MI CUMBIA | JIMMY FONTANEZ', src: "../../musics/playlist_beachvibes/Baila-Mi-Cumbia_Jimmy-Fontanez.mp3" },
                { titre: 'CHA CAPPELLA | JIMMY FONTANEZ', src: "../../musics/playlist_beachvibes/Cha-Cappella-jimmy-Fontanez.mp3" },
                { titre: 'SILENT PARTNER | HEARTACHE', src: "../../musics/playlist_beachvibes/Heartache-Silent-Partner.mp3" },
                { titre: 'LATIN SPORT FASHION | INFRACTION', src: "../../musics/playlist_beachvibes/Latin-Sport-Fashion-by-Infraction.mp3" },
                { titre: 'PLAY SONG | JOHN DELEY', src: "../../musics/playlist_beachvibes/Play-Song-John-Deley.mp3" },
                { titre: 'SALGRE | JIMMY FONTANEZ', src: "../../musics/playlist_beachvibes/Salgre-Jimmy-Fontanez.mp3" },
            ]
        },
        {
            name: "NATIONAL RADIO",
            tracks: [
                { titre: "BROKEN | UNKNOW", src: "../../musics/playlist_cyberpunk/90s-Metal-Cyberpunk-Broken.mp3" },
                { titre: "UNKNOW | HARDWARE", src: "../../musics/playlist_cyberpunk/Cyberpunk-90s-Industrial-Metal-Hardware.mp3" },
                { titre: "CYBER REALITY | MEHUL CHOUDHARY", src: "../../musics/playlist_cyberpunk/Mehul-Choudhary-Cyberreality.mp3" },
                { titre: "I AIN'T RUNNING | LIMUJII", src: "../../musics/playlist_cyberpunk/Limujii-I-aint-running.mp3" },
                { titre: "VIRUS | ALEX PRODUCTIONS", src: "../../musics/playlist_cyberpunk/Alex-Productions-Virus.mp3" },
                { titre: "REVENGE | ALEX PRODUCTIONS", src: "../../musics/playlist_cyberpunk/Revenge-Alex-Productions.mp3" },
            ]
        },
        {
            name: "ROOFTOP RADIO",
            tracks: [
                { titre: "MINI MIELK | ALEXI ACTION AND INFRACTION", src: "../../musics/playlist_pop/Infraction-Alexi-Action-mini-mielk.mp3" },
                { titre: "BURNING| KV", src: "../../musics/playlist_pop/KV-Burning.mp3" },
                { titre: " SILENT PARTNER| HEARTACHE", src: "../../musics/playlist_pop/Heartache-Silent-Partner.mp3" },
                { titre: "LATIN SPORT FASHION| INFRACTION", src: "../../musics/playlist_pop/Latin-Sport-Fashion-Football-by-Infraction.mp3" },

            ]
        },
        {
            name: "UNDERGROUND STATION",
            tracks: [
                { titre: "NOTHING CAN TOUCH ME| HOWK", src: "../../musics/playlist_rap/NOTHING-CAN-TOUCH-ME.mp3" },
                { titre: "BEAT TIRAMISU| HOWK X NEMZZZ", src: "../../musics/playlist_rap/Beat-tiramisu.mp3" },
                { titre: "BEAT-HAPPINESS | FLOWER IN NARNIA", src: "../../musics/playlist_rap/BEAT-HAPPINESS.mp3" },
                { titre: "CUTTHROAT | SYNDROME", src: "../../musics/playlist_rap/Cutthroat.mp3" },
                { titre: "KICKED OUT | TKD BEATS", src: "../../musics/playlist_rap/KICKED-OUT.mp3" },
            ]
        },
        {
            name: "PSYCHO IN 2020",
            tracks: [
                { titre: "AYUDA FUNK | NCS", src: "../../musics/playlist_phonk/AYUDA-Funk-NCS.mp3" },
                { titre: "ANGEPLAYA LET THEM HAVE IT | NCS", src: "../../musics/playlist_phonk/ANGELPLAYA-LET-THEM-HAVE-IT-Phonk-NCS.mp3" },
                { titre: "ANGELPLAYA PULL UP | NCS", src: "../../musics/playlist_phonk/ANGELPLAYA-PULL-UP-Phonk-NCS.mp3" },
                { titre: "GXL MONTAGEM INDIA | NCS", src: "../../musics/playlist_phonk/GxL-MONTAGEM-INDIA-Funk-NCS.mp3" },
                { titre: "BRAZILIAN WORKOUT | INFRACTION", src: "../../musics/playlist_phonk/Phonk-Brazilian-Workout-Infraction.mp3" },
                { titre: "BLADE FURY | NCS", src: "../../musics/playlist_phonk/Blade-Fury-NCS.mp3" },
                { titre: "VOLT VISION AND BENEATH MY SHADE DANGEROUS | NCS", src: "../../musics/playlist_phonk/VOLT-VISION-and-Beneath-My-Shade-Dangerous-NCS.mp3" },
            ]
        },
        {
            name: "MOON RADIO",
            tracks: [
                { titre: " HEADING WEST FOLK GUITAR | UNKNOW", src: "../../musics/playlist_chill/Heading-West-Folk-Guitar.mp3" },
                { titre: " IN DREAMLAND | UNKNOW", src: "../../musics/playlist_chill/In-Dreamland.mp3" },
                { titre: " BAGUETTE | CHILLPEACH", src: "../../musics/playlist_chill/Chillpeach-Baguette.mp3" },
                { titre: " CAKE | CHILLPEACH", src: "../../musics/playlist_chill/Chillpeach-Cake.mp3" },
                { titre: " FROG | CHILLPEACH", src: "../../musics/playlist_chill/Chillpeach-Frog.mp3" },
            ]
        },
        {
            name: "PIRATED SOURCE",
            tracks: [
                { titre: " HEADING WEST FOLK GUITAR | UNKNOW", src: "../../musics/playlist_chill/Heading-West-Folk-Guitar.mp3" },
                { titre: " IN DREAMLAND | UNKNOW", src: "../../musics/playlist_chill/In-Dreamland.mp3" },
                { titre: " BAGUETTE | CHILLPEACH", src: "../../musics/playlist_chill/Chillpeach-Baguette.mp3" },
                { titre: " CAKE | CHILLPEACH", src: "../../musics/playlist_chill/Chillpeach-Cake.mp3" },
                { titre: " FROG | CHILLPEACH", src: "../../musics/playlist_chill/Chillpeach-Frog.mp3" },
                { titre: "AYUDA FUNK | NCS", src: "../../musics/playlist_phonk/AYUDA-Funk-NCS.mp3" },
                { titre: "ANGEPLAYA LET THEM HAVE IT | NCS", src: "../../musics/playlist_phonk/ANGELPLAYA-LET-THEM-HAVE-IT-Phonk-NCS.mp3" },
                { titre: "ANGELPLAYA PULL UP | NCS", src: "../../musics/playlist_phonk/ANGELPLAYA-PULL-UP-Phonk-NCS.mp3" },
                { titre: "GXL MONTAGEM INDIA | NCS", src: "../../musics/playlist_phonk/GxL-MONTAGEM-INDIA-Funk-NCS.mp3" },
                { titre: "BRAZILIAN WORKOUT | INFRACTION", src: "../../musics/playlist_phonk/Phonk-Brazilian-Workout-Infraction.mp3" },
                { titre: "BLADE FURY | NCS", src: "../../musics/playlist_phonk/Blade-Fury-NCS.mp3" },
                { titre: "VOLT VISION AND BENEATH MY SHADE DANGEROUS | NCS", src: "../../musics/playlist_phonk/VOLT-VISION-and-Beneath-My-Shade-Dangerous-NCS.mp3" },
                { titre: "NOTHING CAN TOUCH ME| HOWK", src: "../../musics/playlist_rap/NOTHING-CAN-TOUCH-ME.mp3" },
                { titre: "BEAT TIRAMISU| HOWK X NEMZZZ", src: "../../musics/playlist_rap/Beat-tiramisu.mp3" },
                { titre: "BEAT-HAPPINESS | FLOWER IN NARNIA", src: "../../musics/playlist_rap/BEAT-HAPPINESS.mp3" },
                { titre: "CUTTHROAT | SYNDROME", src: "../../musics/playlist_rap/Cutthroat.mp3" },
                { titre: "KICKED OUT | TKD BEATS", src: "../../musics/playlist_rap/KICKED-OUT.mp3" },
                { titre: "MINI MIELK | ALEXI ACTION AND INFRACTION", src: "../../musics/playlist_pop/Infraction-Alexi-Action-mini-mielk.mp3" },
                { titre: "BURNING| KV", src: "../../musics/playlist_pop/KV-Burning.mp3" },
                { titre: " SILENT PARTNER| HEARTACHE", src: "../../musics/playlist_pop/Heartache-Silent-Partner.mp3" },
                { titre: "LATIN SPORT FASHION| INFRACTION", src: "../../musics/playlist_pop/Latin-Sport-Fashion-Football-by-Infraction.mp3" },
                { titre: "BROKEN | UNKNOW", src: "../../musics/playlist_cyberpunk/90s-Metal-Cyberpunk-Broken.mp3" },
                { titre: "UNKNOW | HARDWARE", src: "../../musics/playlist_cyberpunk/Cyberpunk-90s-Industrial-Metal-Hardware.mp3" },
                { titre: "CYBER REALITY | MEHUL CHOUDHARY", src: "../../musics/playlist_cyberpunk/Mehul-Choudhary-Cyberreality.mp3" },
                { titre: "I AIN'T RUNNING | LIMUJII", src: "../../musics/playlist_cyberpunk/Limujii-I-aint-running.mp3" },
                { titre: "VIRUS | ALEX PRODUCTIONS", src: "../../musics/playlist_cyberpunk/Alex-Productions-Virus.mp3" },
                { titre: "REVENGE | ALEX PRODUCTIONS", src: "../../musics/playlist_cyberpunk/Revenge-Alex-Productions.mp3" },
                { titre: 'BAILA MI CUMBIA | JIMMY FONTANEZ', src: "../../musics/playlist_beachvibes/Baila-Mi-Cumbia_Jimmy-Fontanez.mp3" },
                { titre: 'CHA CAPPELLA | JIMMY FONTANEZ', src: "../../musics/playlist_beachvibes/Cha-Cappella-jimmy-Fontanez.mp3" },
                { titre: 'SILENT PARTNER | HEARTACHE', src: "../../musics/playlist_beachvibes/Heartache-Silent-Partner.mp3" },
                { titre: 'LATIN SPORT FASHION | INFRACTION', src: "../../musics/playlist_beachvibes/Latin-Sport-Fashion-by-Infraction.mp3" },
                { titre: 'PLAY SONG | JOHN DELEY', src: "../../musics/playlist_beachvibes/Play-Song-John-Deley.mp3" },
                { titre: 'SALGRE | JIMMY FONTANEZ', src: "../../musics/playlist_beachvibes/Salgre-Jimmy-Fontanez.mp3" },
                { titre: "BROKEN | UNKNOW", src: '../../musics/playlist_metal_rock/Metal-Cyberpunk-Broken.mp3' },
                { titre: "UNKNOW | HARDWARE", src: '../../musics/playlist_metal_rock/Metal-Hardware.mp3' },
                { titre: "DOOM-STYLE | TORN FLESH", src: '../../musics/playlist_metal_rock/Doom-Style-Torn-Flesh.mp3' },
                { titre: "INDEPENDECE | INFRACTION", src: '../../musics/playlist_metal_rock/by-Infraction-independece.mp3' },
                { titre: "ACOUSTIC BLUES | AUDIONAUTIX", src: '../../musics/playlist_jazz/Acoustic-Blues-Audionautix.mp3' },
                { titre: "BEER BELLY BLUE | JOHN DELEY", src: '../../musics/playlist_jazz/Beer-Belly-Blues_John-Deley.mp3' },
                { titre: "IF I CAN'T DANCE IT'S NOT MY REVOLUTION | QUANTIUMM JAZZ", src: "../../musics/playlist_jazz/If-I-Cant-Dance-Its-Not-My-Revolution.mp3" },
                { titre: "JUMPIN WOOGIE BOOGIE | AUDIONAUTIX", src: "../../musics/playlist_jazz/Jumpin-Boogie-Woogie-Audionautix.mp3" },
                { titre: "ON THE GROUND | KEVIN MACLEOD", src: "../../musics/playlist_jazz/Kevin-MacLeod-On-the-Ground.mp3" },
                { titre: "PLAY SONG | JOHN DELEY", src: "../../musics/playlist_jazz/Play-Song-John-Deley.mp3" },
            ]

        },

    ]
    var currentAudio = new Audio();
    var timeSlider = document.querySelector("#time_button");
    var volumeSlider = document.querySelector("#volume_slider")
    var timerDiv = document.querySelector("#timer");
    var currentPlaylistIndex = null;
    var currentTrackIndex = null;
    // add the playlist to window
    for (let i = 0; i < playlists.length; i++) {
        AddPlaylistToSlideBar(i);
    }


    // function tu inizialize all the playlist
    function AddPlaylistToSlideBar(index) {
        var playlistDiv = document.querySelector("#colonne_playlist_radio") //to know where to put it
        var pl = playlists[index]

        var newDiv = document.createElement("div");
        newDiv.classList.add("playlist");
        newDiv.innerHTML = `<p>${pl.name}</p>`;

        newDiv.addEventListener("click", () => {
            ShowTrackOfPlaylist(index);
            currentPlaylistIndex = index;
        });
        playlistDiv.appendChild(newDiv);
    }
    //show the track of the playlist and inisialize the click
    function ShowTrackOfPlaylist(index) {
        var showPlaylist = document.querySelector("#playlist_view");
        var tracks = playlists[index].tracks;

        showPlaylist.innerHTML = "";
        for (let i = 0; i < tracks.length; i++) {
            var newDiv = document.createElement("div");
            newDiv.classList.add("song_in_playlist");
            var tempAudio = new Audio(tracks[i].src);
            tempAudio.addEventListener("loadedmetadata", () => { formatMinute(tempAudio.duration); });
            newDiv.innerHTML = `<p>${tracks[i].titre}</p>`;
            newDiv.addEventListener("click", () => {
                LunchMucic(tracks[i], index, i);

            });
            showPlaylist.appendChild(newDiv);
        }


    }

    function formatMinute(duration) {
        var audioTimeSecond = Math.floor(duration % 60);
        var audioTimeMinute = Math.floor(duration / 60);

        if (audioTimeSecond < 10) audioTimeSecond = "0" + audioTimeSecond;
        var audioTime = `${audioTimeMinute}:${audioTimeSecond}`;
        return audioTime
    }

    function LunchMucic(track, playlistIndex, trackIndex) {
        currentPlaylistIndex = playlistIndex;
        currentTrackIndex = trackIndex;

        currentAudio.src = track.src;
        var songName = document.querySelector("#song_name");

        songName.innerHTML = track.titre;
        currentAudio.play();

    }
    function PlaySong() {
        var playBtn = document.querySelector("#play_button")
        var stopBtn = document.querySelector("#pause_button")
        currentAudio.play();

        playBtn.style.display = "none";
        stopBtn.style.display = "flex";
    }
    function StopSong() {
        var playBtn = document.querySelector("#play_button")
        var stopBtn = document.querySelector("#pause_button")
        currentAudio.pause();

        playBtn.style.display = "flex";
        stopBtn.style.display = "none";
    }
    function PlayNextTrack() {
        var tracks = playlists[currentPlaylistIndex].tracks;
        var nextIndex = (currentTrackIndex + 1);
        currentTrackIndex++;

        if (nextIndex >= tracks.length) nextIndex = 0;

        LunchMucic(tracks[nextIndex], currentPlaylistIndex, nextIndex);
    }
    function ToogleButtonRepeat() {
        var indicator = document.querySelector("#indicator_repeat");

        if (currentAudio.loop) {
            currentAudio.loop = false;
            indicator.classList.add("repeat_off");
            indicator.classList.remove("repeat_on");
        }
        else {
            currentAudio.loop = true;
            indicator.classList.add("repeat_on");
            indicator.classList.remove("repeat_off");
        }
    }
    document.querySelector("#play_button").addEventListener("click", () => {
        PlaySong();
    });
    document.querySelector("#pause_button").addEventListener("click", () => {
        StopSong();
    });

    currentAudio.addEventListener("loadedmetadata", () => {
        document.querySelector("#time_button").max = currentAudio.duration;
    });

    timeSlider.addEventListener("input", () => {
        currentAudio.currentTime = timeSlider.value;
    });
    currentAudio.addEventListener("timeupdate", () => {
        timeSlider.value = currentAudio.currentTime;
        timerDiv.innerHTML = formatMinute(currentAudio.currentTime);

    })
    currentAudio.addEventListener("loadedmetadata", () => { timerDiv.innerHTML = formatMinute(currentAudio.duration); });

    currentAudio.addEventListener("ended", () => {
        PlayNextTrack();
    })

    document.querySelector("#repeat_button").addEventListener("click", () => { ToogleButtonRepeat(); })

    function ToogleSettingRadio() {
        var settingButton = document.querySelector("#radiosettings");

        if (settingButton.style.display == "flex") {
            settingButton.style.display = "none";
        }
        else {
            settingButton.style.display = "flex";
        }

    }

    document.querySelector("#sound_menu").addEventListener("click", () => {
        ToogleSettingRadio();
    })
    document.querySelector("#volume_slider").addEventListener("input", () => {
        currentAudio.volume = volumeSlider.value;

        var indicator = document.querySelector("#volume_percentage");
        var volPercent = Math.round(volumeSlider.value * 100);

        indicator.innerHTML = volPercent + "%";
    });
});