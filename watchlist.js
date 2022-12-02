const mainEl  = document.getElementById("main-el")

let htmlText = ``;
document.addEventListener("click",function(e){
    if(e.target.classList.contains("fa-plus")){
        e.target.classList.remove("fa-plus")
        e.target.classList.add("fa-minus")
        console.log(localStorage)
        e.target.textContent = "  Remove From Watchlist"
    }
    else if(e.target.classList.contains("fa-minus")){
        e.target.classList.remove("fa-minus")
        e.target.classList.add("fa-plus")
        e.target.textContent = "  Add to Watchlist"
    }
})
async function renderMain(data){
    htmlText = ``;
    
    // console.log("data  req -> "+ data.totalResults)
    let finalEl = data.length-1
    for(let i = 0; i<data.length; i++){
        const curr = data[i]
        await fetch(`http://www.omdbapi.com/?i=${curr}&apikey=44b8e4dc`)
            .then(res=>res.json())
            .then(tempDetail=>{
                
                currDetail = tempDetail
                let watchListBtn = `
                    <span><i class="fa fa-plus" data-iid = ${curr}>   Add To WatchList</i></span>
                `
                if(watchListData.includes(curr))
                watchListBtn = `
                    <span><i class="fa fa-minus" data-iid = ${curr}>   Remove from watchList</i></span>
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
renderMain()
function render(htmlText){
    // console.log("final text-> "+htmlText)
    mainEl.innerHTML = htmlText
}