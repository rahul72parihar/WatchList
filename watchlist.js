const mainEl  = document.getElementById("main-el")
let htmlText = ``;
window.addEventListener("message",function(e){
    if(e.origin!=="index.html")return
    const data = JSON.parse(e.data)
    if(typeof data!="undefined"){
        this.localStorage.setItem("array",data)
        console.log(data)
    }

})


document.addEventListener("click",function(e){
    let watchListDatasec = JSON.parse(localStorage.localWatchList)
    if(e.target.classList.contains("fa-plus")){
        e.target.classList.remove("fa-plus")
        e.target.classList.add("fa-minus")
        // console.log(e.target.dataset.iid)
        watchListDatasec.push(e.target.dataset.iid)
        console.log(watchListDatasec)
        localStorage.setItem("localWatchList", JSON.stringify(watchListDatasec));
        e.target.textContent = "  Remove From Watchlist"

    }
    else if(e.target.classList.contains("fa-minus")){
        e.target.classList.remove("fa-minus")
        e.target.classList.add("fa-plus")
        watchListDatasec=arrayRemove(watchListDatasec, e.target.dataset.iid)
        console.log(watchListDatasec)
        localStorage.setItem("localWatchList", JSON.stringify(watchListDatasec));
        e.target.textContent = "  Add to Watchlist"
    }
})
function arrayRemove(arr, value) {
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

console.log(localStorage.localWatchList)
renderMain(JSON.parse(localStorage.localWatchList))
async function renderMain(data){
    htmlText = ``;
    console.log(data[0])
    let finalEl = data.length-1
    for(let i = 0; i<=finalEl; i++){
        console.log("I -> "+i)
        const curr = data[i]
        let currDetail
        await fetch(`https://www.omdbapi.com/?i=${curr}&apikey=44b8e4dc`)
            .then(res=>res.json())
            .then(tempDetail=>{
                
                console.log(tempDetail)
                currDetail = tempDetail
                let watchListBtn = `
                    <span><i class="fa fa-plus" data-iid = ${curr}> Add To WatchList</i></span>
                `
                if(data.includes(curr))
                watchListBtn = `
                    <span><i class="fa fa-minus" data-iid = ${curr}> Remove from watchList</i></span>
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
    mainEl.innerHTML = htmlText
}