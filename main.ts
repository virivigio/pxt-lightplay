let slot0 = 0 //RGB + Step Number
let slot1 = 0 //Motor
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
//    basic.showString(message)
}

//check pin numbers
//turn off Led 1
pins.analogWritePin(AnalogPin.P0, 0) //R
pins.analogWritePin(AnalogPin.P1, 0) //G
pins.analogWritePin(AnalogPin.P2, 0) //B
//turn off Led 2
pins.analogWritePin(AnalogPin.P3, 0) //R
pins.analogWritePin(AnalogPin.P4, 0) //G
pins.analogWritePin(AnalogPin.P10, 0) //B

//clear transmission buffer
MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
MbitMore.setSharedData(SharedDataIndex.DATA1, 0)

MbitMore.startService()

basic.forever(function () {
    slot0 = MbitMore.getSharedData(SharedDataIndex.DATA0)
    comando = slot0 >> 12

    if (comando == 7) { //Stepper
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
            pins.analogWritePin(AnalogPin.P0, R*64) //R
            pins.analogWritePin(AnalogPin.P1, G*64) //G
            pins.analogWritePin(AnalogPin.P2, B*64) //B
        } else {
            pins.analogWritePin(AnalogPin.P3, R*64) //R
            pins.analogWritePin(AnalogPin.P4, G*64) //G
            pins.analogWritePin(AnalogPin.P10, B*64) //B
        }
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
    else if (comando == 3) { //RGB all
        R = (slot0 >> 8) & 15
        G = (slot0 >> 4) & 15
        B = (slot0 >> 0) & 15
        debug("Led All:" + " R:" + R + " G:" + G + " B:" + B)
        //check pin numbers
        pins.analogWritePin(AnalogPin.P0, R*64) //R
        pins.analogWritePin(AnalogPin.P1, G*64) //G
        pins.analogWritePin(AnalogPin.P2, B*64) //B
        pins.analogWritePin(AnalogPin.P3, R*64) //R
        pins.analogWritePin(AnalogPin.P4, G*64) //G
        pins.analogWritePin(AnalogPin.P10, B*64) //B
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }

    slot1 = MbitMore.getSharedData(SharedDataIndex.DATA1)
    comando = slot1 >> 12
    if (comando == 4) { //Start-Stop

        direzione = (slot1 >> 8) & 3
        if (direzione == 0) delay = 0; //ignore code, it's a stop
        else delay = slot1 & 255
        debug("Start:" + direzione + ":" + delay)

        //MbitMore.setSharedData(SharedDataIndex.DATA1, 0) we do not clear the status
        //we just execute a motor movement with delay
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

    }
})

