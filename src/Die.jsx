export default function Die(props) {
    const styles = {
        // backgroundColor: props.isHeld ? "#59E391" : "white"
        backgroundImage: `url("/images/${props.isHeld ? 'hold' : 'non-hold'}/${props.value}.png")`
    }
    
    return (
        <button 
            style={styles}
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
            disabled={props.disabled}
        ></button>
    )
}