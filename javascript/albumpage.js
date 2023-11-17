let audio;
// ---------- COLORE PAGINA ----------
// array album buonasera
const albumsId = [
  {
    idAlbum: "1121182",
    red: 179,
    green: 179,
    blue: 179
  }
];

// ---------- LOAD NAVBAR ----------

// playlist array
const playlistNames = [
  "Be The Young Seasons 1-5",
  "Be The Young Seasons 6-8",
  "persona di m*rda (gen-feb 2023)",
  "Musical 2022",
  "pippo, pluto e paperino (nov-dec 2022)",
  "early stage emily syndrome (sett-ott 2022)",
  "Be the young",
  "'...' cit. Kimiko (lug-ago 2022)",
  "saggio vibes 💃🩰",
  "main character energy (mag-giu 2022)",
  "that fucking mood 🔪☠️",
  "VEE, CARLOTTA E GIACOMO VANNO A BOSIO",
  "An Emily Winchester kind of mood 🔪🖕",
  "landing page (mar-apr 2022)",
  "2021 lol",
  "cosa cazzo vuol dire questa affermazione (gen-feb 2022)",
  "honey and glass (nov-dic 2021)",
  "(Revenge) Training Arc 🦍",
  "Lidia 🤝 Emily",
  "minecraft e nintendo switch (sep-oct 2021)",
  "silvano d'orba? I hardly know her (lug - ago 2021)",
  "Culo 2021",
  "Frah Quintale Mix",
  "Francesco Guccini Mix",
  "Lo Stato Sociale Mix",
  "chapter 4/? (mag-giu 2021)",
  "Strive School <> The Hunt Motivation",
  "mi stavo dimenticando (mar-apr 2021)",
  "high school musical 1,2,3",
  "quanto trash cazzo",
  "The 2020 Playlist",
  "ma(ncanza) che cazzo ne so io (gen-feb 2021)",
  "VEE, CARLOTTA E GIACOMO VANNO A BOSIO",
  "An Emily Winchester kind of mood 🔪🖕",
  "landing page (mar-apr 2022)",
  "2021 lol",
  "cosa cazzo vuol dire questa affermazione (gen-feb 2022)",
  "honey and glass (nov-dic 2021)",
  "(Revenge) Training Arc 🦍",
  "Lidia 🤝 Emily",
  "minecraft e nintendo switch (sep-oct 2021)",
  "silvano d'orba? I hardly know her (lug - ago 2021)",
  "Culo 2021",
  "Frah Quintale Mix",
  "Francesco Guccini Mix",
  "Lo Stato Sociale Mix",
  "chapter 4/? (mag-giu 2021)",
  "Strive School <> The Hunt Motivation",
  "mi stavo dimenticando (mar-apr 2021)",
  "high school musical 1,2,3",
  "quanto trash cazzo",
  "The 2020 Playlist",
  "ma(ncanza) che cazzo ne so io (gen-feb 2021)"
];

// populate playlist column
function populatePlaylistColumn() {
  const playlistColumn = document.getElementById("playlistColumn");

  playlistNames.forEach((playlistName) => {
    const element = document.createElement("a");

    element.setAttribute("href", "javascript:void(0)");

    element.innerHTML = playlistName;

    playlistColumn.appendChild(element);
  });
}

// ---------- POPOLA TRACCE ----------
async function popolaTracce(id) {
  const tracklist = (await album(id)).tracks.data;

  const imgArtist = id === "99999" ? "IMMAGINE" : (await artist(tracklist[0].artist["id"])).picture_big;

  let durataAlbum = 0;

  // calcolo durata album
  for (i = 0; i < tracklist.length; i++) {
    durataAlbum += tracklist[i].duration;
  }

  let flag = 0;

  // corrispondenza colore con array locale
  for (i = 0; i < albumsId.length; i++) {
    if (albumsId[i].idAlbum === id) {
      const albumContainer = document.getElementById("albumContainer");
      albumContainer.style.background = `linear-gradient(rgb(${albumsId[i].red}, ${albumsId[i].green}, ${albumsId[i].blue}), black 60%)`;
      flag++;
    }
  }

  if (flag === 0) {
    const albumContainer = document.getElementById("albumContainer");
    albumContainer.style.background = `linear-gradient(yellow, black 60%)`;
  }

  const albumBox = document.getElementById("albumBox");

  const div = document.createElement("div");

  div.classList.add("d-flex", "flex-md-row", "flex-column", "align-items-md-end", "align-items-center");

  div.innerHTML = `<div class="me-4">
    <img src="${
      id === "364507" ? "./assets/img/easter_egg_1.jpeg" : tracklist[0].album.cover_big
    }" width="250px" alt="">
</div>
<div id="infoBox">
    <p class="m-0 d-none d-md-block" style="font-size: 0.9em">ALBUM</p>
    <h1 class="d-none d-md-block">${tracklist[0].album.title}</h1>
    <h2 class="d-md-none">${tracklist[0].album.title}</h2>
    <div class="d-flex">
        <div id="icona" class="me-2"> 
            <img class="rounded-circle" src="${imgArtist}" width="25px" alt="">
        </div>
        <div>
            <p class="m-0"><a href="./artistpage.html?id=${tracklist[0].artist.id}">${
    tracklist[0].artist.name
  }</a><i class="bi bi-dot"></i>2017<i class="bi bi-dot"></i>${
    tracklist.length
  } brani,<span class="text-secondary"> ${timeConverter(durataAlbum)}</span></p>
        </div>
    </div>
</div>`;

  albumBox.appendChild(div);

  let c = 0;

  tracklist.forEach((track) => {
    c++;

    const brani = document.getElementById("brani");

    const row = document.createElement("div");

    row.classList.add("row", "mb-3", "brano", "py-2");

    row.innerHTML = `<div class="col-6 d-flex align-items-center">
        <div class="me-md-4">
            <p class="d-md-block d-none">${c}</p>
        </div>
        <div>
            <h6 onclick="populatePlayer(${id}, ${track.id})" style="cursor: pointer">${track.title}</h6>
            <a href="./artistpage.html?id=${track.artist.id}"><p>${track.artist.name}</p></a>
        </div>
    </div>
    <div class="col-3 d-flex align-items-center justify-content-end">
        <p class="d-md-block d-none">${track.rank.toLocaleString()}</p>
    </div>
    <div class="col-3 d-flex align-items-center justify-content-end pe-4">
        <p class="d-md-block d-none">${timeConverter(track.duration)}</p>
    </div>`;

    brani.appendChild(row);
  });
}

// minuti e secondi
function timeConverter(sec) {
  const minuti = Math.floor(sec / 60);

  const secondi = sec % 60;

  if (sec > 500) {
    return minuti + " minuti " + secondi + " dadegi.";
  } else {
    return minuti + ":" + secondi;
  }
}

// ---------- FETCHES ----------

// search fetch

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "e83ad78b00mshd7c5db97ddabac3p18e6d2jsn9b1544b5b1b8",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
  }
};

async function getAlbumDetails() {
  try {
    const url = new URL(window.location.href);
    console.log(url);
    const params = url.searchParams.get("id");
    const apiUrl = "https://deezerdevs-deezer.p.rapidapi.com/album/" + params;
    const response = await fetch(apiUrl, options);
    console.log(response);
    const data = await response.json();
    console.log(data);

    try {
      const artistHeader = document.querySelector(".artistHeader");
      if (data.cover_xl) {
        artistHeader.style.backgroundImage = `url('${data.cover_xl}')`;
        artistHeader.style.backgroundSize = "cover";
        artistHeader.style.backgroundPosition = "center";
      } else {
        console.error("Errore nel recupero dei dati dell'album.");
      }
    } catch (error) {
      console.error("Errore nella richiesta API:", error);
    }

    if (data.tracks.data) {
      const tracksContainer = document.getElementById("tracksContainer");

      data.tracks.data.forEach((track) => {
        const card = document.createElement("div");
        card.className = "card bg-transparent text-white border-0 mx-0";
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        const row = document.createElement("div");
        row.className = "row";
        const imgColumn = document.createElement("div");
        imgColumn.className = "col-md-4";

        if (track.album.cover_small) {
          const img = document.createElement("img");
          img.src = track.album.cover_small;
          img.alt = track.title;
          img.className = "img-fluid";
          imgColumn.appendChild(img);
        }

        const textColumn = document.createElement("div");
        textColumn.className = "col-md-8";
        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = track.title;
        textColumn.appendChild(title);
        row.appendChild(imgColumn);
        row.appendChild(textColumn);
        cardBody.appendChild(row);
        card.appendChild(cardBody);
        tracksContainer.appendChild(card);
      });
    } else {
      console.error("Nessuna traccia trovata nell'album.");
    }
  } catch (error) {
    console.error("Errore nella richiesta API:", error);
  }
}

getAlbumDetails();

// populate player
async function populatePlayer(id, trackId) {
  const tracklist = (await album(id)).tracks.data;

  for (i = 0; i < tracklist.length; i++) {
    if (tracklist[i].id === trackId) {
      const currentPlay = document.getElementById("currentPlay");

      currentPlay.innerHTML = "";

      const div = document.createElement("div");

      div.classList.add("d-flex", "justify-content-start", "p-2", "gap-2");

      div.innerHTML = `<div class="mx-1 bg-secondary">
            <img src="${tracklist[i].album.cover_big}" style="max-width: 75px; max-height: 75px" alt="Album Cover"/>
        </div>
        <div class="pt-2">
            <h6 class="text-truncate">${tracklist[i].title}</h6>
            <p>${tracklist[0].artist.name}</p>
        </div>
        <button class="btn text-light" style="background-color: transparent">
            <i class="bi bi-heart"></i>
        </button>`;

      currentPlay.appendChild(div);

      localStorage.setItem("data", JSON.stringify([id, trackId]));

      audio = new Audio(tracklist[i].preview);
    }
  }
}

// start mp3
async function startMusic() {
  audio.play();

  const musicBtn = document.getElementById("musicBtn");

  musicBtn.innerHTML = `<button class="btn text-light" onclick="pauseMusic()"
            style="background-color: transparent">  
                <i style="font-size: 38px" class="bi bi-pause-circle"></i>
            </button>`;
}

// pause music
async function pauseMusic() {
  audio.pause();

  const musicBtn = document.getElementById("musicBtn");

  musicBtn.innerHTML = `<button class="btn text-light" onclick="startMusic()"
            style="background-color: transparent">  
                <i style="font-size: 38px" class="bi bi-play-circle"></i>
            </button>`;
}

window.onload = () => {
  loadFriends();

  populatePlaylistColumn();

  const param = new URLSearchParams(location.search);
  const id = param.get("id");

  popolaTracce(id);

  const data = JSON.parse(localStorage.getItem("data"));

  if (localStorage.getItem("data")) {
    populatePlayer(...data);
  }
};
