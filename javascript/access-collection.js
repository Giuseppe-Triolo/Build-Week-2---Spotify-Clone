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

    const mainBody = document.getElementById("main-body");
    mainBody.innerHTML = "";

    const dynamicBg = document.getElementById("dynamic-bg");
    dynamicBg.innerHTML = "";

    // ! ---------- ARTIST ----------
    if (output.type === "artist") {
      const section = document.createElement("section");
      section.id = "artist-page";
      section.className = "collection-page mb-1 mb-sm-2 mb-md-3 mb-lg-4";
      mainBody.appendChild(section);

      const artist = document.createElement("div");
      artist.className = "d-flex gap-3";
      section.appendChild(artist);

      const artistHeader = document.createElement("div");
      artistHeader.className = "d-flex flex-column";
      artist.appendChild(artistHeader);

      if (output.picture_xl) {
        const dynamicBg = document.getElementById("dynamic-bg");
        dynamicBg.style.backgroundImage = `url(${output.picture_xl})`;
        dynamicBg.style.backgroundSize = "cover";
        dynamicBg.style.backgroundPosition = "center";
      }

      const artistInfo = document.createElement("div");
      artistInfo.className =
        "d-flex flex-column justify-content-end align-items-start";
      artist.appendChild(artistInfo);

      // Se l'artista ha più di 999 "fan", carica badge
      const verifiedContainer = document.createElement("div");
      verifiedContainer.className =
        "d-flex align-items-center justify-content-center gap-2";
      artistInfo.appendChild(verifiedContainer);

      console.log("fans:", output.nb_fan);
      if (output.nb_fan > 999) {
        const artistVerifiedBadge = document.createElement("div");
        artistVerifiedBadge.className =
          "artist-verified-badge fs-08 text-truncate";
        artistVerifiedBadge.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" class="w-24px currentcolor" viewBox="0 0 24 24"><path d="M10.814.5a1.658 1.658 0 0 1 2.372 0l2.512 2.572 3.595-.043a1.658 1.658 0 0 1 1.678 1.678l-.043 3.595 2.572 2.512c.667.65.667 1.722 0 2.372l-2.572 2.512.043 3.595a1.658 1.658 0 0 1-1.678 1.678l-3.595-.043-2.512 2.572a1.658 1.658 0 0 1-2.372 0l-2.512-2.572-3.595.043a1.658 1.658 0 0 1-1.678-1.678l.043-3.595L.5 13.186a1.658 1.658 0 0 1 0-2.372l2.572-2.512-.043-3.595a1.658 1.658 0 0 1 1.678-1.678l3.595.043L10.814.5zm6.584 9.12a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308 7.425-7.425z"></path></svg>`;
        verifiedContainer.appendChild(artistVerifiedBadge);

        const artistVerified = document.createElement("span");
        artistVerified.className = "text-white fs-08 text-truncate";
        artistVerified.innerText = "Verified Artist";
        verifiedContainer.appendChild(artistVerified);
      }

      const artistName = document.createElement("h3");
      artistName.className = "text-white text-truncate py-3 pb-0 mb-0";
      artistName.style.fontSize = "calc(2vw + 2rem)";
      artistName.innerText = `${output.name}`;
      artistInfo.appendChild(artistName);

      const artistMonthlyListeners = document.createElement("div");
      artistMonthlyListeners.className = "text-white fs-5 text-truncate";
      artistMonthlyListeners.innerText = `${output.nb_fan} monthly listeners`;
      artistInfo.appendChild(artistMonthlyListeners);

      // ! ---------- PLAYLIST ----------
    } else {
      const section = document.createElement("section");
      section.id = "playlist-page";
      section.className = "collection-page mb-1 mb-sm-2 mb-md-3 mb-lg-4 mt-3";
      mainBody.appendChild(section);

      const playlist = document.createElement("div");
      playlist.className = "d-flex gap-3";
      section.appendChild(playlist);

      const playlistHeader = document.createElement("div");
      playlistHeader.className = "d-flex flex-column";
      playlist.appendChild(playlistHeader);

      const playlistCover = document.createElement("div");
      playlistCover.className =
        "rounded-2 flex-shrink-0 lg-cover-container d-flex align-items-center me-3";
      playlist.appendChild(playlistCover);

      if (output.picture) {
        const albumCover = document.createElement("img");
        albumCover.src = output.picture;
        albumCover.className = "img-fluid w-100 rounded-1";
        playlistCover.appendChild(albumCover);
      } else {
        playlistCover.classList.add("d-none");
      }

      const playlistInfo = document.createElement("div");
      playlistInfo.className = "d-flex flex-column justify-content-end";
      playlist.appendChild(playlistInfo);

      const playlistShared = document.createElement("div");
      playlistShared.className = "text-white fs-08 text-truncate";
      playlistShared.innerText = "Public Playlist";
      playlistInfo.appendChild(playlistShared);

      const playlistTitle = document.createElement("h3");
      playlistTitle.className =
        "text-white py-3 m-0 text-truncate pb-0 mb-0 le-1";
      playlistTitle.style.fontSize = "calc(2vw + 2rem)";
      playlistTitle.innerText = `${output.title}`;
      playlistShared.appendChild(playlistTitle);

      const playlistInfoFooter = document.createElement("div");
      playlistInfoFooter.className = "text-white m-0 text-truncate pb-0 mb-0";
      playlistInfoFooter.innerHTML = `<b>${output.creator.name}</b> • ${output.fans} likes • ${output.tracks.data.length} songs`;
      playlistInfo.appendChild(playlistInfoFooter);
    }

    // ! COLLECTION PLAYER

    const innerCollection = document.createElement("div");
    innerCollection.classList =
      "container d-flex flex-column p-3 h-100 w-100 z-6 mt-25";
    mainBody.appendChild(innerCollection);

    const collectionBodyTop = document.createElement("div");
    collectionBodyTop.className = "d-flex flex-column w-100";
    innerCollection.appendChild(collectionBodyTop);

    const mainCollectionControls = document.createElement("div");
    mainCollectionControls.className = "d-flex align-items-center mt-4 gap-4";
    mainCollectionControls.innerTextFollowing;
    collectionBodyTop.appendChild(mainCollectionControls);

    const playPauseButton = document.createElement("button");
    playPauseButton.id = "play-pause-button-1";
    playPauseButton.type = "button";
    playPauseButton.className = "w-48px rounded-circle";
    playPauseButton.innerHTML = `
    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="w-32px currentcolor"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>`;
    const artistId = output.id;
    playPauseButton.addEventListener("click", function () {
      playSong(artistId);
    });
    mainCollectionControls.appendChild(playPauseButton);

    const shuffleButton = document.createElement("button");
    shuffleButton.id = "shuffle-button";
    shuffleButton.type = "button";
    shuffleButton.className = "w-24px rounded-circle bg-transparent grey-font";
    shuffleButton.innerHTML = `
    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="w-24px currentcolor"><path d="M18.788 3.702a1 1 0 0 1 1.414-1.414L23.914 6l-3.712 3.712a1 1 0 1 1-1.414-1.414L20.086 7h-1.518a5 5 0 0 0-3.826 1.78l-7.346 8.73a7 7 0 0 1-5.356 2.494H1v-2h1.04a5 5 0 0 0 3.826-1.781l7.345-8.73A7 7 0 0 1 18.569 5h1.518l-1.298-1.298z"></path><path d="M18.788 14.289a1 1 0 0 0 0 1.414L20.086 17h-1.518a5 5 0 0 1-3.826-1.78l-1.403-1.668-1.306 1.554 1.178 1.4A7 7 0 0 0 18.568 19h1.518l-1.298 1.298a1 1 0 1 0 1.414 1.414L23.914 18l-3.712-3.713a1 1 0 0 0-1.414 0zM7.396 6.49l2.023 2.404-1.307 1.553-2.246-2.67a5 5 0 0 0-3.826-1.78H1v-2h1.04A7 7 0 0 1 7.396 6.49z"></path></svg>`;
    mainCollectionControls.appendChild(shuffleButton);

    if (output.type === "playlist") {
      const favouriteButton = document.createElement("button");
      favouriteButton.id = "favourite-button";
      favouriteButton.type = "button";
      favouriteButton.className =
        "w-24px rounded-circle bg-transparent spotigreen";
      favouriteButton.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="w-24px currentcolor"><path d="M8.667 1.912a6.257 6.257 0 0 0-7.462 7.677c.24.906.683 1.747 1.295 2.457l7.955 9.482a2.015 2.015 0 0 0 3.09 0l7.956-9.482a6.188 6.188 0 0 0 1.382-5.234l-.49.097.49-.099a6.303 6.303 0 0 0-5.162-4.98h-.002a6.24 6.24 0 0 0-5.295 1.65.623.623 0 0 1-.848 0 6.257 6.257 0 0 0-2.91-1.568z"></path></svg>`;
      mainCollectionControls.appendChild(favouriteButton);

      const donwloadButton = document.createElement("button");
      donwloadButton.id = "download-button";
      donwloadButton.type = "button";
      donwloadButton.className =
        "w-24px rounded-circle bg-transparent grey-font";
      donwloadButton.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="w-24px currentcolor"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"></path><path d="M12 6.05a1 1 0 0 1 1 1v7.486l1.793-1.793a1 1 0 1 1 1.414 1.414L12 18.364l-4.207-4.207a1 1 0 1 1 1.414-1.414L11 14.536V7.05a1 1 0 0 1 1-1z"></path></svg>`;
      mainCollectionControls.appendChild(donwloadButton);
    } else {
      const followButton = document.createElement("button");
      followButton.className =
        "bg-transparent rounded-5 border border-1 border-white py-1 px-3 text-white fw-bold";
      followButton.innerText = "Follow";
      mainCollectionControls.appendChild(followButton);
    }

    const moreButton = document.createElement("button");
    moreButton.id = "more-button";
    moreButton.type = "button";
    moreButton.className = "w-24px rounded-circle bg-transparent grey-font";
    moreButton.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="w-24px currentcolor"><path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>`;
    mainCollectionControls.appendChild(moreButton);

    const collectionBody = document.createElement("div");
    collectionBody.className = "d-flex flex-column";
    innerCollection.appendChild(collectionBody);

    if (output.type === "artist") {
      const artistId = output.id;
      await pullArtistTopTracks(artistId);
    } else {
      const collectionTrackDetails = document.createElement("div");
      collectionTrackDetails.id = "collection-track-details";
      collectionTrackDetails.className =
        "d-flex p-3 align-items-center gap-4 grey-font border-bottom border-1";
      collectionTrackDetails.innerTextFollowing;
      collectionBody.appendChild(collectionTrackDetails);

      const trackNumber = document.createElement("span");
      trackNumber.innerText = "#";
      collectionTrackDetails.appendChild(trackNumber);

      const trackTitle = document.createElement("span");
      trackTitle.innerText = "Title";
      collectionTrackDetails.appendChild(trackTitle);

      const trackDuration = document.createElement("span");
      trackDuration.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="w-16px currentcolor"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path><path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path></svg>`;
      collectionTrackDetails.appendChild(trackDuration);
    }
  } catch (error) {
    console.error("🔴 Fetching error:", error);
  }
}

// ! ---------- ARTIST TOP TRACKS ----------

async function pullArtistTopTracks(artistId) {
  console.log(`-> Started pulling artist top tracks with id: ${artistId}`);
  const url = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=10`;

  try {
    const output = await fetch(url, options);

    if (!output.ok) {
      throw new Error("🔴 Error");
    }

    console.log("--> Waiting for an output");

    const jsonOutput = await output.json();
    console.log("--> jsonOutput:", jsonOutput.data);

    const mainBody = document.getElementById("main-body");

    const innerCollection = document.createElement("div");
    innerCollection.className =
      "container d-flex flex-column p-3 h-100 w-100 z-6 mt-25";
    mainBody.appendChild(innerCollection);

    const collectionBody = document.createElement("div");
    collectionBody.className = "d-flex flex-column";
    innerCollection.appendChild(collectionBody);

    const popular = document.createElement("div");
    popular.className = "row";
    popular.innerHTML = `<h2 class="text-white mb-3">Popular</h2>`;
    collectionBody.appendChild(popular);

    const songCol = document.createElement("div");
    songCol.id = "tracksContainer";
    songCol.className = "col-12";
    collectionBody.appendChild(songCol);

    async function getTopTracks() {
      const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=10`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    }

    function renderTopTracks(topTracks) {
      if (topTracks.data) {
        let songNumber = 1;
        topTracks.data.forEach((track) => {
          const card = document.createElement("div");
          card.className = "bg-transparent text-white border-0 mx-0 py-3";

          const cardBody = document.createElement("div");
          cardBody.className = "";
          const row = document.createElement("div");
          row.className = "row";

          const rowMain = document.createElement("div");
          rowMain.className = "d-flex align-items-center gap-4";

          const songNum = document.createElement("span");
          songNum.className = "grey-font fs-09";
          songNum.innerText = songNumber;
          rowMain.appendChild(songNum);

          const imgColumn = document.createElement("span");
          imgColumn.className = "grey-font fs-09";

          if (track.album.cover_small) {
            const img = document.createElement("img");
            img.src = track.album.cover_small;
            img.alt = track.title;
            img.className = "img-fluid w-40px";
            imgColumn.appendChild(img);
          }

          const textColumn = document.createElement("span");
          textColumn.className = "";

          const title = document.createElement("span");
          title.className = "text-white fs-5";
          title.textContent = track.title;

          songCol.appendChild(card);
          card.appendChild(cardBody);
          cardBody.appendChild(row);
          row.appendChild(rowMain);
          rowMain.appendChild(imgColumn);
          rowMain.appendChild(textColumn);
          textColumn.appendChild(title);
          console.log(`-> item ${songNumber} generated`);
          songNumber++;
        });
      } else {
        console.error("Nessuna traccia trovata nell'album.");
      }
    }
    const topTracks = await getTopTracks();
    renderTopTracks(topTracks);
    pullArtistAlbums(artistId);
  } catch (error) {
    console.error("🔴 Error fetching top tracks:", error);
  }
}

// ! ---------- DISCOGRAFIA ----------

async function pullArtistAlbums(artistId) {
  console.log(`-> Started pulling artist top tracks with id: ${artistId}`);

  let albumsPerPage = 5;
  let currentPage = 1;
  let totalAlbums;
  const displayedAlbums = new Set();

  async function getArtistDiscography(artist) {
    try {
      const urlDiscography =
        "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist.name;
      const response = await fetch(urlDiscography, options);
      const data = await response.json();
      const canzoni = data.data.filter(
        (canzone) => canzone.artist.id === artist.id
      );
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
    const showMoreButton = document.getElementById("show-more-button");
    showMoreButton.style.display = "none";
  }

  function addToSet(name, album) {
    const nameAlreadyExists = Array.from(displayedAlbums).some(
      (item) => item.album.title === name
    );
    if (!nameAlreadyExists) {
      displayedAlbums.add(album);
    }
  }

  function mostraAlbum(canzoni) {
    const start = currentPage === 1 ? 0 : 5;
    const end = start + albumsPerPage;

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
        const songCol = document.getElementById("tracksContainer");
        songCol.appendChild(col);
      });
    if (end >= totalAlbums) {
      const showMoreButton = document.getElementById("show-more-button");
      showMoreButton.classList.add("d-none");
    }
  }

  // * CHIAMATE DISCOGRAFIA

  const artist = await getArtist();
  getArtistDiscography(artist);
  const canzoni = await getArtistDiscography(artist);
  mostraAlbum(canzoni);
  const showMoreButton = document.createElement("button");
  showMoreButton.id = "show-more-button";
  showMoreButton.type = "button";
  showMoreButton.className = "btn border-0 bg-transparent fs-09 grey-font";
  showMoreButton.innerText = "Show more";
  showMoreButton.addEventListener("click", () => {
    showMore(canzoni);
  });
  const songCol = document.getElementById("tracksContainer");
  songCol.appendChild(showMoreButton);

  async function getArtist() {
    const apiUrl =
      "https://deezerdevs-deezer.p.rapidapi.com/artist/" + artistId;
    const response = await fetch(apiUrl, options);
    console.log(response);
    const data = await response.json();
    console.log(data);
    return data;
  }
}
