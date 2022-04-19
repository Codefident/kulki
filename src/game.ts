import { gameInterface } from "./interfaces"

export let game: gameInterface = {
    running: false,
    startField: { isChosen: false, x: null, y: null },
    metaField: { isChosen: false, x: null, y: null },
    metaFound: false,
    findingPath: false,
    pathFound: false,
    bubbles: {
        newBubblesLimit: 3,
        newBubblesColors: [],
        newBubblesDivs: [],
        smashed: false
    }
}