let slot0 = 0
let comando = 0

let direzione = 0     //Start-Stop
let delay = 0         //Start-Stop
let passi = 0         //Stepper
let motorIsOn = 0

let ledRGB = 0
let R = 0
let G = 0
let B = 0

function debug(message:string) {
    //basic.showString(message)
}

//check pin numbers
//turn off Led 1 
pins.analogWritePin(AnalogPin.P2, 0) //R
pins.analogWritePin(AnalogPin.P1, 0) //G
pins.analogWritePin(AnalogPin.P0, 0) //B
//turn off Led 2
//pins.analogWritePin(AnalogPin.P2, 0) //R
//pins.analogWritePin(AnalogPin.P1, 0) //G
//pins.analogWritePin(AnalogPin.P0, 0) //B 

MbitMore.startService()

basic.forever(function () {
    slot0 = MbitMore.getSharedData(SharedDataIndex.DATA0)
    comando = slot0 >> 12

    if (comando == 4) { //Start-Stop
        //avoid race conditions
        let localDirezione
        let localDelay

        localDirezione = (slot0 >> 8) & 3
        if (localDirezione == 0) localDelay = 0; //ignore code, it's a stop
        else localDelay = slot0 & 255
        debug("Start:" + localDirezione + ":" + localDelay)
     
        delay = localDelay
        direzione = localDirezione
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
    else if (comando == 7) { //Stepper
        passi = slot0 & 2047
        debug("Passi:" + passi)
        Kitronik_Robotics_Board.setStepperMotorSteps(Kitronik_Robotics_Board.StepperMotors.Stepper1, passi)
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
    else if ((comando == 1) || (comando == 2)) { //RGB
        ledRGB = comando
        R = (slot0 >> 8) & 15
        G = (slot0 >> 4) & 15
        B = (slot0 >> 0) & 15
        debug("Led:" + ledRGB + " R:" + R + " G:" + G + " B:" + B)
        //check pin numbers
        if (ledRGB == 1) {
            pins.analogWritePin(AnalogPin.P2, R*64) //R
            pins.analogWritePin(AnalogPin.P1, G*64) //G
            pins.analogWritePin(AnalogPin.P0, B*64) //B
        } else {
            //pins.analogWritePin(AnalogPin.P2, R*64) //R
            //pins.analogWritePin(AnalogPin.P1, G*64) //G
            //pins.analogWritePin(AnalogPin.P0, B*64) //B            
        }
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
    else if (comando == 3) { //RGB all
        R = (slot0 >> 8) & 15
        G = (slot0 >> 4) & 15
        B = (slot0 >> 0) & 15
        debug("Led All:" + " R:" + R + " G:" + G + " B:" + B)
        //check pin numbers
        pins.analogWritePin(AnalogPin.P2, R*64) //R
        pins.analogWritePin(AnalogPin.P1, G*64) //G
        pins.analogWritePin(AnalogPin.P0, B*64) //B
        //pins.analogWritePin(AnalogPin.P2, R*64) //R
        //pins.analogWritePin(AnalogPin.P1, G*64) //G
        //pins.analogWritePin(AnalogPin.P0, B*64) //B 
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
})

basic.forever(function () {
    if (direzione == 1) {
        Kitronik_Robotics_Board.stepperMotorTurnAngle(Kitronik_Robotics_Board.StepperMotors.Stepper1, Kitronik_Robotics_Board.MotorDirection.Forward, 5)
        motorIsOn = 1
        basic.pause(delay)
    } else if (direzione == 2) {
        Kitronik_Robotics_Board.stepperMotorTurnAngle(Kitronik_Robotics_Board.StepperMotors.Stepper1, Kitronik_Robotics_Board.MotorDirection.Reverse, 5)
        motorIsOn = 1
        basic.pause(delay)
    } else {
        if (motorIsOn == 1) {
            motorIsOn = 0
            Kitronik_Robotics_Board.motorOff(Kitronik_Robotics_Board.Motors.Motor1)
            Kitronik_Robotics_Board.motorOff(Kitronik_Robotics_Board.Motors.Motor2)
        }
    }
})
