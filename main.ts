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


Kitronik_Robotics_Board.setStepperMotorSteps(Kitronik_Robotics_Board.StepperMotors.Stepper1, 2048)
MbitMore.startService()

basic.forever(function () {
    slot0 = MbitMore.getSharedData(SharedDataIndex.DATA0)
    comando = slot0 >> 12

    if (comando == 4) { //Start-Stop
        direzione = (slot0 >> 8) & 3
        if (direzione == 0) delay = 0; //ignore code, its a stop
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
