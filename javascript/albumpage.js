const albumId = "1121182";
const apiKey = "your-api-key-here"; // Replace with your actual API key

const albumOptions = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
    }
};

async function fetchAlbumDetails() {
    try {
        const response = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`, albumOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const albumData = await response.json();
        displayAlbumDetails(albumData);
        fetchTracks(albumData.tracks.data);
    } catch (error) {
        console.error("Error fetching album details:", error);
    }
}

function displayAlbumDetails(album) {
    const albumDetailsDiv = document.getElementById("album-details");
    albumDetailsDiv.innerHTML = `
        <h2>${album.title}</h2>
        <img src="${album.cover_medium}" alt="Album Cover">
        <p>Artist: ${album.artist.name}</p>
        <p>Release Date: ${album.release_date}</p>
    `;
}

function displayTracks(tracks) {
    const tracksDiv = document.getElementById("tracks");
    tracksDiv.innerHTML = "<h3>Tracks</h3>";
    tracks.forEach(track => {
        tracksDiv.innerHTML += `<p>${track.title}</p>`;
    });
}

function fetchTracks(tracks) {
    // Since we already have the tracks data, we can directly display it
    displayTracks(tracks);
}

fetchAlbumDetails();
