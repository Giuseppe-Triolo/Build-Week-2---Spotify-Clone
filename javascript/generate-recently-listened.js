window.onload = () => {
  generateRecentlyListened();
};

async function generateRecentlyListened() {
  const targetElementsToGenerate = recentlyListened;
  let generatedItems = 0;
  const maxAttempts = 50;
  let attempt = 0;
  let collection = "";

  while (attempt < maxAttempts && generatedItems < targetElementsToGenerate) {
    try {
      const randomCollection = Math.random();
      let collectionUrl;
      let collectionMaxItems;

      if (randomCollection > 0) {
        collection = "artist";
        collectionUrl = "https://deezerdevs-deezer.p.rapidapi.com/artist/";
        collectionMaxItems = 1711306;
      } else {
        collection = "playlist";
        collectionUrl = "https://deezerdevs-deezer.p.rapidapi.com/playlist/";
        collectionMaxItems = 99999911;
      }

      const randomElement = Math.floor(Math.random() * collectionMaxItems) + 1;
      const fullUrl = `${collectionUrl}${randomElement}`;
      console.log(`Tentativo di accesso a: ${fullUrl}`);

      const response = await fetch(fullUrl, options);

      if (!response.ok) {
        if (response.status === 429) {
          console.log(
            "🟠 Raggiunto il limite di richieste, attendere 10 secondi..."
          );
          await new Promise((resolve) => setTimeout(resolve, 10000));
          continue;
        }
        throw new Error(`🔴 Risposta non valida. Status: ${response.status}`);
      }

      const output = await response.json();

      if (output.error && output.error.message === "no data") {
        console.error("🔴 Nessun dato trovato, riprovare con un nuovo ID.");
        attempt++;
        continue;
      }

      createPlaylistCard(output, fullUrl, collection);
      generatedItems++;
      console.log(`🟢 Elemento ${generatedItems} generato con successo.`);
    } catch (error) {
      console.error(`🔴 Errore durante il tentativo ${attempt + 1}:`, error);
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds before retrying
    }
  }

  if (generatedItems < targetElementsToGenerate) {
    console.error(
      `🟡 Sono stati generati solo ${generatedItems} elementi su ${targetElementsToGenerate} desiderati.`
    );
  }
}

const recentlyListenedInnerBody = document.getElementById(
  "recently-listened-inner-body"
);

function createPlaylistCard(output, fullUrl, collection) {
  const col = document.createElement("div");
  col.className =
    "col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 rounded-2 text-truncate";
  recentlyListenedInnerBody.appendChild(col);

  const card = document.createElement("a");
  card.href = "#";
  card.className = "card d-flex flex-row text-white ps-0";
  card.addEventListener("click", accessCollection);
  col.appendChild(card);

  const cardIdUrl = document.createElement("div");
  cardIdUrl.className = "d-none";
  cardIdUrl.innerText = `${fullUrl}`;
  card.appendChild(cardIdUrl);

  const albumCover = document.createElement("img");
  if (output.picture) {
    albumCover.className = "img-fluid rounded-start w-48px";
    albumCover.src = output.picture;
    card.appendChild(albumCover);
  }

  const cardBody = document.createElement("div");
  cardBody.className = "card-body p-0 ps-2 d-flex align-items-center";
  card.appendChild(cardBody);

  const cardTitle = document.createElement("h5");
  cardTitle.className =
    "card-title text-truncate-2 m-0 w-100 h-100 d-flex align-items-center";
  cardTitle.innerText = collection === "artist" ? output.name : output.title;
  cardBody.appendChild(cardTitle);
}
