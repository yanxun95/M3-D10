let movieCategoryArr = []
let movieArr = []
let movieObj = {}
const eventId = new URLSearchParams(location.search).get("id")
const endpoint = eventId ? "https://striveschool-api.herokuapp.com/api/movies/" + eventId : "https://striveschool-api.herokuapp.com/api/movies/"
const method = eventId ? "PUT" : "POST"
const headers = new Headers({
    'Content-Type': 'application/json',
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTFjZjZiODJkNTI2MjAwMTViNmRjOTgiLCJpYXQiOjE2MjkyODgxMjAsImV4cCI6MTYzMDQ5NzcyMH0.XfRUnn6BFJPPRnEwvnQnjrk0oaXPSwwKyJlEGV6Wn9k"
})
const btnBackOfficeSubmit = document.querySelector(".btn.btn-primary.mt-2");
const container = document.querySelector(".container.mt-5");
const btnDelete = document.createElement("button");
btnDelete.classList.add("btn");
btnDelete.classList.add("btn-danger");
btnDelete.classList.add("mt-2");
btnDelete.setAttribute("id", "delete-btn");
btnDelete.setAttribute("onclick", "deletemovie()");
btnDelete.innerText = "Delete";

window.onload = async () => {
    if (eventId) {
        btnBackOfficeSubmit.innerHTML = "Update"
        container.appendChild(btnDelete);

        const response = await fetch("https://striveschool-api.herokuapp.com/api/movies/", {
            headers
        })
        const movieDetails = await response.json()
        movieCategoryArr = movieDetails;
        movieCategoryArr.forEach(category => {
            getMovie(category);
        });
        fillTheInput(movieArr);

    } else {
        btnBackOfficeSubmit.innerHTML = "Submit"
    }
}

const sendMovie = async () => {
    let response = await fetch(endpoint, {
        method,
        body: JSON.stringify(movieObj),
        headers
    })
    if (response.ok) {
        // everything went well
        const respEvent = await response.json()

        if (eventId) {
            showAlert("success", "Appointment with an id of: " + respEvent._id + " got edited successfully")
            setTimeout(() => { window.location.assign("/") }, 3000)
        }
        else {
            showAlert("success", "Appointment created successfully with an id of " + respEvent._id)
            setTimeout(() => { window.location.assign("/") }, 3000)
        }
    } else {

        if (response.status >= 400 && response.status < 500) {
            throw new Error("User generated error, verify the data that you are sending!")
        } else if (response.status >= 500 && response.status < 600) {
            throw new Error("Server generated error, contact the admin to fix this problem.")
        }
    }
}

const submitData = () => {
    let movieName = document.getElementById("name").value;
    let category = document.getElementById("category").value;
    let description = document.getElementById("description").value;
    let imageUrl = document.getElementById("imageUrl").value;

    if (movieName == "") {
        alert("Movie name is empty")
    } else if (category == "") {
        alert("Category name is empty")
    } else if (description == "") {
        alert("Description name is empty")
    } else if (imageUrl == "") {
        alert("ImageUrl name is empty")
    } else {
        movieObj = { name: movieName, description: description, category: category, imageUrl: imageUrl }
        sendMovie();
    }

}

const deletemovie = async () => {
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers
        })
        if (response.ok) {
            const deletedObj = await response.json()
            showAlert("success", "Event with id: " + deletedObj._id + " deleted successfully")
            setTimeout(() => { window.location.assign("/") }, 3000)
        } else {
            showAlert("danger", "Something went wrong in the deletion process")
        }
    } catch (err) {
        showAlert("danger", err.message)
    }
}

const showAlert = (type, msg) => {
    const alertContainer = document.getElementById("alert-box")

    alertContainer.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${msg}
            </div>`


    setTimeout(() => {
        alertContainer.innerHTML = ""
    }, 3000)
}

const fillTheInput = (x) => {
    console.log(x)
    x.forEach(arr => {
        if (arr._id === eventId) {
            document.getElementById("name").value = arr.name
            document.getElementById("category").value = arr.category
            document.getElementById("description").value = arr.description
            document.getElementById("imageUrl").value = arr.imageUrl
        }
    });
}

const getMovie = async (category) => {
    try {
        let response = await fetch("https://striveschool-api.herokuapp.com/api/movies/" + category, {
            headers
        })
        let movies = await response.json();
        movieArr.push(...movies)
    } catch (error) {
        console.log(error);
    } finally {
        fillTheInput(movieArr)
    }
}