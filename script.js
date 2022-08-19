window.addEventListener("DOMContentLoaded", gameLoaded)

//Variables for the game
let points;
let life;

//Arrays for looping
const left = ["pos0", "pos1", "pos2", "pos3", "pos4", "pos5", "pos6", "pos7", "pos8"];
const lives = ["#life1", "#life2", "#life3"];
const music = ["#music", "#button", "#shot"]

//Booleans for toggling
let fullscreen = false;
let sound = false;

//Squad selection
let squadSelect;
let newSkin;

function gameLoaded() {
    console.log("gameLoaded");
    //Add button functions
    document.querySelector("#button-home").addEventListener("click", returnHome);
    document.querySelector("#button-restart").addEventListener("click", startGame);
    document.querySelector("#button-fullscreen").addEventListener("click", toggleFullscreen);
    document.querySelector("#button-sound").addEventListener("click", toggleSound);
    document.querySelector("#banner-start").addEventListener("click", startGame);
    document.querySelector("#banner-squads").addEventListener("click", changeSquads);

    //Mute sound
    music.forEach(sound => {
        document.querySelector(sound).volume = 0;
    })

    //Add button sound effect to all buttons
    document.querySelectorAll(".button").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector("#button").play();
        })
    })
    document.querySelectorAll(".banner").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector("#button").play();
        })
    })
    document.querySelectorAll(".squad-skin").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector("#button").play();
        })
    })
}

function returnHome() {
    console.log("returnHome");

    //Change screens
    document.querySelector("#shadow").classList.add("hidden");
    document.querySelector("#screen-game").classList.add("hidden");
    document.querySelector("#screen-end").classList.add("hidden");
    document.querySelector("#screen-start").classList.remove("hidden");
}

function toggleFullscreen() {
    console.log("toggleFullscreen");

    //Toggle boolean for fullscreen
    fullscreen = !fullscreen;

    if (fullscreen == true) {
        //Change icon
        document.querySelector("#button-fullscreen").src = 'svgs/buttons/fullscreen-off.svg';

        //Enter fullscreen
        let screen = document.querySelector("#screen").requestFullscreen();

    } else if (fullscreen == false) {
        //Change icon
        document.querySelector("#button-fullscreen").src = 'svgs/buttons/fullscreen-on.svg';

        //Exit fullscreen
        document.exitFullscreen();
    }
}

function toggleSound() {
    console.log("toggleSound");

    //Toggle boolean for sound
    sound = !sound;

    if (sound == true) {
        //Change icon
        document.querySelector("#button-sound").src = 'svgs/buttons/sound-off.svg';

        //Set all sound volumes to 1
        music.forEach(sound => {
            document.querySelector(sound).volume = 1;
        })

        //Play background
        document.querySelector("#music").play();
        document.querySelector("#music").loop = true;
    } else if (sound == false) {
        //Change icon
        document.querySelector("#button-sound").src = 'svgs/buttons/sound-on.svg';

        //Set all sound volumes to 0
        music.forEach(sound => {
            document.querySelector(sound).volume = 0;
        })
    }
}

function changeSquads() {
    console.log("changeSquads");
    document.querySelector("#squad-layout").classList.remove("hidden");
    document.querySelector("#shadow").classList.remove("hidden");
    document.querySelector("#shadow").style.cursor = "pointer";
    document.querySelector("#shadow").addEventListener("click", hideSquads);

    document.querySelectorAll("#squad-selection .squad-skin").forEach(squadskin => {
        squadskin.addEventListener("click", showSelector);
    })
}

function hideSquads() {
    console.log("hideSquads");
    document.querySelector("#squad-layout").classList.add("hidden");

    document.querySelector("#squad-selector").classList.add("hidden");
    document.querySelector("#squad-selection").style.display = "";

    document.querySelector("#shadow").classList.add("hidden");
    document.querySelector("#shadow").style.cursor = "auto";
    document.querySelector("#shadow").removeEventListener("click", hideSquads);
}

function showSelector() {
    console.log("showSelector");

    squadSelect = this.firstElementChild.id;

    document.querySelector("#squad-selector").classList.remove("hidden");
    document.querySelector("#squad-selection").style.display = "none";

    document.querySelectorAll("#squad-selector .squad-skin").forEach(squadskin => {
        squadskin.addEventListener("click", changeSkin);
    })
}

function changeSkin() {
    console.log("changeSkin");

    newSkin = this.firstElementChild.id;

    document.querySelector(`#${squadSelect}`).src = `svgs/skins/${newSkin}.svg`;
    document.querySelector(`#sprite-${squadSelect}`).src = `svgs/skins/${newSkin}.svg`;

    document.querySelector("#squad-selector").classList.add("hidden");
    document.querySelector("#squad-selection").style.display = "";
}

function startGame() {
    console.log("startGame");

    //Change screens
    document.querySelector("#shadow").classList.add("hidden");
    document.querySelector("#screen-start").classList.add("hidden");
    document.querySelector("#screen-end").classList.add("hidden");
    document.querySelector("#screen-game").classList.remove("hidden");

    //Reset variables
    points = 0;
    life = 3;

    lives.forEach(life => {
        document.querySelector(life).classList = "life";
    })
    document.querySelector("#score-board-tally").textContent = points;

    //Start falling animations
    document.querySelectorAll(".container").forEach(container => {
        container.classList = `container fall pos${Math.floor(Math.random() * 18)} delay${Math.floor(Math.random() * 4)}`;

        container.addEventListener("mousedown", elementClicked);
        container.addEventListener("animationend", elementFallen)
    })
}

function elementClicked() {
    console.log("elementClicked")

    //Play gunshot sound
    document.querySelector("#shot").currentTime = 0;
    document.querySelector("#shot").play();

    //Remove EventListener
    this.removeEventListener("mousedown", elementClicked);

    //Start clicked-animations
    this.classList.add("pause");
    if (left.some(left => this.classList.contains(left))) {
        this.firstElementChild.classList.add("hit-left")
    } else {
        this.firstElementChild.classList.add("hit-right")
    }

    if (this.parentElement.classList.contains("enemies")) {
        //Add points
        points++;
        document.querySelector("#score-board-tally").textContent = points;
    } else {
        //Remove life
        life--;
        if (document.querySelector("#life2").classList.contains("life-lost")) {
            document.querySelector("#life3").classList.add("life-lost");
        } else if (document.querySelector("#life1").classList.contains("life-lost")) {
            document.querySelector("#life2").classList.add("life-lost");
        } else {
            document.querySelector("#life1").classList.add("life-lost");
        }

        //Check life
        if (life < 0) {
            endGame();
        }
    }

    this.firstElementChild.addEventListener("animationend", elementRestart);
}

function elementRestart(elementEvent) {
    console.log("elementRestart");

    //Stop propagation
    elementEvent.stopPropagation();

    //Reset sprite
    this.parentElement.addEventListener("mousedown", elementClicked);
    this.classList = ("sprite");

    //Restart element
    this.parentElement.classList = `container pos${Math.floor(Math.random()* 18)} delay${Math.floor(Math.random() * 4)}`
    this.parentElement.offsetHeight;
    this.parentElement.classList.add("fall");
}

function elementFallen() {
    console.log("elementFallen");

    //Restart element
    this.classList = `container pos${Math.floor(Math.random()* 18)} delay${Math.floor(Math.random() * 4)}`
    this.offsetHeight;
    this.classList.add("fall");

    if (this.parentElement.classList.contains("enemies")) {
        //Remove life
        life--;
        if (document.querySelector("#life2").classList.contains("life-lost")) {
            document.querySelector("#life3").classList.add("life-lost");
        } else if (document.querySelector("#life1").classList.contains("life-lost")) {
            document.querySelector("#life2").classList.add("life-lost");
        } else {
            document.querySelector("#life1").classList.add("life-lost");
        }

        //Check life
        if (life < 0) {
            endGame();
        }
    }
}

function endGame() {
    console.log("endGame");

    //Change screens
    document.querySelector("#screen-end").classList.remove("hidden");
    document.querySelector("#shadow").classList.remove("hidden");

    //Reset containers
    document.querySelectorAll(".container").forEach(container => {
        console.log("containerReset");
        container.classList = " container hidden";
        container.removeEventListener("mousedown", elementClicked);
        container.removeEventListener("animationend", elementFallen);
    })

    //Reset sprites
    document.querySelectorAll(".sprite").forEach(sprite => {
        console.log("spriteReset");
        sprite.classList = "sprite";
    })


    if (points > 99) {
        document.querySelector("#screen-end-text").textContent = `Okay, dude, chill, ${points}???? You broke the lobby's cap...`
        document.querySelector("#screen-end-text").style.textAlign = "left";
    } else if (points > 50) {
        document.querySelector("#screen-end-text").innerHTML = `With that amount of points it'll never come home.<br>${points} points, really???`;
        document.querySelector("#screen-end-text").style.textAlign = "left";
    } else if (points > 25) {
        document.querySelector("#screen-end-text").textContent = `You might have gotten ${points} points but are you using code RPGR...?`
        document.querySelector("#screen-end-text").style.textAlign = "left";
    } else if (points > 10) {
        document.querySelector("#screen-end-text").textContent = `${points} points is nice and all but have you liked the stream?`
        document.querySelector("#screen-end-text").style.textAlign = "left";
    } else {
        document.querySelector("#screen-end-text").textContent = `${points} points???? bruhhhhhh 😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂`
        document.querySelector("#screen-end-text").style.textAlign = "center";
    }
}
