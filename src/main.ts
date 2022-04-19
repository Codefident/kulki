import { bubbleInterface, fieldInterface } from "./interfaces";
import { game } from "./game"
import { settings } from "./settings"
import { Bubble, randomColor, randomPosition } from "./bubble"
import { comment } from "./decorators";

let tabA: string[][] = []
let tabBubbles: any[][] = new Array(settings.playfieldSize)
let bubblesToSmash: bubbleInterface[] = new Array()
let fields: fieldInterface[][] = []
let shortestPath: any[] = []
let time: number = 1
let points: number = 0
let timeInterval: number
let playfieldContainer: HTMLElement
let commentBox: HTMLElement
let UwUrainbowUwU: number

window.addEventListener('DOMContentLoaded', (event): void => {
    //przypisanie divów do tablicy
    game.bubbles.newBubblesDivs = document.getElementsByClassName("newBubble")
    playfieldContainer = document.getElementById("cont")
    commentBox = document.getElementById("comment")
    commentBox.style.color = "white"
    commentBox.innerHTML = "Witaj w Kulkach! Kliknij przycisk Start by rozpocząć grę! Autor: Piotr Klęp 4ID2"

    document.getElementById("startButton").onclick = (e: any): void => {

        commentBox.innerHTML = ""

        for (let y = 0; y < settings.playfieldSize; y++) {
            tabA[y] = []
            for (let x = 0; x < settings.playfieldSize; x++)
                tabA[y][x] = "0"
        }

        e.target.innerHTML = "00:00"

        if (game.running) {
            clearInterval(timeInterval)
            clearInterval(UwUrainbowUwU)
            time = 1
            points = 0
            document.getElementById("score").innerHTML = "0"
            for (let y = 0; y < settings.playfieldSize; y++)
                for (let x = 0; x < settings.playfieldSize; x++) {
                    if (tabBubbles[y][x] != null)
                        playfieldContainer.removeChild(tabBubbles[y][x].el)
                    tabBubbles[y][x] = null
                }
        }

        game.running = true

        newBubbles()
        placeBubbles()
        newBubbles()
        sync()

        timeInterval = setInterval(() => {
            let timeMachine = document.getElementById("startButton")

            let minutes: any = Math.floor(time / 60)
            if (minutes < 10)
                minutes = "0" + minutes

            let seconds: any = time % 60
            if (seconds < 10)
                seconds = "0" + seconds

            timeMachine.innerHTML = minutes + ":" + seconds
            time++
        }, 1000)
    }
    createGameFields()
})

function endOfTheGame(): void {

    commentBox.innerHTML = `Koniec, twój wynik to ${points}, czas: ${document.getElementById("startButton").innerHTML}`
    clearInterval(timeInterval)

    const colors: string[] = ["red", "lime", "aqua", "yellow", "fuchsia", "blue", "orange"]
    let indexOfColors = 0
    UwUrainbowUwU = setInterval(() => {
        if (indexOfColors == colors.length)
            indexOfColors = 0
        commentBox.style.color = colors[indexOfColors++]
    }, 100)
}

function endOfTheGameCheck(): boolean {
    let response: boolean = true
    for (let y = 0; y < settings.playfieldSize; y++)
        for (let x = 0; x < settings.playfieldSize; x++)
            if (tabBubbles[y][x] == null)
                response = false
    return response
}

function sync(): void {
    for (let handle_fields of fields)
        for (let el of handle_fields)
            el.sync()
}

function placeBubbles(): void {
    let count = 0
    while (count < game.bubbles.newBubblesLimit) {
        let pos = randomPosition(settings.playfieldSize)
        if (tabA[pos.y][pos.x] == "0") {
            tabA[pos.y][pos.x] = "X"
            tabBubbles[pos.y][pos.x] = new Bubble(game.bubbles.newBubblesColors[count], pos.x, pos.y)
            areBubblesInTheSameLine(pos.x, pos.y, game.bubbles.newBubblesColors[count])
            count++
        }
        if (endOfTheGameCheck()) {
            endOfTheGame()
            break
        }
    }
}

function newBubbles(): void {
    game.bubbles.newBubblesColors = []
    for (let i = 0; i < game.bubbles.newBubblesLimit; i++)
        game.bubbles.newBubblesColors.push(randomColor())

    for (let i in game.bubbles.newBubblesColors)
        game.bubbles.newBubblesDivs[i].style.backgroundColor = game.bubbles.newBubblesColors[i]
}

function createGameFields(): void {

    let darkerBackground: boolean = false

    for (let y = 0; y < settings.playfieldSize; y++) {
        fields[y] = []
        for (let x = 0; x < settings.playfieldSize; x++) {
            fields[y][x] = (new Field(y, x, darkerBackground))
            darkerBackground = !darkerBackground
        }
    }

    //tablica przechowująca kulki
    for (let y = 0; y < settings.playfieldSize; y++)
        tabBubbles[y] = new Array(settings.playfieldSize)
}

class Field implements fieldInterface {

    private readonly x: number
    private readonly y: number
    public el: HTMLDivElement
    public backgroundColor: string
    private readonly darkerBackground: boolean
    public top: number
    public left: number
    public sync: VoidFunction
    private click: VoidFunction
    public displayComment: Function

    constructor(y: number, x: number, db: boolean) {
        this.x = x
        this.y = y

        let div: HTMLDivElement = document.createElement("div")
        div.classList.add("field")
        div.classList.add("pointer")
        div.style.top = `${y * 50 + settings.playfieldOffset}px`
        div.style.left = `${x * 50 + settings.playfieldOffset}px`

        this.el = div
        this.top = y * 50 + settings.playfieldOffset
        this.left = x * 50 + settings.playfieldOffset
        this.darkerBackground = db
        if (this.darkerBackground)
            this.el.classList.add("darkerField")
        else
            this.el.classList.add("lighterField")

        document.getElementById("cont").appendChild(div)

        this.sync = this.syncWithTabA
        this.click = this.clickOnField
        this.el.onclick = this.click.bind(this)
    }

    syncWithTabA(): void {
        switch (tabA[this.y][this.x]) {
            case "S":
                this.el.classList.add("s")
                break
            case "M":
                this.el.classList.add("m")
                break
            case "P":
                this.el.classList.add("p")
                break
            default:
                this.el.classList.remove("s", "m", "p")
                break;
        }
    }

    checkSurroundings(x: number, y: number): boolean {
        if ((x - 1 < 0 || tabA[y][x - 1].match(/[XS]/)) &&
            (y + 1 >= settings.playfieldSize || tabA[y + 1][x].match(/[XS]/)) &&
            (x + 1 >= settings.playfieldSize || tabA[y][x + 1].match(/[XS]/)) &&
            (y - 1 < 0 || tabA[y - 1][x].match(/[XS]/)))
            return false
        return true
    }

    clickOnField(): void {
        console.log(tabA[this.y][this.x])

        for (let hy = 0; hy < settings.playfieldSize; hy++)
            for (let hx = 0; hx < settings.playfieldSize; hx++) {
                if (!tabA[hy][hx].match(/[0XSM]/))
                    tabA[hy][hx] = "0"
            }

        //GDY KULKA NIE MOŻE SIĘ RUSZYĆ
        if (game.running && !this.checkSurroundings(this.x, this.y) && !game.startField.isChosen) {
            console.log("nie moze sie ruszyc")
        }

        //WYBIERANIE STARTU
        else if (game.running && tabA[this.y][this.x] == "X" && tabBubbles[this.y][this.x] != null && (this.x != game.startField.x || this.y != game.startField.y)) {
            console.log(`wybieranie startu ${this.x} ${this.y} ${tabA[this.y][this.y]}`)
            if (game.startField.isChosen) {
                tabA[game.startField.y][game.startField.x] = "X"
                sync()
            }
            game.metaFound = false
            tabA[this.y][this.x] = "S"
            game.startField.isChosen = true
            game.startField.x = this.x
            game.startField.y = this.y

            game.metaField.isChosen = false
            game.metaField.x = null
            game.metaField.y = null

            game.findingPath = true
            sync()
        }

        //WYBIERANIE METY
        else if (game.running && game.findingPath && tabA[this.y][this.x] != "X" && tabBubbles[this.y][this.x] == null) {
            console.log(`wybieranie mety ${this.x} ${this.y} ${tabA[this.y][this.y]}`)

            tabA[this.y][this.x] = "M"
            game.metaField.isChosen = true
            game.metaField.x = this.x
            game.metaField.y = this.y
            game.findingPath = false
            sync()
            findPath(game.startField.y, game.startField.x, 1)
            if (game.metaFound)
                findShortestPath(game.metaField.y, game.metaField.x)

            //NIE DA SIĘ DOJŚĆ W DANE MIEJSCE
            else {
                console.log(`tam sie nie da ${this.x} ${this.y} ${tabA[this.y][this.y]}`)
                tabA[this.y][this.x] = "0"
                tabA[game.startField.y][game.startField.x] = "X"
                game.startField.isChosen = false
                game.startField.x = null
                game.startField.y = null
                game.findingPath = false
                sync()
            }
        }

        //KLIKNIĘCIE TEJ SAMEJ KULKI
        else if (game.running && game.startField.isChosen && this.x == game.startField.x && this.y == game.startField.y) {
            console.log(`odznaczenie kulki (ta sama kliknięta) ${this.x} ${this.y} ${tabA[this.y][this.y]}`)
            tabA[this.y][this.x] = "X"
            game.startField.isChosen = false
            game.startField.x = null
            game.startField.y = null
            game.findingPath = false
            sync()
        }
    }

    @comment
    static displayCommentFunc(positive: boolean) {
        const colors: string[] = ["red", "lime", "aqua", "yellow", "fuchsia", "blue", "orange"]
        commentBox.style.color = colors[(Math.floor(Math.random() * colors.length))]
    }
}

function findPath(y: number, x: number, step: number): void {


    if (checkField(y, x - 1, step) == "go on")
        goOn(y, x - 1, step)

    if (checkField(y - 1, x, step) == "go on")
        goOn(y - 1, x, step)

    if (checkField(y, x + 1, step) == "go on")
        goOn(y, x + 1, step)

    if (checkField(y + 1, x, step) == "go on")
        goOn(y + 1, x, step)
}

function goOn(y: number, x: number, step: number): void {
    tabA[y][x] = step.toString()
    sync()
    findPath(y, x, ++step)
}

function findShortestPath(y: number, x: number) {

    let numbersAround: any[] = []
    if (checkField_ShortestPath(y, x - 1))
        numbersAround.push({
            step: parseInt(tabA[y][x - 1]),
            x: x - 1,
            y: y
        })
    if (checkField_ShortestPath(y - 1, x))
        numbersAround.push({
            step: parseInt(tabA[y - 1][x]),
            x: x,
            y: y - 1
        })
    if (checkField_ShortestPath(y, x + 1))
        numbersAround.push({
            step: parseInt(tabA[y][x + 1]),
            x: x + 1,
            y: y
        })
    if (checkField_ShortestPath(y + 1, x))
        numbersAround.push({
            step: parseInt(tabA[y + 1][x]),
            x: x,
            y: y + 1
        })

    if (!game.pathFound) {
        try {
            numbersAround.sort((a: any, b: any) => a.step - b.step)
            shortestPath.push({ y: numbersAround[0].y, x: numbersAround[0].x })
            findShortestPath(numbersAround[0].y, numbersAround[0].x)
        }
        catch { }
    }

}

function checkField_ShortestPath(y: number, x: number): boolean {
    let response: boolean = true
    if (
        x < 0 ||
        x >= settings.playfieldSize ||
        y < 0 ||
        y >= settings.playfieldSize ||
        tabA[y][x] == "X" ||
        tabA[y][x] == "M" ||
        tabA[y][x] == "0"
    )
        response = false
    else if (tabA[y][x] == "S") {
        response = false
        if (!game.pathFound)
            pathFound()    //gdy znajdziemy najkrótszą drogę
    }
    return response
}

function pathFound(): void {
    game.running = false
    game.pathFound = true
    for (let el of shortestPath)
        fields[el.y][el.x].el.classList.add("p")
    let handleMeta = { x: game.metaField.x, y: game.metaField.y }
    tabA[game.startField.y][game.startField.x] = "0"
    tabA[game.metaField.y][game.metaField.x] = "X"
    tabBubbles[game.metaField.y][game.metaField.x] = tabBubbles[game.startField.y][game.startField.x]
    tabBubbles[game.startField.y][game.startField.x] = null
    tabBubbles[game.metaField.y][game.metaField.x].x = game.metaField.x
    tabBubbles[game.metaField.y][game.metaField.x].y = game.metaField.y
    tabBubbles[game.metaField.y][game.metaField.x].changePos()
    for (let y = 0; y < settings.playfieldSize; y++)
        for (let x = 0; x < settings.playfieldSize; x++)
            if (tabA[y][x] != "X")
                tabA[y][x] = "0"
    game.metaFound = false
    game.metaField = { isChosen: false, x: null, y: null }
    game.startField = { isChosen: false, x: null, y: null }
    game.pathFound = false

    //TU BĘDZIE TEST UŁOŻENIA KULEK
    let handleColor = tabBubbles[handleMeta.y][handleMeta.x].color
    areBubblesInTheSameLine(handleMeta.x, handleMeta.y, handleColor)

    setTimeout((): void => {
        shortestPath = []
        Field.displayCommentFunc(game.bubbles.smashed)
        if (!game.bubbles.smashed) {
            placeBubbles()
            newBubbles()
        }
        game.bubbles.smashed = false
        game.running = true
        sync()
    }, 500)
}

function checkField(y: number, x: number, step: number): string {

    let response: string = "go on"

    if (x < 0 || x >= settings.playfieldSize || y < 0 || y >= settings.playfieldSize || tabA[y][x] == "X" || tabA[y][x] == "S" || (parseInt(tabA[y][x]) <= step && tabA[y][x] != "0"))
        response = "stop"
    else if (tabA[y][x] == "M") {
        response = "meta"
        game.metaFound = true
    }

    return response
}

function areBubblesInTheSameLine(x: number, y: number, color: string): void {
    bubblesToSmash = []
    //8 kierunków sprawdzania
    bubblesToSmash.push(tabBubbles[y][x])
    checkBubbles_LeftRight(x, y, color)
    checkBubbles_UpDown(x, y, color)
    checkBubbles_UpLeftDownRight(x, y, color)
    checkBubbles_UpRightDownLeft(x, y, color)
    if (bubblesToSmash.length >= settings.requiredToSmash) {
        game.bubbles.smashed = true
        bubblesToSmash.forEach((el) => {
            tabBubbles[el.y][el.x] = null
            tabA[el.y][el.x] = "0"
            playfieldContainer.removeChild(el.el)
        })
        points += bubblesToSmash.length
        document.getElementById("score").innerHTML = points.toString()
    }
    bubblesToSmash = []
}

function checkBubbles_LeftRight(x: number, y: number, color: string): void {

    let count: number = 0
    let x_left = x - 1
    let x_right = x + 1
    let handleBubblesToSmash: bubbleInterface[] = new Array()

    //left
    while (x_left >= 0 && x_left < settings.playfieldSize) {
        if (tabBubbles[y][x_left] != null)
            if (tabBubbles[y][x_left].color == color) {
                count++
                handleBubblesToSmash.push(tabBubbles[y][x_left])
                x_left--
            }
            else break
        else break
    }

    //right
    while (x_right >= 0 && x_right < settings.playfieldSize) {
        if (tabBubbles[y][x_right] != null)
            if (tabBubbles[y][x_right].color == color) {
                count++
                handleBubblesToSmash.push(tabBubbles[y][x_right])
                x_right++
            }
            else break
        else break
    }
    //sprawdzamy ile jest
    if (count >= settings.requiredToSmash - 1)
        handleBubblesToSmash.forEach((el) => { bubblesToSmash.push(el) })
}

function checkBubbles_UpDown(x: number, y: number, color: string): void {

    let count: number = 0
    let y_up = y - 1
    let y_down = y + 1
    let handleBubblesToSmash: bubbleInterface[] = new Array()

    //up
    while (y_up >= 0 && y_up < settings.playfieldSize) {
        if (tabBubbles[y_up][x] != null)
            if (tabBubbles[y_up][x].color == color) {
                count++
                handleBubblesToSmash.push(tabBubbles[y_up][x])
                y_up--
            }
            else break
        else break
    }

    //down
    while (y_down >= 0 && y_down < settings.playfieldSize) {
        if (tabBubbles[y_down][x] != null)
            if (tabBubbles[y_down][x].color == color) {
                count++
                handleBubblesToSmash.push(tabBubbles[y_down][x])
                y_down++
            }
            else break
        else break
    }
    //sprawdzamy ile jest
    if (count >= settings.requiredToSmash - 1)
        handleBubblesToSmash.forEach((el) => { bubblesToSmash.push(el) })
}

function checkBubbles_UpLeftDownRight(x: number, y: number, color: string): void {

    let count: number = 0
    let y_up = y - 1
    let y_down = y + 1
    let x_left = x - 1
    let x_right = x + 1
    let handleBubblesToSmash: bubbleInterface[] = new Array()

    //upleft
    while (y_up >= 0 && y_up < settings.playfieldSize && x_left >= 0 && x_left < settings.playfieldSize) {
        if (tabBubbles[y_up][x_left] != null)
            if (tabBubbles[y_up][x_left].color == color) {
                count++
                handleBubblesToSmash.push(tabBubbles[y_up][x_left])
                y_up--
                x_left--
            }
            else break
        else break
    }

    //downright
    while (y_down >= 0 && y_down < settings.playfieldSize && x_right >= 0 && x_right < settings.playfieldSize) {
        if (tabBubbles[y_down][x_right] != null)
            if (tabBubbles[y_down][x_right].color == color) {
                count++
                handleBubblesToSmash.push(tabBubbles[y_down][x_right])
                y_down++
                x_right++
            }
            else break
        else break
    }
    //sprawdzamy ile jest
    if (count >= settings.requiredToSmash - 1)
        handleBubblesToSmash.forEach((el) => { bubblesToSmash.push(el) })
}

function checkBubbles_UpRightDownLeft(x: number, y: number, color: string): void {

    let count: number = 0
    let y_up = y - 1
    let y_down = y + 1
    let x_left = x - 1
    let x_right = x + 1
    let handleBubblesToSmash: bubbleInterface[] = new Array()

    //upright
    while (y_up >= 0 && y_up < settings.playfieldSize && x_right >= 0 && x_right < settings.playfieldSize) {
        if (tabBubbles[y_up][x_right] != null)
            if (tabBubbles[y_up][x_right].color == color) {
                count++
                handleBubblesToSmash.push(tabBubbles[y_up][x_right])
                y_up--
                x_right++
            }
            else break
        else break
    }

    //downleft
    while (y_down >= 0 && y_down < settings.playfieldSize && x_left >= 0 && x_left < settings.playfieldSize) {
        if (tabBubbles[y_down][x_left] != null)
            if (tabBubbles[y_down][x_left].color == color) {
                count++
                handleBubblesToSmash.push(tabBubbles[y_down][x_left])
                y_down++
                x_left--
            }
            else break
        else break
    }
    //sprawdzamy ile jest
    if (count >= settings.requiredToSmash - 1)
        handleBubblesToSmash.forEach((el) => { bubblesToSmash.push(el) })
}