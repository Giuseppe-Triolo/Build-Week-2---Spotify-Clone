let audio;
// ---------- COLORE PAGINA ----------
// array album buonasera
const albumsId = [
    {
        idAlbum: '1121182',
        red: 179,
        green: 179,
        blue: 179
    }
]

// ---------- LOAD NAVBAR ----------

// playlist array 
const playlistNames = [
    "",

    
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
    <img src="${(id === '364507') ? '' : tracklist[0].album.cover_big}" width="250px" alt="">
</div>
<div id="infoBox">
    <p class="m-0 d-none d-md-block" style="font-size: 0.9em">ALBUM</p>
    <h1 class="d-none d-md-block">${tracklist[0].album.title}</h1>
    <h2 class="d-md-none">${tracklist[0].album.title}</h2>
    <div class="d-flex">
        <div id="icona" class="me-2"> 
            <img class="rounded-circle" src="${imgArtist}" width="25px" alt="">
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


// ---------- FETCH----------

// search fetch
const search = async (param) => {

    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${param}`

    try{

        const response = await fetch(url);

        if(response.ok) {

            const elementsArray = (await response.json()).data;

            return elementsArray

        }

    }catch(err){console.log(err)}

}

// album fetch
const album = async (param) => {

    const url = `https://deezerdevs-deezer.p.rapidapi.com/album/${param}`

    try{

        const response = await fetch(url);

        if(response.ok) {

            const elementsArray = await response.json();

            return elementsArray

        }

    }catch(err){console.log(err)}

}

// artist fetch
const artist = async (param) => {

    const url = `https://deezerdevs-deezer.p.rapidapi.com/artist/${param}`

    try{

        const response = await fetch(url);

        if(response.ok) {

            const elementsArray = await response.json();

            return elementsArray

        }

    }catch(err){console.log(err)}

}

