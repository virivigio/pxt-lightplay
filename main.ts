MbitMore.startService()
basic.forever(function () {
    if (MbitMore.getSharedData(SharedDataIndex.DATA0) == 21) {
        basic.showString("Led1:" + MbitMore.getSharedData(SharedDataIndex.DATA1) + "-" + MbitMore.getSharedData(SharedDataIndex.DATA2) + "-" + MbitMore.getSharedData(SharedDataIndex.DATA3))
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    } else if (MbitMore.getSharedData(SharedDataIndex.DATA0) == 31) {
        basic.showString("Direzione " + MbitMore.getSharedData(SharedDataIndex.DATA1) + " e Delay " + MbitMore.getSharedData(SharedDataIndex.DATA2))
        MbitMore.setSharedData(SharedDataIndex.DATA0, 0)
    }
})
