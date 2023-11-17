async function generateCollections() {
  const targetElementsToGenerate = asideCollections;
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
        collectionMaxItems = 100; // Artisti totali registrati nell'API di Deezer
      } else {
        collection = "playlist";
        collectionUrl = "https://deezerdevs-deezer.p.rapidapi.com/playlist/";
        collectionMaxItems = 99999911; // Playlist totali registrate nell'API Deezer
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
        console.error("🔴 ID vuoto.");
        attempt++;
        continue;
      }

      if (output.type === "artist") {
        if (output.nb_fan < 99) {
          continue;
        }
      }

      createCollectionCard(output, collection, fullUrl);
      generatedItems++;
      console.log(`🟢 Elemento ${generatedItems} generato con successo.`);
    } catch (error) {
      console.error(`🔴 Errore durante il tentativo ${attempt + 1}:`, error);
      attempt++;
    }
  }

  if (generatedItems < targetElementsToGenerate) {
    console.error(
      `🟡 Sono stati generati solo ${generatedItems} elementi su ${targetElementsToGenerate} desiderati.`
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  generateCollections();
});

const leftAsideCollectionsContainer = document.getElementById(
  "left-aside-collections-container"
);

function createCollectionCard(output, collection, fullUrl) {
  const col = document.createElement("div");
  col.className = "col-12 rounded-2 w-100 mb-2";
  leftAsideCollectionsContainer.appendChild(col);

  const card = document.createElement("a");
  card.href = "#";
  card.className =
    "card d-flex flex-row align-items-center text-white ps-0 bg-transparent";
  card.addEventListener("click", accessCollection);
  col.appendChild(card);

  const cardIdUrl = document.createElement("div");
  cardIdUrl.className = "d-none";
  cardIdUrl.innerText = `${fullUrl}`;
  card.appendChild(cardIdUrl);

  const imgContainer = document.createElement("div");
  imgContainer.className =
    "img-container rounded-2 flex-shrink-0 cover-container d-flex align-items-center me-3";
  card.appendChild(imgContainer);

  const albumCover = document.createElement("img");
  if (output.picture) {
    albumCover.className =
      collection === "artist"
        ? "img-fluid w-100 img-container rounded-circle"
        : "img-fluid w-100 img-container rounded-1";
    albumCover.src = output.picture;
    imgContainer.appendChild(albumCover);
  } else {
    col.className = "d-none";
  }

  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex flex-column p-0";
  card.appendChild(cardBody);

  const cardTitle = document.createElement("div");
  cardTitle.className = "card-title text-truncate m-0 fs-6";
  cardTitle.innerText = collection === "artist" ? output.name : output.title;
  cardBody.appendChild(cardTitle);

  const cardType = document.createElement("div");
  cardType.className = "card-title grey-font text-truncate m-0 fs-08";
  cardType.innerText =
    collection === "artist" ? "Artista" : `Playlist • ${output.creator.name}`;
  cardBody.appendChild(cardType);
}
