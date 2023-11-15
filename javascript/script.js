const url = "https://deezerdevs-deezer.p.rapidapi.com/album/1121182";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "e83ad78b00mshd7c5db97ddabac3p18e6d2jsn9b1544b5b1b8",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
  }
};

const urlArtist = "https://deezerdevs-deezer.p.rapidapi.com/artist/queen";
const optionsArtist = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "e83ad78b00mshd7c5db97ddabac3p18e6d2jsn9b1544b5b1b8",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
  }
};

async function setBackground() {
  try {
    const response = await fetch(urlArtist, optionsArtist);
    const data = await response.json();
    const artistHeader = document.querySelector(".artistHeader");

    if (data.picture_xl) {
      artistHeader.style.backgroundImage = `url('${data.picture_xl}')`;
      artistHeader.style.backgroundSize = "cover";
      artistHeader.style.backgroundPosition = "center";
    } else {
      console.error("Errore nel recupero dei dati dell'album.");
    }
  } catch (error) {
    console.error("Errore nella richiesta API:", error);
  }
}

setBackground();

async function getAlbumDetails() {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
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

const urlDiscography = "https://deezerdevs-deezer.p.rapidapi.com/search?q=queen";
const optionsDiscography = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "e83ad78b00mshd7c5db97ddabac3p18e6d2jsn9b1544b5b1b8",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
  }
};

const albumsPerPage = 5;
let currentPage = 1;
let totalAlbums;
const displayedAlbums = new Set();

async function getArtistDiscography() {
  try {
    const response = await fetch(urlDiscography, optionsDiscography);
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Nessun array trovato.");
      return;
    }
    totalAlbums = data.data.length;
    const discographyContainer = document.getElementById("discography");
    const showMoreButton = document.getElementById("showMoreButton");
    showMoreButton.addEventListener("click", showMore);
    function showMore() {
      currentPage++;
      mostraAlbum();
    }

    function mostraAlbum() {
      const start = (currentPage - 1) * albumsPerPage;
      const end = start + albumsPerPage;
      data.data.slice(start, end).forEach((result) => {
        const album = result.album;

        if (!displayedAlbums.has(album.id)) {
          const col = document.createElement("div");
          col.className = "col-md-2 mb-4";
          const card = document.createElement("div");
          card.className = "card album-card bg-transparent text-white border-0";
          const cardBody = document.createElement("div");
          cardBody.className = "card-body";
          const img = document.createElement("img");
          img.src = album.cover_medium;
          img.alt = album.title;
          img.className = "img-fluid";
          const title = document.createElement("h6");
          title.className = "card-title mt-2";
          title.textContent = album.title;
          cardBody.appendChild(img);
          cardBody.appendChild(title);
          card.appendChild(cardBody);
          col.appendChild(card);
          discographyContainer.appendChild(col);
          displayedAlbums.add(album.id);
        }
      });

      if (end >= totalAlbums) {
        showMoreButton.style.display = "none";
      }
    }
    mostraAlbum();
  } catch (error) {
    console.error("Errore nella richiesta API della discografia:", error);
  }
}
getArtistDiscography();
