console.log("Java Script starts")

let currentSong = new Audio()
let currFolder;
let songList = []


//function to convert the seconds to song time format
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    seconds = Math.floor(seconds);  // ⬅️ Fix: Ensure whole seconds

    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    // Ensure two digits for seconds (e.g., 3:05 instead of 3:5)
    secs = secs < 10 ? '0' + secs : secs;

    return `${mins}:${secs}`;
}

//Fetch the songs from the perticular folder
async function getSongs(folder) {
    songList = []
    currFolder = folder
    let response = await fetch(`/${folder}/`);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName('a');
    for (let i = 0; i < as.length; i++) {
        let element = as[i]
        if (element.href.endsWith(".mp3")) {
           let song = decodeURIComponent(element.href.split("/").at(-1))
            songList.push(song);
        }
    }

    //Add songs to playlist
    for (const list of songList) {
        let PlayList = document.querySelector(".songList").getElementsByTagName("ul")[0];
        PlayList.innerHTML = PlayList.innerHTML + `<li>
          <img class="filter" src="./Images/music.svg" alt="">
                        <div class="songInfo">
                            <span>${list}</span>
                            <span>kiran</span>
                        </div>
                        <div class="playSong">
                            <span>playNow</span> 
                            <img class="filter" src="./Images/playButton.svg" alt="">
                        </div>
        </li>`

    }


    //add Event Listner on every Song to play
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener('click', () => {
            playMusic(e.querySelector(".songInfo").getElementsByTagName("span")[0].innerHTML);
        });
    })

    return songList
}


//call playmusic and play song 
function playMusic(track, pause = false) {
    currentSong.src = `/${currFolder}/`+track;
    if (!pause) {
        currentSong.play();
        play.src = `./images/pause.svg`
    }
    //song title and timing
    document.querySelector(".songName").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00/00:00"

}


//make albumb
async function displayAlbumb() {
    let a = await fetch("Songs");
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.querySelectorAll("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]

            // Get the metadata of the folder
            let a = await fetch(`/Songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML +
                `<div class="card rounded" data-folder="${folder}">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="green" />
                                <path d="M10 9.25l5 2.75-5 2.75V9.25Z" fill="black" />
                            </svg>
                        </div>
                        <img src="./Songs/${folder}/cover.jpg" alt="cardImage"/>
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                    </div>`

        }
    }

    //Load the all playlist whenever card load
    document.querySelectorAll(".card").forEach((item) => {    

        item.addEventListener('click', async () => {

            let PlayList = document.querySelector(".songList ul");
            PlayList.innerHTML = "";

          songList = await getSongs(`Songs/${item.dataset.folder}`)  
            playMusic(songList[0])


        })
    })

}


async function main() {

    await getSongs("Songs/Uplifting_(mood)")
    playMusic(songList[0], true)
    await displayAlbumb();

    //play and pause the songs 
    const play = document.getElementById("play")
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "./images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "./images/playButton.svg";
        }
    })


    //Get time for song 
    currentSong.addEventListener('timeupdate', (e) => {
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;

        //moveing the circle according to song time
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        //automatic next song
        let songNumber = songList.findIndex(song=>currentSong.src.endsWith(song));
        if(currentSong.ended && songNumber<songList.length-1){
          currentSong.src = `/${currFolder}/`+songList[songNumber+1];
          currentSong.play();
        }
    })

    //click and move the circle according to you
    document.querySelector(".playRoll").addEventListener('click', (e) => {
        let percentage = e.offsetX / e.target.getBoundingClientRect()
            .width * 100;
        document.querySelector(".circle").style.left = percentage + "%";
        currentSong.currentTime = ((currentSong.duration) * percentage) / 100;
    })
}

//apply hamberg to get home
document.querySelector(".hamberg").addEventListener('click', (e) => {
    document.querySelector(".left").style.left = 0;
})

//apply closer to remove hamberg
document.querySelector(".closer").addEventListener('click', (e) => {
    document.querySelector(".left").style.left = -131 + "%";
})


//addEventListner to previous
let indexVal = 0
document.querySelector("#previous").addEventListener('click', () => {
    console.log("previous clicked");
    let index = songList.indexOf(songList[indexVal])
    if ((index - 1) >= 0) {
        playMusic(songList[index - 1])
        indexVal = index - 1;
    }

})

//addEventListner to next
document.querySelector("#next").addEventListener('click', () => {
    console.log("next clicked")
    let index = songList.indexOf(songList[indexVal])
    if ((index + 1) < songList.length) {
        playMusic(songList[index + 1])
        indexVal = index + 1;
    }
})

//handle volume by addEventListner
document.querySelector(".songVal").getElementsByTagName("input")[0].addEventListener('click', (e) => {
    currentSong.volume = e.target.value / 100;

})
//handle the unmute button
let val = document.querySelector(".volume").getElementsByTagName("img")[0];
console.log(val);
val.addEventListener('click',(e)=>{
    console.log(e.target.src);
     if(e.target.src === "http://127.0.0.1:3000/Images/volume.svg"){
        e.target.src = "http://127.0.0.1:3000/Images/mute.svg";
        currentSong.volume = 0;
        document.querySelector(".volume input").value = 0;
     }else{
        e.target.src = "http://127.0.0.1:3000/Images/volume.svg"
        currentSong.volume = 0.1;
        document.querySelector(".volume input").value = 10;

     }
})


// //controll current songs and next song
// let songIndex = 0;
// function updateBar(){
// let bandWidth =  document.querySelector(".playRoll");
// let complete =  bandWidth.getElementsByClassName("circle")[0].style.left;
// let momentPercentage = (currentSong.currentTime/currentSong.dureationlog)*bandWidth.clientWidth;
// console.log(momentPercentage);
// console.log(complete);

// }

main();