const API_KEY = "ec3ae1d56cde65b04559cc8d18863981"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";


async function loadHeroMovie() {
  const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  const data = await res.json();
  const randomIndex = Math.floor(Math.random() * data.results.length);
  const movie = data.results[randomIndex];

  document.querySelector(".hero-section").style.backgroundImage =
    `linear-gradient(to right, black, transparent),
     url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`;

  document.getElementById("hero-title").innerText = movie.title;
  document.getElementById("hero-desc").innerText = movie.overview;
  document.getElementById("hero-rating").innerText = "★ " + movie.vote_average;
  document.getElementById("hero-year").innerText = movie.release_date.slice(0, 4);
}

async function loadMovies(endpoint, containerId) {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
  const data = await res.json();
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  data.results.forEach(movie => {
    if (!movie.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG_URL + movie.poster_path;
    img.classList.add("movie-card");

    img.onclick = () => playTrailer(movie.id);

    container.appendChild(img);
  });
}

async function playTrailer(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await res.json();

  const trailer = data.results.find(
    v => v.type === "Trailer" && v.site === "YouTube"
  );

  if (!trailer) {
    alert("Trailer not available");
    return;
  }

  window.open(
    `https://www.youtube.com/watch?v=${trailer.key}`,
    "_blank"
  );
}

loadHeroMovie();
loadMovies("/trending/movie/week", "trending");
loadMovies("/movie/top_rated", "top-rated");
