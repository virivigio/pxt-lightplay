let slot0 = 0
let comando = 0

let direzione = 0     //Start-Stop
let delay = 0         //Start-Stop
let passi = 0         //Stepper

let ledRGB = 0
let R = 0
let G = 0
let B = 0

MbitMore.startService()

basic.forever(function () {
    slot0 = MbitMore.getSharedData(SharedDataIndex.DATA0)
    comando = slot0 >> 12

    if (comando == 4) { //Start-Stop
        direzione = (slot0 >> 8) & 3
        if (direzione == 0) delay=0; //ignore code, its a stop
        else delay = slot0 & 255
        basic.showString("Start:" + direzione + ":" + delay)
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
    else if (comando == 7) { //Stepper
        passi = slot0 & 2047
        basic.showString("Passi:" + passi)
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
    else if ((comando == 1) || (comando == 2)) { //RGB
        ledRGB = comando
        R = (slot0 >> 8) & 15
        G = (slot0 >> 4) & 15
        B = (slot0 >> 0) & 15
        basic.showString("Led:" + ledRGB + " R:" + R + " G:" + G + " B:" + B)
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
    else if (comando == 3) { //RGB all
        R = (slot0 >> 8) & 15
        G = (slot0 >> 4) & 15
        B = (slot0 >> 0) & 15
        basic.showString("Led All:" + " R:" + R + " G:" + G + " B:" + B)
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
})
