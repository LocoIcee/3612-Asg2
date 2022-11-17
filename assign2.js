


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
            loadSongs(sList, 'currentList')
        });
    }
    else loadSongs(JSON.parse(songList), 'currentList');
    
    let artists = document.getElementById("artists");
        fetch('artists.json')
        .then((res) => res.json())
        .then((allArtists) => {
            allArtists.forEach(artist =>{
                let option = document.createElement('option');
                option.innerText = artist.name;
                artists.appendChild(option);
            })
        });
        
    let genres = document.getElementById("genres");
        fetch('genres.json')
        .then((res) => res.json())
        .then((allGenres) => {
            allGenres.forEach(genre =>{
                let option = document.createElement('option');
                option.innerText = genre.name;
                genres.appendChild(option);
            })
        });
        
    let playList = JSON.parse(localStorage.getItem('playList'));
    loadSongs(playList,'playList');
    
})

function loadSongs(songs, listKey){
    
    localStorage.setItem(listKey, JSON.stringify(songs));
    let table
    
    if (listKey === 'playList') {
        table = document.getElementById('playList');
    }
    else table = document.querySelector("table");
    
    table.innerHTML = '';
    let row = document.createElement('tr');
    let head = document.createElement('th');
    head.innerText = "Title";
    row.appendChild(head);
    let button = document.createElement('button');
    button.id = "b1";
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", `sort('title', '${listKey}')`);
    button.innerText = '\u25b3';
    head.appendChild(button);
    
    
    head = document.createElement('th');
    head.innerText = "Artist";
    row.appendChild(head);
    button = document.createElement('button');
    button.id = "b2";
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", `sort('artist', '${listKey}')`);
    button.innerText = '\u25b3';
    head.appendChild(button);
    
    head = document.createElement('th');
    head.innerText = "Year";
    row.appendChild(head);
    button = document.createElement('button');
    button.id = "b3";
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", `sort('year', '${listKey}')`);
    button.innerText = '\u25b3';
    head.appendChild(button);
    
    head = document.createElement('th');
    head.innerText = "Genre";
    row.appendChild(head);
    button = document.createElement('button');
    button.id = "b4";
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", `sort('genre', '${listKey}')`);
    button.innerText = '\u25b3';
    head.appendChild(button);
    
    head = document.createElement('th');
    head.innerText = "Popularity";
    row.appendChild(head);
    button = document.createElement('button');
    button.id = "b5";
    button.setAttribute("class", "sort");
    button.setAttribute("onclick", `sort('pop', '${listKey}')`);
    button.innerText = '\u25b3';
    head.appendChild(button);
    
    table.appendChild(row);
    let count = 0;
    if (songs !== null){
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
            
            let button = document.createElement('button');
            if (listKey === 'playList'){
                button.id = count++;
                button.innerText = '-';
                button.addEventListener('click', removeFromPlaylist);
            }
            else{
                button.innerText = '+';
                button.addEventListener('click', addToPlaylist);
            }
            row.appendChild(button);
            
            table.appendChild(row);
        })
        let cells = document.querySelectorAll('td')
        cells.forEach(c => c.addEventListener('click',songView))
    }
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
            loadSongs(results, 'currentList');
        }
    }
    
    else if (searchArtists.checked === true){
        let search = document.getElementById("artists");
        if(search.selectedIndex !== 0){
            let results = songs.filter(res => res.artist.name.includes(search.value));
            loadSongs(results, 'currentList');
        }
    }
    else if (searchGenres.checked === true){
        let search = document.getElementById("genres");
        if(search.selectedIndex !== 0){
            let results = songs.filter(res => res.genre.name.includes(search.value));
            loadSongs(results, 'currentList');
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
    
    loadSongs(JSON.parse(songList), 'currentList');
}

function sort(sortKey, listKey){
    let list = JSON.parse(localStorage.getItem(listKey));
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
    loadSongs(list, listKey);
    
    if (sortKey === 'title'){
        let button = document.getElementById('b1')
        button.innerText = '\u25bd'
        button = document.getElementById('b2')
        button.innerText = '\u25b3'
        button = document.getElementById('b3')
        button.innerText = '\u25b3'
        button = document.getElementById('b4')
        button.innerText = '\u25b3'
        button = document.getElementById('b5')
        button.innerText = '\u25b3'
    }
    else if (sortKey === 'artist'){
        let button = document.getElementById('b1')
        button.innerText = '\u25b3'
        button = document.getElementById('b2')
        button.innerText = '\u25bd'
        button = document.getElementById('b3')
        button.innerText = '\u25b3'
        button = document.getElementById('b4')
        button.innerText = '\u25b3'
        button = document.getElementById('b5')
        button.innerText = '\u25b3'
    }
    else if (sortKey === 'year'){
        let button = document.getElementById('b1')
        button.innerText = '\u25b3'
        button = document.getElementById('b2')
        button.innerText = '\u25b3'
        button = document.getElementById('b3')
        button.innerText = '\u25bd'
        button = document.getElementById('b4')
        button.innerText = '\u25b3'
        button = document.getElementById('b5')
        button.innerText = '\u25b3'
    }
    else if (sortKey === 'genre'){
        let button = document.getElementById('b1')
        button.innerText = '\u25b3'
        button = document.getElementById('b2')
        button.innerText = '\u25b3'
        button = document.getElementById('b3')
        button.innerText = '\u25b3'
        button = document.getElementById('b4')
        button.innerText = '\u25bd'
        button = document.getElementById('b5')
        button.innerText = '\u25b3'
    }
    else if (sortKey === 'pop'){
        let button = document.getElementById('b1')
        button.innerText = '\u25b3'
        button = document.getElementById('b2')
        button.innerText = '\u25b3'
        button = document.getElementById('b3')
        button.innerText = '\u25b3'
        button = document.getElementById('b4')
        button.innerText = '\u25b3'
        button = document.getElementById('b5')
        button.innerText = '\u25bd'
    }
}

const songView = (event) => {
    let list = JSON.parse(localStorage.getItem('currentList'));
    let song = list.find(s => {
        let path = event.composedPath();
        return s.song_id.toString() === path[1].id});
    
    let view = document.querySelector('#songView div');
    let h2 = document.createElement('h2');
    h2.innerText = "Song Info";
    view.appendChild(h2);
    
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
    
    view = document.getElementById("songView");
    view.classList.toggle("hidden");
    
    view = document.getElementById("browseView");
    view.classList.toggle("hidden");
    
    view = document.getElementById('close');
    view.classList.toggle("hidden");
    
    view = document.getElementById('playlist');
    view.classList.toggle("hidden");
    
    chart(song.analytics);
}

function chart(analytics){
    const ctx = document.getElementById('chart');
    new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Energy', 'Danceability', 'Liveness', 'Valence', 'Acousticness', 'Speechiness'],
          datasets: [{
            label: 'Analytics',
            data: [analytics.energy, analytics.danceability, analytics.liveness, analytics.valence, analytics.acousticness, analytics.speechiness],
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

function closeView(){
    let view = document.getElementById("browseView");
    view.classList.toggle("hidden");
    view = document.getElementById("songView");
    if (view.classList.value === ""){
        view.classList.add("hidden");
        clearSongView();
    }
    view = document.getElementById("playlistView");
    view.classList.add("hidden");
    view = document.getElementById('close');
    view.classList.toggle("hidden");
    view = document.getElementById('playlist');
    view.classList.toggle("hidden");
}
function playlistView(){
    
    let view = document.getElementById("browseView");
    view.classList.toggle("hidden");
    view = document.getElementById("playlistView");
    view.classList.toggle("hidden");
    view = document.getElementById('close');
    view.classList.toggle("hidden");
    view = document.getElementById('playlist');
    view.classList.toggle("hidden");
}

function clearSongView(){
    let chart = Chart.getChart('chart');
    chart.destroy();
    let view = document.getElementById("info");
    view.textContent = '';
}

const addToPlaylist = (event) => {
    let playList = localStorage.getItem('playList');
    let songList = JSON.parse(localStorage.getItem('currentList'));
    let song = songList.find(s => {
            let path = event.composedPath();
            return s.song_id.toString() === path[1].id
    });
    
    if(playList === 'null'){
            playList = [song];
    }
    else{
        playList = JSON.parse(localStorage.getItem('playList'));
        playList.push(song);
    }
    localStorage.setItem('playList', JSON.stringify(playList));
    loadSongs(playList, 'playList');
}

const removeFromPlaylist = (event) => {
    let playList = JSON.parse(localStorage.getItem('playList'));
    playList.splice(event.target.id, 1);
    localStorage.setItem('playList', JSON.stringify(playList));
    loadSongs(playList, 'playList');
   
}
