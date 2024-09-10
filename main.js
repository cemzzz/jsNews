const API_KEY=`b0359ebba28749d1a115ccc565bef4d1`

let newsList=[]
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event)=>newsCategory(event)))

const getNews = async () => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    const response =  await fetch(url)
    const data = await response.json()
    newsList = data.articles.filter(news => news.url && news.urlToImage);
    render()
}

const newsCategory = async (event) => {
    const category = event.target.textContent
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`)
    const response =  await fetch(url)
    const data = await response.json()
    newsList = data.articles.filter(news => news.url && news.urlToImage);
    render()
}

const render = () => {
    const newsHTML = newsList.map(news => {
    
        const title = news.title.includes(' - ') 
            ? news.title.split(' - ')[0].trim() 
            : news.title;

        const description = news.description
            ? (news.description.lenght > 200
                ? news.description.substring(0, 200) + '...'
                : news.description)
            : "No description"

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

getNews()
