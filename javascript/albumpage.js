let audio;

// Array con informazioni sugli album
const albumsId = [
    {
        idAlbum: '1121182',
        red: 179,
        green: 179,
        blue: 179
    }
    
];

// Array con nomi delle playlist
const playlistNames = [
    "Playlist 1",
    "Playlist 2",
   
];

// Funzione per popolare la colonna delle playlist
function populatePlaylistColumn() {
    const playlistColumn = document.getElementById('playlistColumn');
    playlistNames.forEach(playlistName => {
        const element = document.createElement('a');
        element.setAttribute('href', 'javascript:void(0)');
        element.textContent = playlistName;
        playlistColumn.appendChild(element);
    });
}

// Funzione per popolare le tracce
async function popolaTracce(id) {
    const response = await album(id);
    if (!response) return;

    const tracklist = response.tracks.data;
    const imgArtist = (id === '1121182') ? '' : (await artist(tracklist[0].artist.id)).picture_big;

    let durataAlbum = tracklist.reduce((acc, track) => acc + track.duration, 0);

    const albumContainer = document.getElementById('albumContainer');
    const color = albumsId.find(album => album.idAlbum === id) || { red: 255, green: 255, blue: 0 };
    albumContainer.style.background = `linear-gradient(rgb(${color.red}, ${color.green}, ${color.blue}), black 60%)`;

    const albumBox = document.getElementById('albumBox');
    albumBox.innerHTML = ''; // Pulisci il contenuto esistente
    // ... (resto del codice per creare e appendere div)
}

// Convertitore di tempo
function timeConverter(sec) {
    const minuti = Math.floor(sec / 60);
    const secondi = sec % 60;
    return sec > 500 ? `${minuti} minuti ${secondi} secondi` : `${minuti}:${secondi}`;
}

// Fetch per la ricerca
const optionsDiscography = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e83ad78b00mshd7c5db97ddabac3p18e6d2jsn9b1544b5b1b8",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
    }
  };
  
  let albumsPerPage = 5;
  let currentPage = 1;
  let totalAlbums;
  const displayedAlbums = new Set();
  
  async function getArtistDiscography(artist) {
    try {
      const urlDiscography = "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist.name;
      const response = await fetch(urlDiscography, optionsDiscography);
      const data = await response.json();
      const canzoni = data.data.filter((canzone) => canzone.artist.id === artist.id);
      console.log(canzoni);
      return canzoni;
    } catch (asdasd) {
      console.error(asdasd);
    }
  } 

// Fetch per l'album
const album1= "1121182"
async function fetchAlbumInfo(album1) {
    const url = `https://deezerdevs-deezer.p.rapidapi.com/album/${album1}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'YOUR_ACTUAL_API_KEY',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
    console.log(result);
    return result;
}

fetchAlbumInfo(album1);
// Fetch per l'artista
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
// Inizializzazione quando la pagina viene caricata
window.onload = function() {
    populatePlaylistColumn();
    popolaTracce('1121182'); 
};


