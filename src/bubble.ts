import { bubbleInterface, bubblePositionInterface } from "./interfaces"
import { settings } from "./settings"

export class Bubble implements bubbleInterface {

    public readonly color: string
    public x: number
    public y: number
    public el: HTMLDivElement

    constructor(color: string, x: number, y: number) {
        this.color = color
        this.x = x
        this.y = y
        let div = document.createElement("div")
        div.classList.add("bubble")
        div.style.backgroundColor = color
        this.el = div
        this.changePos()
        document.getElementById("cont").appendChild(div)
    }

    changePos(): void {
        this.el.style.top = (this.y * 50 + settings.playfieldOffset) + "px"
        this.el.style.left = (this.x * 50 + settings.playfieldOffset) + "px"
    }
}

export const randomColor = (): string => {
    const colors: string[] = ["red", "lime", "aqua", "yellow", "fuchsia", "blue", "orange"]
    let whichColor = Math.floor(Math.random() * colors.length)
    return colors[whichColor]
}

export const randomPosition = (limit: number): bubblePositionInterface => {
    return {
        x: Math.floor(Math.random() * limit),
        y: Math.floor(Math.random() * limit)
    }
}