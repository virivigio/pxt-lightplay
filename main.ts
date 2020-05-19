let new5 = 0
MbitMore.startService()
MbitMore.setSharedData(SharedDataIndex.DATA5, 0)
let old5 = 0
basic.forever(function () {
    new5 = MbitMore.getSharedData(SharedDataIndex.DATA5)
    if (new5 != old5) {
        basic.showLeds(`
            . . . . .
            . # . # .
            . . # . .
            . # . # .
            . . . . .
            `)
    } else {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    }
})
