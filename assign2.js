


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
document.addEventListener('DOMContentLoaded',function (){
    
    let songList = localStorage.getItem('songList');
    if (!songList){
        fetch(api)
        .then(res => res.json())
        .then(sList => {
            localStorage.setItem('songList', JSON.stringify(sList));
            loadSongs(sList)
        });
    }
    else loadSongs(JSON.parse(songList));
    
    let artists = document.getElementById("artists")
    allArtists.forEach(artist =>{
        let option = document.createElement('option');
        option.innerText = artist.name;
        artists.appendChild(option);
    })
    
    let genres = document.getElementById("genres")
    allGenres.forEach(genre =>{
        let option = document.createElement('option');
        option.innerText = genre.name;
        genres.appendChild(option);
    })
    
})

function loadSongs(songs){
    
    localStorage.setItem('currentList', JSON.stringify(songs));
    
    let table = document.querySelector("table");
    table.innerHTML = '';
    let row = document.createElement('tr');
    let head = document.createElement('th');
    head.innerText = "Title";
    row.appendChild(head);
    let button = document.createElement('button')
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", "sort('title')");
    head.appendChild(button);
    
    
    head = document.createElement('th');
    head.innerText = "Artist";
    row.appendChild(head);
    button = document.createElement('button')
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", "sort('artist')");
    head.appendChild(button);
    
    head = document.createElement('th');
    head.innerText = "Year";
    row.appendChild(head);
    button = document.createElement('button')
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", "sort('year')");
    head.appendChild(button);
    
    head = document.createElement('th');
    head.innerText = "Genre";
    row.appendChild(head);
    button = document.createElement('button')
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", "sort('genre')");
    head.appendChild(button);
    
    head = document.createElement('th');
    head.innerText = "Popularity";
    row.appendChild(head);
    button = document.createElement('button')
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", "sort('pop')");
    head.appendChild(button);
    
    table.appendChild(row);
    
    songs.forEach(song => {
        let title = document.createElement('td');
        row = document.createElement('tr');
        row.id = song.song_id;
        title.innerText = song.title;
        row.appendChild(title);
        
        let artist = document.createElement('td');
        artist.innerText = song.artist.name;
        row.appendChild(artist);
        
        let year = document.createElement('td');
        year.innerText = song.year;
        row.appendChild(year);
        
        let genre = document.createElement('td');
        genre.innerText = song.genre.name;
        row.appendChild(genre)
        
        let popularity = document.createElement('td');
        popularity.innerText = song.details.popularity;
        row.appendChild(popularity);
        table.appendChild(row);
    })
    let rows = document.querySelectorAll('tr')
    rows.forEach(r => r.addEventListener('click',songView))
}

function searchResults(){
    let songList = localStorage.getItem('songList');
    let songs = JSON.parse(songList);
    
    let searchTitle = document.getElementById("sTitle");
    let searchArtists = document.getElementById("sArtists");
    let searchGenres = document.getElementById("sGenres");
    if(searchTitle.checked === true){
        let search = document.getElementById("title");
        if(search.value !== ''){
            let results = songs.filter(res => {
                let title = res.title.toString();
                return title.toLowerCase().includes(search.value.toLowerCase());
            });
            loadSongs(results);
        }
    }
    
    else if (searchArtists.checked === true){
        let search = document.getElementById("artists");
        if(search.selectedIndex !== 0){
            let results = songs.filter(res => res.artist.name.includes(search.value));
            loadSongs(results);
        }
    }
    else if (searchGenres.checked === true){
        let search = document.getElementById("genres");
        if(search.selectedIndex !== 0){
            let results = songs.filter(res => res.genre.name.includes(search.value));
            loadSongs(results);
        }
    }
    
}

function clearSearch(){
    let songList = localStorage.getItem('songList');
    
    document.getElementById("sTitle").checked = false;
    document.getElementById("sArtists").checked = false;
    document.getElementById("sGenres").checked = false;
    document.getElementById("title").value = '';
    document.getElementById("artists").selectedIndex = 0;
    document.getElementById("genres").selectedIndex = 0;
    
    loadSongs(JSON.parse(songList));
}

function sort(sortKey){
    let list = JSON.parse(localStorage.getItem('currentList'));
    if (sortKey === 'title'){
        list.sort((a,b) => a.title.toString().localeCompare(b.title));
    }
    else if (sortKey === 'artist'){
        list.sort((a,b) => a.artist.name.localeCompare(b.artist.name));
    }
    else if (sortKey === 'genre'){
        list.sort((a,b) => a.genre.name.localeCompare(b.genre.name));
    }
    else if (sortKey === 'year'){
        list.sort((a,b) => a.year - b.year);
    }
    else if (sortKey === 'pop'){
        list.sort((a,b) => a.details.popularity - b.details.popularity);
    }
    loadSongs(list);
}
const songView = (event) => {
    let list = JSON.parse(localStorage.getItem('currentList'));
    let song = list.find(s => {
        let path = event.composedPath();
        return s.song_id.toString() === path[1].id});
    
    let view = document.querySelector('#songView div');
    let p = document.createElement('p');
    p.innerText = song.title;
    view.appendChild(p);
    
    p = document.createElement('p');
    p.innerText = "By " + song.artist.name;
    view.appendChild(p);
    
    p = document.createElement('p');
    p.innerText = song.genre.name + ' ' + song.year;
    view.appendChild(p);
    
    p = document.createElement('p');
    p.innerText = "Analysis Data:";
    view.appendChild(p);
    
    let ul = document.createElement('ul');
    let li = document.createElement('li');
    li.innerText = "Energy: " + song.analytics.energy;
    ul.appendChild(li);
    
    li = document.createElement('li');
    li.innerText = "Danceability: " + song.analytics.danceability;
    ul.appendChild(li);
    
    li = document.createElement('li');
    li.innerText = "Liveness: " + song.analytics.liveness;
    ul.appendChild(li);
    
    li = document.createElement('li');
    li.innerText = "Valence: " + song.analytics.valence;
    ul.appendChild(li);
    
    li = document.createElement('li');
    li.innerText = "Acousticness: " + song.analytics.acousticness;
    ul.appendChild(li);
    
    li = document.createElement('li');
    li.innerText = "Speechiness: " + song.analytics.speechiness;
    ul.appendChild(li);
    
    view.appendChild(ul);
    //chart();
}
/*
function chart(){
    const ctx = document.getElementById('chart');
    new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}
