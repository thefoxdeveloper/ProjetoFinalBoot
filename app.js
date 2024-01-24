const charactersURL = "https://rickandmortyapi.com/api/character";
const episodesURL = "https://rickandmortyapi.com/api/episode";
const locationsURL = "https://rickandmortyapi.com/api/location";

let currentpage = 1;
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
let totalCards = 0
async function montarCard() {


  const searchTerm = document.getElementById("buscador").value;
  pages.innerHTML = currentpage;
  const cards = await apiDataLoadCards(searchTerm, currentpage);
  container.innerHTML = "";
  let index = 0;
totalCards = cards.length

renderizarButtons()
  for (const personagem of cards) {
    index++;
    
    const episodeName = await getEpisode(
      personagem.episode[personagem.episode.length - 1]
    );

    container.innerHTML += `
      <article class="card">
        <img class="character-image" src="${
          personagem.image
        }" alt="Character image">
        <div class="character-info">
          <div>
            <h2>${personagem.name}</h2>
            <h3>${status(personagem)} - ${personagem.species}</h3>
          </div>
          <div>
            <p>Última localização conhecida:</p>
            <h3>${personagem.location.name}</h3>
          </div>
          <div>
            <p>Visto a última vez em:</p>
            <h3>${episodeName}</h3>
          </div>
        </div>
      </article>`;

    // Add horizontal line after every two cards
    if (index % 2 === 0 && index !== cards.length) {
      container.innerHTML += `<div class="horizontal-line"></div>`;
    }

  
  }  
 
}
document.getElementById("anterior").addEventListener("click", anterior);
document.getElementById("proxima").addEventListener("click", proxima);
montarCard();

function status(cards) {
  if (cards.status == "Alive") {
    return `<h4 >💚 Vivo`;
  }
  if (cards.status == "Dead") {
    return `<h4 >❤️ Morto`;
  } else {
    return `<h4 >🩶 Desconhecido`;
  }
}
function renderizarButtons() {

  if(currentpage<2){
    document.getElementById("anterior").classList.add("hidden")
  }
  if (currentpage>=2) {
    document.getElementById("anterior").classList.remove("hidden")
  }
  if(totalCards<20){
    document.getElementById("proxima").classList.add("hidden")
  }
  if (totalCards>19) {
    document.getElementById("proxima").classList.remove("hidden")
  }
}
function proxima() {
  if (totalCards>19) {
    currentpage++;
    montarCard();
   
    }
  }
  
function anterior() {
  if (currentpage > 1) {
    currentpage--;
    montarCard();
   
  }
}
buscador.addEventListener('input',buscar)
function buscar() {
  currentpage = 1;
  montarCard();
}
