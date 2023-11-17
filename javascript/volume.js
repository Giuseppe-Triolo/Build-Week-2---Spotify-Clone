const volumeRange = document.getElementById("volume-range");

volumeRange.addEventListener("input", function () {
  trackRange.value = this.value;
});

trackRange.addEventListener("input", function () {});
