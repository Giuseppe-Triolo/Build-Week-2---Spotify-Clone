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
const optionsArtist = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e83ad78b00mshd7c5db97ddabac3p18e6d2jsn9b1544b5b1b8",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
    }
  };
  
  async function setBackground(data) {
    try {
      const artistHeader = document.querySelector(".artistHeader");
  
      if (data.picture_xl) {
        artistHeader.style.backgroundImage = url('${data.picture_xl}');
        artistHeader.style.backgroundSize = "cover";
        artistHeader.style.backgroundPosition = "center";
      } else {
        console.error("Errore nel recupero dei dati dell'album.");
      }
    } catch (error) {
      console.error("Errore nella richiesta API:", error);
    }
  } 
//artist fetch
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "e83ad78b00mshd7c5db97ddabac3p18e6d2jsn9b1544b5b1b8",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
  }
};

async function getArtist() {
  const url = new URL(window.location.href);
  console.log(url);
  const params = url.searchParams.get("id");
  const apiUrl = "https://deezerdevs-deezer.p.rapidapi.com/artist/" + params;
  const response = await fetch(apiUrl, options);
  console.log(response);
  const data = await response.json();
  console.log(data);
  return data;
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