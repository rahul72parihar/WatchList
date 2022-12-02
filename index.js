
const searchBtn = document.getElementById("search-btn")
const searchInp = document.getElementById("search-input")
const mainEl = document.getElementById("main-el")
let htmlText = ``;
searchInp.value=""
let globalInput =``
if(localStorage.getItem("localInput")){
    globalInput = localStorage.getItem("localInput")
    searchInp.value = localStorage.getItem("localInput")
    let currentPage = localStorage.getItem("localPage")
    console.log("current page -> " + currentPage)
    renderPage(parseInt(currentPage),globalInput)
}
document.addEventListener("change",(e)=>{
    if(e.target.classList.contains("pages"))
        console.log(e.target.value)
        renderPage(e.target.value,globalInput)
})
let watchListData = []
if(localStorage.getItem("localWatchList")){
    watchListData = JSON.parse(localStorage.getItem("localWatchList"))
}
searchBtn.addEventListener("click",handleSearch)

function handleSearch(){
    let toSearch = searchInp.value;
    if(toSearch==""){
        return;
    }
    globalInput = toSearch
    renderPage(1,toSearch)
}

async function renderPage(pageNo,toSearch){
    console.log(" page -> " + pageNo)
    localStorage.setItem("localInput", toSearch);
    localStorage.setItem("localPage", pageNo);
    await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=44b8e4dc&s=${toSearch}&page=${pageNo}`)
        .then(res=>res.json())
        .then(data=>{
            if(data.Response=='False'){
                renderNotFound()
                return
            }
            console.log(data)
            renderMain(data)
            // let mainElHtml =  ``
            // mainElHtml += `<div class = "movies">`
            // for(let i = 0; i<data.Search.length; i++){
            //     mainElHtml+=`
            //         <div class = "movie">
            //             <h1>${data.Search[i].Title}<h1>
            //             <img src = ${data.Search[i].Poster}>

            //         </div>
            //     `
            // }
            // mainElHtml += `</div>`
            // mainEl.innerHTML = mainElHtml
        })
    
        // .then(html=>{
        //     if(html)
        //         render(html)
        // })  
}
function renderNotFound(){
    let mainElHtml
    mainElHtml=`
        <main >
            <div class="no-item">
                <i class="fa fa-film"></i>
                <p>RESULT NOT FOUND</p>
            </div>
        </main>
    `
    mainEl.innerHTML = mainElHtml
}


document.addEventListener("click",function(e){
    if(e.target.classList.contains("fa-plus")){
        e.target.classList.remove("fa-plus")
        e.target.classList.add("fa-minus")
        // console.log(e.target.dataset.iid)
        watchListData.push(e.target.dataset.iid)
        console.log(watchListData)
        localStorage.setItem("localWatchList", JSON.stringify(watchListData));
        e.target.textContent = "  Remove From Watchlist"

    }
    else if(e.target.classList.contains("fa-minus")){
        e.target.classList.remove("fa-minus")
        e.target.classList.add("fa-plus")
        watchListData=arrayRemove(watchListData, e.target.dataset.iid)
        console.log(watchListData)
        localStorage.setItem("localWatchList", JSON.stringify(watchListData));
        e.target.textContent = "  Add to Watchlist"
    }
})
async function renderMain(data){
    htmlText = ``;
    htmlText +=`
        <select name="pages" id="pages" class ="pages">
    `
    // console.log("data  req -> "+ data.totalResults)
    let maxpages = Math.min(10, (data.totalResults/10)+1)
    for(let i = 1; i<=maxpages; i++){
    let temp = ``
    if(i==localStorage.getItem("localPage"))temp="selected";
    htmlText+=`
        <option value=${i} ${temp}>${i} Page</option>
    `
    }
    htmlText += `</select>`
    console.log("find => "+data.Search.length)
    let finalEl = data.Search.length-1
    for(let i = 0; i<data.Search.length; i++){
        console.log("I -> "+i)
        const curr = data.Search[i]
        let currDetail
        await fetch(`http://www.omdbapi.com/?i=${curr.imdbID}&apikey=44b8e4dc`)
            .then(res=>res.json())
            .then(tempDetail=>{
                
                console.log(tempDetail)
                currDetail = tempDetail
                let watchListBtn = `
                    <span><i class="fa fa-plus" data-iid = ${curr.imdbID}> Add To WatchList</i></span>
                `
                if(watchListData.includes(curr.imdbID))
                watchListBtn = `
                    <span><i class="fa fa-minus" data-iid = ${curr.imdbID}> Remove from watchList</i></span>
                `
                htmlText+=`
                <div class="movies">
                    <div class="movie">
                        <div class = "poster">
                            <img src=${currDetail.Poster}>
                        </div>
                        <div class = "detail">
                            <h2>${currDetail.Title}⭐<span class ="rating">${currDetail.imdbRating}</span></h2> 
                            <div class = "tag">
                                <span>${currDetail.Runtime}</span>
                                <span>${currDetail.Genre}</span>
                            </div>
                            ${watchListBtn}                            
                            <p class = "plot">${currDetail.Plot}</p>
                        </div>
                    </div>
                </div>
                `
                // console.log(htmlText)
            })
            // .then(garbage =>{
            //     if (i==finalEl)
            //         render(htmlText)
            // })
    }
    render(htmlText)
}
function render(htmlText){
    // console.log("final text-> "+htmlText)
    mainEl.innerHTML = htmlText
}
function arrayRemove(arr, value) {
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}
// renderMain()
