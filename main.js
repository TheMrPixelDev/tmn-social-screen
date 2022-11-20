import './style.css'
import 'animate.css'
import pillarUrl from './images/pillar.png'
import pillarTopUrl from './images/pillar_top.png'
import pillarBottomUrl from './images/pillar_bottom.png'
import plantUrl from './images/pflanze.svg'
import wavesUrl from './images/animated-waves.svg'

const apiUrl = "https://tmn.pxldeveloper.eu"
//const apiUrl = "http://localhost:8000"
const app = document.querySelector('#app')
var currentlyRendered = []

/**
 * Render non dynamical dom elemennts (plant, bubbles, pillar)
 */
 const wrapper = document.createElement("div")
 wrapper.classList = "wrapper";
for(var i = 0; i < 20; i++) {
    const bubbleContainer = document.createElement("div");
    const bubble = document.createElement("span");
    bubble.classList = "dot";
    const x = Math.round(Math.random() * 10) * 10;
    const y = Math.round(Math.random() * 10) * 10;
    const animationLength = Math.round(Math.random() * 10) + 3;
    //const radius = Math.round(Math.random() * 3);
    bubbleContainer.style.top = y + "%";
    bubbleContainer.style.left = x + "%";
    bubbleContainer.style.animation = `bubbleAnimation ${animationLength}s linear infinite`;
    //bubble.style.width = radius + "rem";
    //bubble.style.height = radius + "rem";
    //bubble.classList.add("bubble");
    bubbleContainer.appendChild(bubble);
    wrapper.appendChild(bubbleContainer);
}
app.appendChild(wrapper);

const plant = document.createElement("img");
const plant2 = document.createElement("img")
plant.classList = "plant";
plant2.classList = "plant";
plant.style.animation = "plantAnimation 20s linear infinite"
plant2.style.animation = "plantAnimation 15s linear infinite"
plant2.src = plantUrl;
plant.src = plantUrl;
plant.style.height = "25rem";
plant.style.position = "absolute";
plant.style.bottom = "-15px";

plant2.style.height = "20rem";
plant2.style.position = "absolute";
plant2.style.bottom = "-15px";
plant2.style.right = "-1rem";
plant2.style.transform = "scaleX(-1)";
plant2.style.zIndex = "1000";
app.appendChild(plant);
app.appendChild(plant2);

const waves = document.createElement("img");
waves.src = wavesUrl;
waves.style.position = "absolute";
//app.appendChild(waves);

const pillarTop = document.createElement("img");
const pillarBottom = document.createElement("img");
const pillar = document.createElement("img");
pillarTop.src = pillarTopUrl;
pillarBottom.src = pillarBottomUrl;
pillar.src = pillarUrl;
/** Position pillar absolute */
pillarTop.style.position = "absolute";
pillarBottom.style.position = "absolute";
pillar.style.position = "absolute";
/** Position right*/
pillarTop.style.right = "-5px";
pillarBottom.style.right = "-5px";
pillar.style.right = "-5px";
/** Position bottom */
pillarTop.style.top = "-8px";
pillarBottom.style.bottom = "0rem";
pillar.style.bottom = "1rem";
/** Dimensions */
pillarTop.style.height = "5.5rem";
pillarBottom.style.height = "4rem";
pillar.style.height = "100%";
pillar.style.width = "7rem";
/** Append to main element */
app.appendChild(pillar);
app.appendChild(pillarBottom);
app.appendChild(pillarTop);

async function fetchNewPicturesAndRerender() {

    /**
     * Fetching new pictures from the backend
     */
    const res = await fetch(apiUrl + "/pics");

    const json = await res.json();

    var picsToRender = json.filter((element) => {

        const isIncluded = currentlyRendered.some((other) => {
            //return other.url === element.url;
            return other.post_id === element.post_id;
        })

        return !isIncluded;
    })
    currentlyRendered = json;

    picsToRender = picsToRender.sort((a, b) => {
        return parseInt(a.datetime) >= parseInt(b.datetime)
    })

    /**
     * Slice Array to render only the last 10 pics
     */
    if(picsToRender.length > 30) {
        picsToRender = picsToRender.slice(picsToRender.length - 10);
    }

    /**
     * Loop through array and render every picture
     */
    picsToRender.forEach(pic => {
        const domPic = document.createElement("img");
        const borderBox = document.createElement("div");
        const subtitle = document.createElement("p");
        const author = document.createElement("cite");
        domPic.src = apiUrl + pic.file;
        var angle = Math.round(Math.random() * 50 - 25);
        var y_pos = 10 + Math.round(Math.random() * 20 - 10);
        var x_pox = 40 + Math.round(Math.random() * 50 - 25);
        domPic.classList = "picture";

        if(pic.platform === "telegram") {
            author.innerHTML = "📸 TMN Team";
            subtitle.innerText = pic.caption;
        }else{
            subtitle.innerText = pic.caption;
            author.innerHTML = "@" + pic.username
            subtitle.innerText = "#tussimeetsnerd";
        }
        borderBox.classList = `borderbox animate__animated animate__rollIn`;
        borderBox.style.setProperty("--animate-duration", "3s")
        borderBox.style.transform = `rotate(${angle}deg)`;
        borderBox.style.top = `${y_pos}%`;
        borderBox.style.left = `${x_pox}%`
        subtitle.classList = "subtitle";
        
        borderBox.appendChild(domPic);
        borderBox.appendChild(subtitle);
        borderBox.appendChild(author);
        app.appendChild(borderBox);
    })

    

    /**
     * Scroll to the bottom after pictures have been rendered
     */
    /*if(picsToRender.length != 0) {
        window.scroll({
            top: document.body.scrollHeight + 500,
            left: 0,
            behavior: 'smooth'
        })

        console.log("Scrolling down")
    }*/

    /**
     * Overriding currentlyRendered array to track current render status
     */
    currentlyRendered = json;

}

fetchNewPicturesAndRerender()

setInterval(() => {
    fetchNewPicturesAndRerender()
}, 10000)