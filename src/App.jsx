import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {


  const [dice, setDice] = useState(() => generateAllNewDice())
  const [gameStart, setGameStart] = useState(false)
  const [timeDiff, setTimeDiff] = useState(0)
  const [intervalUpdate, setIntervalUpdate] = useState(null)
  const [rollCount, setRollCount] = useState(0)
  const buttonRef = useRef(null)

  function generateAllNewDice() {
    return new Array(10)
      .fill(0)
      .map(() => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
        disabled: false
      }))
  }

  function rollDice() {

    if (!gameStart) {
      handleGameStart()
    }

    if (!gameWon) {
      setDice(oldDice => oldDice.map(die =>
        die.isHeld ?
          die :
          { ...die, value: Math.ceil(Math.random() * 6) }
      ))
      setRollCount(prevRollCount => prevRollCount+1)
    } else {
      setDice(generateAllNewDice())
    }
  }

  function hold(id) {
    if (!gameStart) {
      handleGameStart()
    }
    setDice(oldDice => oldDice.map(die =>
      die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    ))
  }


  function handleGameStart() {
    setGameStart(true)
    setTimeDiff(0)
    const now = new Date()
    setIntervalUpdate(setInterval(() => {
      setTimeDiff(new Date() - now)
    }, 1000))
    setRollCount(0)
  }

  const gameWon = dice.every(die => die.isHeld) &&
    dice.every(die => die.value === dice[0].value)


  const diceElements = dice.map(dieObj => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
      disabled={dieObj.disabled}
    />
  ))

  const timeDiffSec = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, "0")
  const timeDiffMin = String(Math.floor(timeDiff / (1000 * 60))).padStart(2, "0")

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
      setGameStart(false)
      setIntervalUpdate(prevIntervalUpdate => {
        clearInterval(prevIntervalUpdate)
        return null
      })
      setDice(oldDice => oldDice.map( dice => ({...dice, disabled: true})))
    }
  }, [gameWon])


  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <div className="result-container">
        <p>{timeDiffMin}:{timeDiffSec}</p>
        <p>Roll Count: {rollCount}</p>
      </div>
      <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  )
}