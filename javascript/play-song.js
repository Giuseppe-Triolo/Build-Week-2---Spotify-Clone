async function playSong(artistId) {
  console.log("artistId:", artistId);
  const url = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=10`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("🔴 Error");
    }

    const topTracks = await response.json();
    console.log("topTracks:", topTracks);

    const artistTracks = topTracks.data.length;
    const randomArtistTrack = Math.floor(Math.random() * artistTracks);

    const audioPlayer = document.getElementById("audio-player");
    audioPlayer.src = topTracks.data[randomArtistTrack].preview;

    const playButton = document.getElementById("play-pause-button");

    playButton.addEventListener("click", () => {
      if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.classList.remove("play");
        const play = document.getElementById("svg-play");
        play.classList.toggle("d-none");
        const pause = document.getElementById("svg-pause");
        pause.classList.toggle("d-none");
        console.log("⏯ Play");
      } else {
        audioPlayer.pause();
        playButton.classList.remove("pause");
        const play = document.getElementById("svg-play");
        play.classList.toggle("d-none");
        const pause = document.getElementById("svg-pause");
        pause.classList.toggle("d-none");
        playButton.classList.add("play");
        console.log("⏯ Pause");
      }
    });

    const currentlyPlayingSongImg = document.getElementById(
      "currently-playing-song-img"
    );
    const currentlyPlayingSongTitle = document.getElementById(
      "currently-playing-song-title"
    );
    const currentlyPlayingSongArtist = document.getElementById(
      "currently-playing-song-artist"
    );

    const duration = topTracks.data[randomArtistTrack].duration;
    updateTrackDuration(duration);

    currentlyPlayingSongImg.src = topTracks.data[randomArtistTrack].album.cover;
    currentlyPlayingSongTitle.innerText =
      topTracks.data[randomArtistTrack].album.title;
    currentlyPlayingSongArtist.innerText =
      topTracks.data[randomArtistTrack].artist.name;
  } catch (error) {
    console.error("🔴 Error fetching top tracks:", error);
  }
}

const audioPlayer = document.getElementById("audio-player");
const trackDuration = document.getElementById("track-duration");

function updateTrackDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  trackDuration.textContent = formattedDuration;
}

function updateProgressBar() {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  trackRange.value = progress;
}

function seekToTime(seekTime) {
  audioPlayer.currentTime = seekTime;
}

audioPlayer.addEventListener("timeupdate", () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  trackRange.value = progress;

  const elapsed = document.getElementById("elapsed");
  const elapsedMinutes = Math.floor(audioPlayer.currentTime / 60);
  const elapsedSeconds = Math.floor(audioPlayer.currentTime % 60);
  elapsed.textContent = `${elapsedMinutes}:${elapsedSeconds
    .toString()
    .padStart(2, "0")}`;
});

trackRange.addEventListener("input", () => {
  const seekTime = (trackRange.value / 100) * audioPlayer.duration;
  seekToTime(seekTime);
});

let isDragging = false;

trackRange.addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    const seekTime = (trackRange.value / 100) * audioPlayer.duration;
    seekToTime(seekTime);
  }
});

document.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const rect = trackRange.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const rangeWidth = rect.width;
    const seekPercentage = (offsetX / rangeWidth) * 100;
    trackRange.value = seekPercentage;
    const seekTime = (seekPercentage / 100) * audioPlayer.duration;
    seekToTime(seekTime);
  }
});

trackRange.addEventListener("dragstart", (event) => {
  event.preventDefault();
});

document.addEventListener("selectstart", (event) => {
  if (isDragging) {
    event.preventDefault();
  }
});

trackRange.value = 0;

audioPlayer.addEventListener("timeupdate", () => {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;

  const progress = (currentTime / duration) * 100;

  trackRange.value = progress;
  trackRange.style.setProperty("--value", progress);
  trackRange.style.setProperty("--min", 0);
  trackRange.style.setProperty("--max", 100);
});

trackRange.addEventListener("input", () => {
  const seekPercentage = trackRange.value;
  const seekTime = (seekPercentage / 100) * audioPlayer.duration;

  audioPlayer.currentTime = seekTime;
});
