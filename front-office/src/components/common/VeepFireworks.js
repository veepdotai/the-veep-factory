import { Fireworks } from 'fireworks-js'
//import './styles.css'

export default function VeepFireworks() {

    const container = document.getElementById('fireworks')

    const fireworks = new Fireworks(container, {
    acceleration: 1.0,
    delay: {
        min: 30,
        max: 30
    },
    sound: {
        enabled: true,
        files: [
        'https://fireworks.js.org/sounds/explosion0.mp3',
        'https://fireworks.js.org/sounds/explosion1.mp3',
        'https://fireworks.js.org/sounds/explosion2.mp3'
        ],
        volume: {
        min: 2,
        max: 4
        }
    }
    })

    const button = document.querySelector('button')
    button.addEventListener('click', () => {
    if (fireworks.isRunning) return
    startFireworks()
    })

    async function startFireworks() {
    button.textContent = 'Launching...'
    fireworks.start()
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // fireworks.stop()
    await fireworks.waitStop()
    button.textContent = 'Start'
    }

    startFireworks()
}
