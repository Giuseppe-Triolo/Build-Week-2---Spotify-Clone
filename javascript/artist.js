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

const albumsPerPage = 5;
let currentPage = 1;
let totalAlbums;
const displayedAlbums = new Set();

async function getArtistDiscography(artist) {
  try {
    const urlDiscography = "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist.name;
    const response = await fetch(urlDiscography, optionsDiscography);
    const data = await response.json();
    const canzoni = data.data.filter((canzone) => canzone.artist.id === artist.id);
    const totalAlbums = canzoni.length;
    console.log(canzoni);
    return canzoni;
  } catch (asdasd) {
    console.error(asdasd);
  }
}

function showMore(canzoni) {
  currentPage++;
  mostraAlbum(canzoni);
}

function mostraAlbum(canzoni) {
  const start = (currentPage - 1) * albumsPerPage;
  const end = start + albumsPerPage;
  const discographyContainer = document.getElementById("discography");
  canzoni.slice(start, end).forEach((result) => {
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

async function renderPage() {
  const artist = await getArtist();
  setBackground(artist);
  getArtistDiscography(artist);
  const canzoni = await getArtistDiscography(artist);

  mostraAlbum(canzoni);
  const showMoreButton = document.getElementById("showMoreButton");
  showMoreButton.onclick = () => {
    showMore(canzoni);
  };
}
renderPage();
