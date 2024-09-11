const API_KEY=`b0359ebba28749d1a115ccc565bef4d1`
//const API_KEY=`pub_53149b62cd2c643ab834f9bceb73ef4077a59`

let newsList=[]
let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`) // 공통적으로 쓰일 url 기본 값은 head
let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5

const menus = document.querySelectorAll(".menus button")
const searchInput = document.getElementById("search-input")

menus.forEach(menu => menu.addEventListener("click", (event)=>newsCategory(event))) // 메뉴 클릭 이벤트

searchInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
        newsKeyword()
    }
})

const getNewsData = async() =>{
    try{
        const response =  await fetch(url)
        const data = await response.json()
        if(response.status === 200){
            newsList = data.articles.filter(news => news.url && news.urlToImage);
            totalResults = data.totalResults
            render()
            pageRender()
        } else {
            throw new Error(data.message)
        }
    } catch(error){
        errorRender()
    }  
}

const getNews = async () => {
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    getNewsData()
}

const newsCategory = async (event) => {
    const category = event.target.textContent
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`)
    getNewsData()
}

const newsKeyword = async () => {
    const keyword = document.getElementById("search-input").value
    url =  new URL(`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`)
    getNewsData()
}

const render = () => {
    // 검색 결과가 없는 경우
    if (newsList.length === 0) {
        document.getElementById("news-board").innerHTML = `
            <div class="no-news-list">
                <div>관련 기사가 없습니다.</div>
            </div>
        `;
        return;
    }
    const newsHTML = newsList.map(news => {

        const title = news.title.includes(' - ') 
            ? news.title.split(' - ')[0].trim() 
            : news.title;

        const description = news.description
        ? (news.description.length > 200
            ? news.description.substring(0, 200) + '...'
            : news.description)
        : "no description.";

        return`
        <div class="row news-list">
            <div class="col-lg-4">
                <img class="news-img" src=${news.urlToImage} />
            </div>
            <div class="col-lg-8">
                <h2>${title}</h2>
                <p>${description}</p>
                <div>${news.source.name} * ${new Date(news.publishedAt).toLocaleDateString()}</div>
            </div>
        </div>`}).join('');

    document.getElementById("news-board").innerHTML = newsHTML
}

const errorRender = () => {
    document.getElementById("news-board").innerHTML = `
        <div class="no-news-list">
            <div>에러가 발생했습니다. 잠시 후에 다시 시도해주세요</div>
        </div>
    `;
}

const pageRender = () => {
    const pageGroup = Math.ceil(page/groupSize)
    const lastPage = pageGroup * groupSize
    const firstPage = lastPage - (groupSize - 1)

    let paginationHTML = ``

    for(let i=firstPage; i<=lastPage; i++){
        paginationHTML+= `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
    }
    document.querySelector(".pagination").innerHTML = paginationHTML
}

getNews()
