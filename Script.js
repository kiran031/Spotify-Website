console.log("Java Script starts")

let currentSong = new Audio()
async function getSongs() {
    let response = await fetch("song.json");
    let data = await response.json();
    return data;
}

//call playmusic and play song 
function playMusic(track, pause = false) {
    // let audio = new Audio(`/Songs1/${track}`)
    // audio.play();
    currentSong.src = `/Songs1/${track}`
    if (!pause) {
        currentSong.play();
        play.src = `./images/pause.svg`
    }
    //song title and timing
    document.querySelector(".songName").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00/00:00"

}

//function to convert the seconds to song time format
function formatTime(seconds) {
    if(isNaN(seconds)||seconds<0){
        return "00:00"
    }
    seconds = Math.floor(seconds);  // ⬅️ Fix: Ensure whole seconds

    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    // Ensure two digits for seconds (e.g., 3:05 instead of 3:5)
    secs = secs < 10 ? '0' + secs : secs;

    return `${mins}:${secs}`;
}




let songList = []

//main function to work all java script
async function main() {
    let songs = await getSongs();
    for (const song of songs) {
        songList.push(song.url.split("/")[1])
    }

    //add list to the html dom
    for (const list of songList) {
        //  console.log(songList);
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

        playMusic(songList[0], true)
    }


    //add Event Listner on every Song to play
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        console.log(e.querySelector(".songInfo").getElementsByTagName("span")[0].innerHTML);
        e.addEventListener('click', () => {
            playMusic(e.querySelector(".songInfo").getElementsByTagName("span")[0].innerHTML);
        });
    })

    //play and pause the songs 
    play.addEventListener('click', () => {
        console.log("clicked");

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
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;

        //moveing the circle according to song time
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //click and move the circle according to you
    document.querySelector(".playRoll").addEventListener('click', (e) => {
        let percentage = e.offsetX / e.target.getBoundingClientRect()
            .width * 100;
        console.log(percentage+ "%");
        document.querySelector(".circle").style.left = percentage+ "%";
        currentSong.currentTime = ((currentSong.duration)*percentage)/100;
    })
}

//apply hamberg to get home
document.querySelector(".hamberg").addEventListener('click',(e)=>{
    document.querySelector(".left").style.left=0;
})

//apply closer to remove hamberg
document.querySelector(".closer").addEventListener('click',(e)=>{
    document.querySelector(".left").style.left= -131 +"%";
})


//addEventListner to previous
let indexVal = 0
document.querySelector("#previous").addEventListener('click',()=>{
    console.log("previous clicked");
    let index = songList.indexOf(songList[indexVal]) 
    if((index-1)>=0){
        playMusic(songList[index-1])
        indexVal = index-1;
    }
    
})


//addEventListner to next
document.querySelector("#next").addEventListener('click',()=>{
    console.log("next clicked")
    let index = songList.indexOf(songList[indexVal]) 
    if((index+1)<songList.length){
        playMusic(songList[index+1])
        indexVal = index+1;
    }
})

//handle volume by addEventListner
document.querySelector(".songVal").getElementsByTagName("input")[0].addEventListener('click',(e)=>{
   currentSong.volume = e.target.value/100;
   
})

main();