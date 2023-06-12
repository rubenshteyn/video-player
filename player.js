let timeFormat = (function (){
    function num(val){
        val = Math.floor(val);
        return val < 10 ? '0' + val : val;
    }

    return function (ms){
        let sec = ms / 1000
            , hours = sec / 3600  % 24
            , minutes = sec / 60 % 60
            , seconds = sec % 60
        return num(hours) + ":" + num(minutes) + ":" + num(seconds);
    }
})()

if (Hls.isSupported()) {
    const video = document.getElementById('video')
    const currentTime = document.getElementById("current-time")
    const rangeVideoLength = document.getElementById("range-length")
    const rangeVideoAudio = document.getElementById("range-audio")

    const source = "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"
    const hls = new Hls()
    const defaultOptions = {}
    const arguments = ['play-large', 'restart', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'download', 'fullscreen']

    setInterval(() => {
        currentTime.textContent = timeFormat(video.currentTime * 1000)
        rangeVideoLength.style.width = video.currentTime + "px"
        rangeVideoAudio.style.width = video.volume * 100 + "%"
    }, 100)

    hls.attachMedia(video)
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        hls.loadSource(source)
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            const availableQualities = hls.levels.map((i) => i.height)
            defaultOptions.controls = arguments
            defaultOptions.quality = {
                default: availableQualities[0],
                options: availableQualities,
                forced: true,
                onChange: (e) => updateQuality(e)
            }
            new Plyr(video, defaultOptions)
            videoProgress()
        })
        window.hls = hls
    })
    function updateQuality(newQuality) {
        window.hls.levels.forEach((level, index) => {
           if(level.height === newQuality) {
               window.hls.currentLevel = index
           }
        })
    }
}


