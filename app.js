const charactersURL = "https://rickandmortyapi.com/api/character";
const episodesURL = "https://rickandmortyapi.com/api/episode";
const locationsURL = "https://rickandmortyapi.com/api/location";
const modalZone = document.getElementById("modalzone");
const abridor = document.getElementById("abridor");

let currentpage = 1;
let pagina = 1;
let contadorPagina = 1;
async function apiDataLoad() {
  const characters = await axios.get(`${charactersURL}`);
  const episodes = await axios.get(`${episodesURL}`);
  const locations = await axios.get(`${locationsURL}`);
  return {
    characters: characters.data,
    episodes: episodes.data,
    locations: locations.data,
  };
}
async function apiDataLoadEpisode(url) {
  const episodes = await axios.get(url);

  return {
    episodes: episodes.data,
  };
}
async function getEpisode(url) {
  const res = await apiDataLoadEpisode(url);
  return res.episodes.name;
}

async function getDataCount(data) {
  const res = await apiDataLoad();
  return res[data].info.count;
}
async function mostrarCount() {
  const characters = await getDataCount("characters");
  const episodes = await getDataCount("episodes");
  const locations = await getDataCount("locations");
  personagens.innerHTML = characters;
  localizacoes.innerHTML = locations;
  episodios.innerHTML = episodes;
}
mostrarCount();

async function apiDataLoadCards(name, currentpage) {
  const characters = await axios.get(
    `${charactersURL}/?name=${name}&page=${currentpage}`
  );
  return characters.data.results;
}
let totalCards = 0;
async function montarCard(pagina) {
  const searchTerm = document.getElementById("buscador").value;
  pages.innerHTML = `<b>${contadorPagina} </b> `;
  const cards = await apiDataLoadCards(searchTerm, currentpage);
  container.innerHTML = "";
  let index = 0;
  totalCards = cards.length;
  var cardsPorPagina = 8;
  renderizarButtons();
  var startIndex = (pagina - 1) * cardsPorPagina;
  var endIndex = startIndex + cardsPorPagina;
  var pagCards = cards.slice(startIndex, endIndex);

  async function processCharacter(personagem) {
    const episodeName = await getEpisode(
      personagem.episode[personagem.episode.length - 1]
    );

    container.innerHTML += `
    <div class="col-lg-3 col-sm-12 mt-5 d-flex justify-content-center flex-wrap">
      <div class="card m-1 border-3 border-success" style="width:475px">
        <img class="card-img-top " src="${
          personagem.image
        }" alt="Character image"> 
        <div class="card-img-overlay d-flex justify-content-end  flex-column">
          <button class="card-title text-center btn btn-outline-success bgzinho abridor" data-image="${
            personagem.image
          }" data-name="${personagem.name}" data-status="${status(
      personagem
    )}" data-species="${personagem.species}" data-location="${
      personagem.location.name
    }" data-episode="${episodeName}">${personagem.name}</button>
        </div>
      </div>
    </div>
  `;
  }

  async function handleButtonClick(event) {
    const button = event.currentTarget;
    const personagem = {
      image: button.getAttribute("data-image"),
      name: button.getAttribute("data-name"),
      status: button.getAttribute("data-status"),
      species: button.getAttribute("data-species"),
      location: button.getAttribute("data-location"),
      episodeName: button.getAttribute("data-episode"),
    };

    montarModal(
      personagem.image,
      personagem.name,
      personagem.status,
      personagem.species,
      personagem.location,
      personagem.episodeName
    );
  }

  // Loop through pagCards
  for (const personagem of pagCards) {
    await processCharacter(personagem);
  }

  // Add event listener outside the loop
  document.querySelectorAll(".abridor").forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });
}
document.getElementById("anterior").addEventListener("click", anterior);
document.getElementById("proxima").addEventListener("click", proxima);
montarCard(pagina);

function status(cards) {
  if (cards.status == "Alive") {
    return `💚 Vivo`;
  }
  if (cards.status == "Dead") {
    return `❤️ Morto`;
  } else {
    return `🩶 Desconhecido`;
  }
}
function renderizarButtons() {
  if (pagina == 1 && currentpage == 1) {
    document.getElementById("anterior").classList.add("hidden");
  }
  if (pagina >= 2) {
    document.getElementById("anterior").classList.remove("hidden");
  }
  if (totalCards < 20) {
    document.getElementById("proxima").classList.add("hidden");
  }
  if (totalCards > 19) {
    document.getElementById("proxima").classList.remove("hidden");
  }
}
function proxima() {
  pagina++;

  if (pagina > 3) {
    pagina = 1;
    currentpage++;
  }
  contadorPagina++;
  montarCard(pagina);
}

function anterior() {
  if (currentpage > 1 && pagina === 2) {
    pagina = 1;
  } else if (pagina > 1) {
    pagina--;
  } else if (currentpage > 1 && pagina === 1) {
    pagina = 3;
    currentpage--;
  }
  contadorPagina--;
  montarCard(pagina);
}
buscador.addEventListener("input", buscar);
function buscar() {
  currentpage = 1;
  pagina = 1;
  contadorPagina = 1;
  montarCard(pagina);
}

function montarModal(image, name, status, species, location, episode) {
  modalZone.innerHTML = `<div class="modal fade" id="personagemModal" tabindex="-1" role="dialog" aria-labelledby="personagemModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
  <div class="card mb-3">
  <img src="${image}" class="card-img-top scale-in-ver-top" alt="...">
  <div class="card-body text-center ">
    <h3 class="card-title">${name}</h3>
    <h5 class="text-body-secondary">${status} - ${species}</h5>
    <h4>Última localização conhecida:</h4>
    <h5 class="text-body-secondary">${location}</h5>
    <h4>Visto a última vez em:</h4>
    <h5>${episode}</h5>
  </div>
</div>
  </div>
</div>`;

  $("#personagemModal").modal("show");
}
