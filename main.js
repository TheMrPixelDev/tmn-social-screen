import './style.css'
import 'animate.css'

const app = document.querySelector('#app')
var currentlyRendered = []

/**
 * Render non dynamical dom elemennts (plant, bubbles, pillar)
 */

for(var i = 0; i < 60; i++) {
    const bubble = document.createElement("div");
    const x = Math.round(Math.random() * 10) * 10;
    const y = Math.round(Math.random() * 10) * 10;
    const radius = Math.round(Math.random() * 3);
    bubble.style.top = y + "%";
    bubble.style.left = x + "%";
    bubble.style.width = radius + "rem";
    bubble.style.height = radius + "rem";
    bubble.classList.add("bubble");
    app.appendChild(bubble);
}

const plant = document.createElement("img");
plant.src = "/assets/images/pflanze.svg";
plant.style.height = "20rem";
plant.style.position = "absolute";
plant.style.bottom = "-15px";
app.appendChild(plant);

const pillarTop = document.createElement("img");
const pillarBottom = document.createElement("img");
const pillar = document.createElement("img");
pillarTop.src = "/assets/images/pillar_top.png";
pillarBottom.src = "/assets/images/pillar_bottom.png";
pillar.src = "/assets/images/pillar.png";
/** Position pillar absolute */
pillarTop.style.position = "absolute";
pillarBottom.style.position = "absolute";
pillar.style.position = "absolute";
/** Position right*/
pillarTop.style.right = "-5px";
pillarBottom.style.right = "-5px";
pillar.style.right = "-5px";
/** Position bottom */
pillarTop.style.bottom = "30rem";
pillarBottom.style.bottom = "0rem";
pillar.style.bottom = "1rem";
/** Dimensions */
pillarTop.style.height = "5.5rem";
pillarBottom.style.height = "4rem";
pillar.style.height = "30rem";
/** Append to main element */
app.appendChild(pillar);
app.appendChild(pillarBottom);
app.appendChild(pillarTop);

async function fetchNewPicturesAndRerender() {

    /**
     * Fetching new pictures from the backend
     */
    const res = await fetch("https://tmn.pxldeveloper.eu/pics");

    const json = await res.json();

    var picsToRender = json.filter((element) => {

        const isIncluded = currentlyRendered.some((other) => {
            return other.url === element.url;
        })

        return !isIncluded;
    })
    currentlyRendered = json;

    /**
     * Sclice Array to render only the last 10 pics
     */
    if(picsToRender.length > 10) {
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
        domPic.src = "https://tmn.pxldeveloper.eu" + pic.url;
        var angle = Math.round(Math.random() * 50 - 25);
        var y_pos = 10 + Math.round(Math.random() * 20 - 10);
        var x_pox = 40 + Math.round(Math.random() * 50 - 25);
        domPic.classList = "picture";
        author.innerHTML = "📸 " + pic.sender;
        borderBox.classList = `borderbox animate__animated animate__rollIn`;
        borderBox.style.setProperty("--animate-duration", "3s")
        borderBox.style.transform = `rotate(${angle}deg)`;
        borderBox.style.top = `${y_pos}%`;
        borderBox.style.left = `${x_pox}%`
        subtitle.classList = "subtitle";
        subtitle.innerText = pic.subtitle;
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