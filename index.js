let movieCategoryArr = []
let moviesArr = []
let headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTFjZjZiODJkNTI2MjAwMTViNmRjOTgiLCJpYXQiOjE2MjkyODgxMjAsImV4cCI6MTYzMDQ5NzcyMH0.XfRUnn6BFJPPRnEwvnQnjrk0oaXPSwwKyJlEGV6Wn9k"
}
let categoryRow = document.querySelector(".main-container");

window.onload = async () => {

    await getMovieCategory();
}

const getMovieCategory = async () => {
    isLoading(true)
    try {
        let response = await fetch("https://striveschool-api.herokuapp.com/api/movies/", {
            headers
        })
        movieCategoryArr = await response.json();
        movieCategoryArr.forEach(category => {
            getMovie(category);
        });
    } catch (error) {
        console.log(error);
    } finally {
        isLoading(false)
    }

}

const getMovie = async (category) => {
    try {
        let response = await fetch("https://striveschool-api.herokuapp.com/api/movies/" + category, {
            headers
        })
        let movies = await response.json();

        categoryRow.innerHTML += ""
        let openingString = `<div class="container mt-3">
        <h6>${category} movies</h6>
        <div class="row mx-n1" id="${category}">`
        let moviesString = ""

        movies.forEach(movie => {
            // console.log(movie)
            moviesString += `<div class="col-sm-6 col-md-4 col-xl-2 px-1">
            <div class="card" id="${movie._id}"  onclick="editMovie(this)">
              <img src="${movie.imageUrl}"
              class="card-img-top img-fluid" 
              alt="picture" />
            </div>
          </div>`

        });

        categoryRow.innerHTML += openingString + moviesString + `</div>
      </div >`

    } catch (error) {
        console.log(error);
    }
}

const editMovie = (movie) => {
    // console.log(movie)
    // console.log(movie.id, movie.category)
    window.location.href = ("/backOffice.html?id=" + movie.id);
}

const isLoading = (loading) => {
    if (loading) {
        document.querySelector(".spinner-border").classList.remove("d-none")
    } else {
        document.querySelector(".spinner-border").classList.add("d-none")
    }
}