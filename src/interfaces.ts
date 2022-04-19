export interface fieldInterface {
    el: HTMLDivElement,
    backgroundColor: string,
    top: number,
    left: number,
    sync: Function
}

export interface gameInterface {
    running: boolean,
    startField: startmetaInterface,
    metaField: startmetaInterface,
    metaFound: boolean,
    findingPath: boolean,
    pathFound: boolean,
    bubbles: {
        newBubblesLimit: number
        newBubblesColors: string[],
        newBubblesDivs: any,
        smashed: boolean
    }
}

export interface startmetaInterface {
    isChosen: boolean,
    x: number,
    y: number
}

export interface settingsInterface {
    playfieldSize: number,
    playfieldOffset: number,
    requiredToSmash: number
}

export interface bubblePositionInterface {
    x: number,
    y: number
}

export interface bubbleInterface {
    color: string,
    x: number,
    y: number,
    el: HTMLDivElement
}