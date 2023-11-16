let audio;
// ---------- COLORE PAGINA ----------
// array album 
const albumsId = [
    {
        idAlbum: '1121182',
        red: 179,
        green: 179,
        blue: 179
    },
]




// ---------- LOAD NAVBAR ----------

// playlist array 
const playlistNames = [
    "Playlist 1",
    "Playlist 2",
    
];

// populate playlist column
function populatePlaylistColumn(){

    const playlistColumn = document.getElementById('playlistColumn');

    playlistNames.forEach(playlistName => {

        const element = document.createElement('a');

        element.setAttribute('href', 'javascript:void(0)');

        element.innerHTML = playlistName;

        playlistColumn.appendChild(element);

    })

}

// ---------- POPOLA TRACCE ----------
async function popolaTracce(id){

    const tracklist = (await album(id)).tracks.data;

    const imgArtist = (id === '1121182') ? '' : (await artist(tracklist[0].artist['id'])).picture_big;

    let durataAlbum = 0;

    // calcolo durata album
    for(i = 0; i < tracklist.length; i++){
        durataAlbum += tracklist[i].duration;
    }

    let flag = 0;

    // corrispondenza colore con array locale
    for(i = 0; i < albumsId.length; i++){
        if(albumsId[i].idAlbum === id){
            const albumContainer = document.getElementById('albumContainer');
            albumContainer.style.background = `linear-gradient(rgb(${albumsId[i].red}, ${albumsId[i].green}, ${albumsId[i].blue}), black 60%)`;
            flag++;
        }
    }

    if(flag === 0){
        const albumContainer = document.getElementById('albumContainer');
        albumContainer.style.background = `linear-gradient(yellow, black 60%)`;
    }

    const albumBox = document.getElementById('albumBox');

    const div = document.createElement('div');

    div.classList.add('d-flex', 'flex-md-row', 'flex-column', 'align-items-md-end', 'align-items-center');

    div.innerHTML = `<div class="me-4">
    <img src="${(id === '364507') ? './assets/img/easter_egg_1.jpeg' : tracklist[0].album.cover_big}" width="250px" alt="">
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
            <p class="m-0"><a href="./artistpage.html?id=${tracklist[0].artist.id}">${tracklist[0].artist.name}</a><i class="bi bi-dot"></i>2017<i class="bi bi-dot"></i>${tracklist.length} brani,<span class="text-secondary"> ${timeConverter(durataAlbum)}</span></p>
        </div>
    </div>
</div>`;

    albumBox.appendChild(div)

    let c = 0;

    tracklist.forEach(track => {

        c++;
        
        const brani = document.getElementById('brani');

        const row = document.createElement('div');

        row.classList.add('row', 'mb-3','brano', 'py-2');

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
    </div>`

        brani.appendChild(row);
    });

}

// minuti e secondi
function timeConverter(sec){

    const minuti = Math.floor(sec/60);

    const secondi = sec % 60;

    if(sec > 500){
        return minuti + ' minuti ' + secondi + ' dadegi.';
    }else{
        return minuti + ':' + secondi;
    }
    
}


// ---------- FETCHES ----------

// search fetch
function searchDeezer(query) {
    const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        "X-RapidAPI-Key": "e83ad78b00mshd7c5db97ddabac3p18e6d2jsn9b1544b5b1b8"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("errore nella richiesta di DATA:", error);
      });
  }

  function performSearch() {
    const searchInput = document.getElementById("searchInput");
    const query = searchInput.value.trim();

    if (query !== "") {
      searchDeezer(query);
    } else {
      alert("Please enter a search query.");
    }
  }

// album fetch
async function accessCollection(event) {
    event.preventDefault();
    const card = event.currentTarget;
    const cardIdUrl = card.querySelector(".d-none");
    const collectionUrl = cardIdUrl.innerText;
    console.log("collectionUrl:", collectionUrl);
    try {
      const response = await fetch(collectionUrl, options);
  
      if (!response.ok) {
        throw new Error("🔴 Network error");
      }
  
      const output = await response.json();
  
      const innerHomeSection = document.getElementById("inner-home-section");
      innerHomeSection.innerHTML = "";
  
      const section = document.createElement("section");
      section.className = "mb-1 mb-sm-2 mb-md-3 mb-lg-4 mt-3";
      innerHomeSection.appendChild(section);
  
      const elementContainer = document.createElement("div");
      elementContainer.className = "d-flex gap-3";
      section.appendChild(elementContainer);
  
      const imgContainer = document.createElement("div");
      imgContainer.className =
        "rounded-2 flex-shrink-0 lg-cover-container d-flex align-items-center me-3";
      elementContainer.appendChild(imgContainer);
  
      if (output.picture) {
        const albumCover = document.createElement("img");
        albumCover.src = output.picture;
  
        if (output.type === "artist") {
          albumCover.className = "img-fluid w-100 rounded-circle";
        } else {
          albumCover.className = "img-fluid w-100 rounded-1";
        }
  
        imgContainer.appendChild(albumCover);
      } else {
        imgContainer.style.display = "none";
      }
    } catch (error) {
      console.error("🔴 Fetching error:", error);
    }
  }

// populate player
async function populatePlayer(id, trackId){

    const tracklist = (await album(id)).tracks.data;
    
    for(i = 0; i < tracklist.length; i++){
        if(tracklist[i].id === trackId){

            const currentPlay = document.getElementById('currentPlay');

            currentPlay.innerHTML = '';

            const div = document.createElement('div');

            div.classList.add('d-flex', 'justify-content-start', 'p-2', 'gap-2');

            div.innerHTML = `<div class="mx-1 bg-secondary">
            <img src="${tracklist[i].album.cover_big}" style="max-width: 75px; max-height: 75px" alt="Album Cover"/>
        </div>
        <div class="pt-2">
            <h6 class="text-truncate">${tracklist[i].title}</h6>
            <p>${tracklist[0].artist.name}</p>
        </div>
        <button class="btn text-light" style="background-color: transparent">
            <i class="bi bi-heart"></i>
        </button>`

            currentPlay.appendChild(div);

            localStorage.setItem('data', JSON.stringify([id, trackId]));

            audio = new Audio(tracklist[i].preview);
            
        }
    }

}

// start mp3
async function startMusic(){

    audio.play();

    const musicBtn = document.getElementById('musicBtn');

    musicBtn.innerHTML = `<button class="btn text-light" onclick="pauseMusic()"
            style="background-color: transparent">  
                <i style="font-size: 38px" class="bi bi-pause-circle"></i>
            </button>`;
}

// pause music
async function pauseMusic(){
   
    audio.pause();

    const musicBtn = document.getElementById('musicBtn');

    musicBtn.innerHTML = `<button class="btn text-light" onclick="startMusic()"
            style="background-color: transparent">  
                <i style="font-size: 38px" class="bi bi-play-circle"></i>
            </button>`;
}    