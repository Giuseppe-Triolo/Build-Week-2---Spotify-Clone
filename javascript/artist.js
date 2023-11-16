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

async function getTopTracks(limit) {
  const url = new URL(window.location.href);
  const params = url.searchParams.get("id");
  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${params}/top?limit=${limit}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function renderTopTracks(topTracks) {
  if (topTracks.data) {
    const tracksContainer = document.getElementById("tracksContainer");
    topTracks.data.forEach((track) => {
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
}

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

function showMore(canzoni) {
  albumsPerPage = 1000;
  currentPage++;
  mostraAlbum(canzoni);
  document.getElementById("showMoreButton").style.display = "none";
}

function addToSet(name, album) {
  const nameAlreadyExists = Array.from(displayedAlbums).some((item) => item.album.title === name);
  if (!nameAlreadyExists) {
    displayedAlbums.add(album);
  }
}

function mostraAlbum(canzoni) {
  const start = currentPage === 1 ? 0 : 5;
  const end = start + albumsPerPage;
  const discographyContainer = document.getElementById("discography");
  const checkTest = new Set();
  canzoni.forEach((x) => {
    addToSet(x.album.title, x);
  });
  console.log(displayedAlbums);
  Array.from(displayedAlbums)
    .slice(start, end)
    .forEach((result) => {
      const album = result.album;
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
    });
  if (end >= totalAlbums) {
    showMoreButton.style.display = "none";
  }
}

async function renderPage() {
  const artist = await getArtist();
  setBackground(artist);
  getArtistDiscography(artist);
  const canzoni = await getArtistDiscography(artist);
  const topTracks = await getTopTracks(10);
  renderTopTracks(topTracks);
  mostraAlbum(canzoni);
  const showMoreButton = document.getElementById("showMoreButton");
  showMoreButton.onclick = () => {
    showMore(canzoni);
  };
}
renderPage();
