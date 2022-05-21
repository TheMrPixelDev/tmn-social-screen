import './style.css'
import 'animate.css'

const app = document.querySelector('#app')
var currentlyRendered = []

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