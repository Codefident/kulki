let positive: string[] = [
    "JD - jest dobrze",
    "Noo, niech ci będzie",
    "AAAAHHH, ale urwał! Ale to było dobre",
    "Nie ma lipy",
    "Max punktów, dziękuję, do widzenia",
    "Nieźle",
    "Dobrzee. Bartosz, wpisz koledze 2 punkciki w Excelu",
    "Super, prawie jak na systemach"
]

let negative: string[] = [
    "To by nic nie dało, to by nic nie dało",
    "To je amelinowe, tego nie pomalujesz",
    "Bożżżżż... ale dzban",
    "Żałosny jesteś człowieku",
    "A po co? A komu to potrzebne?",
    "Nie dla psaa! Dla pana tooo",
    "Chyba cię coś boli",
    "XDDD",
    "Zacznij w końcu grać bo dojazd się szykuje"
]

export function comment(target: any, name: string, descriptor: PropertyDescriptor) {
    let originMethod = descriptor.value
    descriptor.value = function (...args: any) {
        if (args[0])
            document.getElementById("comment").innerHTML = positive[Math.floor(Math.random() * positive.length)]
        else
            document.getElementById("comment").innerHTML = negative[Math.floor(Math.random() * negative.length)]

        let result = originMethod.apply(this, args)
        return result
    }
}