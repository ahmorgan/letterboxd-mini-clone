/*
References:
https://stackoverflow.com/questions/31274329/get-list-of-filenames-in-folder-with-javascript
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
https://stackoverflow.com/questions/588263/how-can-i-get-all-a-forms-values-that-would-be-submitted-without-submitting
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
https://stackoverflow.com/questions/7077770/window-location-href-and-window-open-methods-in-javascript
https://stackoverflow.com/questions/9454863/updating-javascript-object-property
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
https://stackoverflow.com/questions/66392987/sending-data-from-one-domain-to-another-using-javascript-i-have-access-to-the
https://stackoverflow.com/questions/17502071/transfer-data-from-one-html-file-to-another
https://stackoverflow.com/questions/6856871/getting-the-parent-div-of-element
https://stackoverflow.com/questions/20792572/javascript-replace-all-20-with-a-space
https://developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling
https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
https://stackoverflow.com/questions/9454863/updating-javascript-object-property
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
https://stackoverflow.com/questions/20792572/javascript-replace-all-20-with-a-space
*/

// ***TODO: Refactor this JS file into two or three files, based on window location.
// ***TODO: Add cleaner documentation, commenting for each function.

// Helper function for accessing the current movie of the week as it is changed
function getCurrentMovie() {
    return document.querySelector("#current-movie").textContent.trim();
}

// obviously these shouldn't be exposed like this -- if I were to develop
// genuine authentication, these would be hidden.
ADMIN_PASSWORD = "SUPER_SECRET_PASSWORD_12345";
SUPER_SECRET_API_KEY = "37c4c6fb";  // Free OMDB API key

// Component 1: Carousel of relevant images for the Home page

if (document.title === "Home") {
    const images = Array.from(document.querySelectorAll(".carousel-container > img"));
    const carouselNavs = Array.from(document.querySelectorAll(".carousel-nav > a"))
    
    const carouselButtons = document.querySelectorAll(".carousel-btn");
    
    for (const btn of carouselButtons) {
        btn.addEventListener("click", swipe);
    }
    
    for (const nav of carouselNavs) {
        nav.addEventListener("click", jump);
    }

    function swipe(e) {
        const currImage = document.querySelector("img.active");
        const currNav = document.querySelector("a.nav-active");
        let currIndex = images.indexOf(currImage);
        let targetIndex;
    
        if (Array.from(e.target.classList).includes("left")) {
            if (currIndex === 0) {
                currIndex = images.length;
            }
            targetIndex = currIndex - 1;
        }
        else {
            if (currIndex === images.length-1) {
                currIndex = -1;
            }
            targetIndex = currIndex + 1;
        }
    
        images[targetIndex].classList.add("active");
        currImage.classList.remove("active");    
    
        carouselNavs[targetIndex].classList.add("nav-active")
        currNav.classList.remove("nav-active");
    }
    
    function jump(e) {
        const currImage = document.querySelector("img.active");
        const currNav = document.querySelector("a.nav-active");
    
        const targetIndex = carouselNavs.indexOf(e.target);
    
        if (targetIndex === carouselNavs.indexOf(currNav)) {
            return;
        }
    
        images[targetIndex].classList.add("active");
        currImage.classList.remove("active");
        carouselNavs[targetIndex].classList.add("nav-active");
        currNav.classList.remove("nav-active");
    }
}

// Component 2: Handle/Read Reviews, Review Pages

const REVIEW_PAGE_LENGTH = 5;

// Dummy reviews for The Shining, for demo purposes.
const shining_reviews = [
    {
        title: "Why I Love This Film",
        review: "The Shining is an incredible film. The atmosphere makes for a unique sense of dread not present in many other horror movies.",
        score: 95,
        author: "John Doe",
        responses: [
            {
                response: "This review is obviously incorrect and incoherent.",
                responseAuthor: "John Doe Esq."
            },
            {
                response: "Genius. This review is poetry in motion.",
                responseAuthor: "Jimminy Doe"
            },
            {
                response: "Never seen this movie, looks cool, thanks for the recommendation.",
                responseAuthor: "Joe"
            }
        ]
    },
    {
        title: "Example 2",
        review: "",
        score: 95,
        author: "John Doe II",
        responses: []
    },
    {
        title: "Example 3",
        review: "",
        score: 95,
        author: "John Doe III",
        responses: []
    },
    {
        title: "Example 4",
        review: "",
        score: 95,
        author: "John Doe IV",
        responses: []
    },
    {
        title: "Example 5",
        review: "",
        score: 95,
        author: "John Doe V",
        responses: []
    },
    {
        title: "Example 6",
        review: "",
        score: 95,
        author: "John Doe VI",
        responses: []
    },
    {
        title: "Example 7",
        review: "",
        score: 95,
        author: "John Doe VII",
        responses: []
    },
    {
        title: "Example 8",
        review: "",
        score: 95,
        author: "John Doe VIII",
        responses: []
    },
    {
        title: "Example 9",
        review: "",
        score: 95,
        author: "John Doe IV",
        responses: []
    },
    {
        title: "Example 10",
        review: "",
        score: 95,
        author: "John Doe V",
        responses: []
    },
    {
        title: "Example 11",
        review: "",
        score: 95,
        author: "John Doe, Esq.",
        responses: []
    },
    {
        title: "Example 12",
        review: "",
        score: 95,
        author: "The Ghost of John Doe",
        responses: []
    },
]

// Each movie is assigned an array of reviews -
// this object is updated as the current movie of the week is changed.
// (ie, if the movie of the week is changed to Ratatoiulle, reviews get a
// Ratatouille entry).
let reviews = {
    "The Shining (1980)": shining_reviews
}

if (document.title === "Discussion") {
    const reviewContainer = document.querySelector(".review-container");
    
    const nextPageReviews = document.getElementById("next-page");
    nextPageReviews.addEventListener("click", loadPage);
    if (reviews[getCurrentMovie()].length > 5) {
        nextPageReviews.classList.remove("inactive");
    }
    const prevPageReviews = document.getElementById("prev-page");
    prevPageReviews.addEventListener("click", loadPage);
    
    // Control the review previews currently visible, and 
    // update the next page/previous page buttons accordingly
    function loadPage(e) {
        const direction = e.target.getAttribute("id");
    
        const allReviews = Array.from(document.querySelectorAll(".review-container > div"));
        const activeReviews = Array.from(document.querySelectorAll(".review-grid-active"));
    
        let nextPageIdx = 0;
        if (direction === "next-page") {
            const lastActive = activeReviews[activeReviews.length-1];
            nextPageIdx = allReviews.indexOf(lastActive) + 1;
        }
        else {
            const firstActive = activeReviews[0];
            nextPageIdx = allReviews.indexOf(firstActive) - REVIEW_PAGE_LENGTH;
        }
        
        if (direction === "next-page") {
            prevPageReviews.classList.remove("inactive");
        }
        else if (activeReviews[0].getAttribute("id") == true) {
            prevPageReviews.classList.add("inactive");
            nextPageReviews.classList.remove("inactive");
        }
        else {
            nextPageReviews.classList.remove("inactive");
        }
    
        for (const reviewElem of activeReviews) { 
            reviewElem.classList.remove("review-grid-active");
            reviewElem.classList.add("review-grid-inactive");
        }
    
        for (let i = nextPageIdx; i < nextPageIdx + REVIEW_PAGE_LENGTH; i++) {
            if (i >= allReviews.length) {
                nextPageReviews.classList.add("inactive");
                break;
            }
            allReviews[i].classList.remove("review-grid-inactive");
            allReviews[i].classList.add("review-grid-active");
        }
    }

    // Component 2.5: Load in the review previews in the Discussion page
    window.addEventListener("load", populateReviews);

    function populateReviews(e) {
        let idx = 0;
        let currReviews = loadPageOfReviews(idx, getCurrentMovie());
        const reviewChildren = document.querySelectorAll(".review-container > *")
        // If no reviews to display, remove all reviews from review container
        while (reviewContainer.lastElementChild) {
            reviewContainer.removeChild(reviewContainer.lastElementChild);
        }
        // else, loop through the reviews array in increments of five and add each page
        while (currReviews) {
            for (const review of currReviews) {
                const reviewElem = document.createElement("div");
                
                const titleElem = document.createElement("h3");
                titleElem.textContent = review.title;

                const authorElem = document.createElement("p");
                authorElem.textContent = "Review by: " + review.author;

                const scoreElem = document.createElement("p");
                scoreElem.textContent = "Score: " + String(review.score) + "/100";

                const reviewLink = document.createElement("a")
                reviewLink.textContent = "Read and respond...";

                reviewLink.addEventListener("click", changeWindow);

                reviewElem.append(titleElem);
                reviewElem.append(authorElem);
                reviewElem.append(scoreElem);
                reviewElem.append(reviewLink);
                reviewElem.setAttribute("id", idx / 5);
                if (idx === 0) {
                    reviewElem.classList.add("review-grid-active");
                }
                else {
                    reviewElem.classList.add("review-grid-inactive");
                }

                reviewContainer.append(reviewElem);
            }
            idx += 5;
            currReviews = loadPageOfReviews(idx, getCurrentMovie());
        }
    }

    function loadPageOfReviews(idx, currentMovie) {
        const fullReviews = reviews[currentMovie];
        if (idx > fullReviews.length) {
            return null;
        }
        if (5 > fullReviews.slice(idx).length) {
            return fullReviews.slice(idx);
        }
        return fullReviews.slice(idx, idx+5);
    }

    // Component 2.75: Load in read_review.html, passing the current review idx as a parameter
    function changeWindow(e) {
        const allReviews = Array.from(document.querySelectorAll(".review-container > div"));
        const reviewIdx = allReviews.indexOf(e.target.parentNode);
        window.location.href = "read_review.html?review_id=" + encodeURIComponent(reviewIdx) + "&movie=" + encodeURIComponent(getCurrentMovie());
    }

    // Component 4: Basic Admin Privileges (to allow for the API integration below)
    // Simple password checking; not real authentication
    const loginBtn = document.querySelector("a[id='login-submit']");
    loginBtn.addEventListener("click", login);

    function login(e) {
        const password = document.querySelector("input[name='login']").value
        if (password === ADMIN_PASSWORD) {
            const adminControls = document.querySelector("div[id='admin-controls']");
            adminControls.classList.remove("inactive");
        }
        else {
            window.alert("Incorrect password!");
        }
    }

    // API Integration

    const changeBtn = document.querySelector("a[id='new-movie-submit']")
    changeBtn.addEventListener("click", changeMovie);

    async function changeMovie(e) {
        const movie = document.querySelector("input[id='new-movie']").value;
        const errorMsg = document.querySelector("h3[id='error-msg']");
        let movieData;

        // Using the Open Movie Database API (https://www.omdbapi.com/)
        const url = "https://www.omdbapi.com/?apikey=" + SUPER_SECRET_API_KEY + "&t=" + movie;
        try {
            const response = await fetch(url);
            movieData = await response.json();
            if (Object.keys(movieData).includes("Error")) {
                throw Error(`Error: movie not found`)
            }
            errorMsg.classList.add("inactive");
        }
        catch (Error) {
            errorMsg.classList.remove("inactive");
            return
        }

        const year = movieData["Year"];
        const title = movieData["Title"].trim() + " (" + year + ")";
        const poster = movieData["Poster"];
        const director = movieData["Director"];
        const actors = movieData["Actors"];
        const plot = movieData["Plot"];
        const imdbLink = "https://www.imdb.com/title/" + movieData["imdbID"];

        const elems = document.querySelectorAll("div[id='movie-info'] > *");
        
        elems[0].textContent = title;
        elems[1].setAttribute("src", poster);
        elems[2].textContent = "Directed by " + director;
        elems[4].textContent = actors;
        elems[5].textContent = plot;
        elems[6].setAttribute("href", imdbLink);

        // If the movie is being loaded for the first time, initialize
        // a new array for it. Otherwise, use the existing array in the reviews object.
        if (!Array.from(Object.keys(reviews)).includes(title)) {
            reviews[title] = [];
        }

        // next page button should not be visible at initialization
        if (reviews[title].length > 5) {
            nextPageReviews.classList.remove("inactive");
        }
        else {
            nextPageReviews.classList.add("inactive");
        }
        
        const writeReviewBtn = document.querySelector("a[id='write-review']");
        writeReviewBtn.setAttribute("href", "write_review.html?currentMovie=" + encodeURIComponent(getCurrentMovie()));

        populateReviews();  // currentMovie will have changed after updating the h3 tag with the movie title
        // repopulate reviews for that movie
    }   

    function clearReviews() {
        reviews.length = 0;
    }
}

if (document.title === "Read Review") {
    // Component 2.99: Display review responses
    const readResponsesBtn = document.querySelector(".read-review > a");
    readResponsesBtn.addEventListener("click", displayResponses);

    function displayResponses(e) {
        const responses = document.querySelector("#responses");
        responses.classList.toggle("inactive");
    }

    // Component 4: Load the correct review data in the read_review.html page
    window.addEventListener("load", loadReview);
    function loadReview(e) {
        const url = window.location.href.split("=");
        const reviewIdx = url[1][0];
        const currentMovie = decodeURI(url[2]);

        const currReview = reviews[currentMovie][reviewIdx];

        const reviewData = Array.from(document.querySelectorAll(".read-review > *"));
        reviewData[0].textContent = currReview["author"] + " says:";
        reviewData[1].textContent = currReview["title"] + " --- score: " + currReview["score"] + "/100";
        reviewData[2].textContent = currReview["review"];
        if (currReview["responses"].length !== 0) {
            const reviewTexts = []
            for (const response of currReview["responses"]) {
                reviewTexts.push(`<strong>${response["responseAuthor"]}</strong>: ${response["response"]}`)
            }
            reviewData[4].innerHTML = reviewTexts.join("<br><br>") + "<br><br>";
        }
        else {
            reviewData[4].innerHTML = "No Responses" + "<br>";
        }
    }

    // Component 4.5: Write response to the reviews array
    const submitResponse = document.getElementById("submit-response");
    submitResponse.addEventListener("click", addResponse);
    function addResponse(e) {
        const url = window.location.href.split("=");
        const reviewIdx = url[1][0];
        const currentMovie = decodeURI(url[2]);

        const responseAuthor = document.getElementById("response-name").value;
        const responseText = document.getElementById("response-text").value;

        reviews[currentMovie][reviewIdx].responses.push(
            {
                "response": responseText,
                "responseAuthor": responseAuthor
            }
        )
        loadReview();
    }
}

// Component 5: Write reviews to the reviews array

if (document.title === "Write Review") {
    window.addEventListener("load", updateMovie);
    function updateMovie(e) {
        const url = window.location.href;
        const currentMovie = decodeURI(url.split("=")[1]);
        const pageHeader = document.querySelector(".page-header");
        pageHeader.textContent = "Write a review for " + currentMovie;
    }

    const submitReview = document.querySelector("input[id='submit-review']");
    submitReview.addEventListener("click", addReview);

    function addReview(e) {
        const reviewForm = Array.from(document.querySelectorAll("div.write-review > input,textarea"));
    
        const reviewTitle = reviewForm[0].value;
        const reviewAuthor = reviewForm[1].value;
        const reviewText = reviewForm[2].value;
        const reviewScore = reviewForm[3].value;
        const url = window.location.href;
        const currentMovie = decodeURI(url.split("=")[1]);

        if (Object.keys(reviews).includes(currentMovie)) {
            reviews[currentMovie].push({
                title: reviewTitle,
                review: reviewText,
                score: reviewScore,
                author: reviewAuthor,
                responses: []
            })

            const successMsg = document.querySelector("main > h3");
            successMsg.classList.add("active-success");
            successMsg.classList.remove("success-msg");
        }
        else {
            window.alert("It would require setting up a database to save reviews, so currently, you can't write reviews for added movies.")
        }
    }
}

// Component 6: Interested? Counter

if (document.title === "Club Events") {
    const interestedBtns = document.querySelectorAll(".activity-container > a")
    for (const btn of interestedBtns) {
        btn.addEventListener("click", incrementCounter);
    }

    function incrementCounter(e) {
        const targetElem = e.target.previousElementSibling.querySelector("span");
        const num = parseInt(targetElem.textContent);
        targetElem.textContent = String(num+1);

        e.target.classList.add("inactive");
    }
}

