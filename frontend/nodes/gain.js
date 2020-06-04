class Gain {
    constructor(AC) {
        this.AC = AC;
        this.node = this.AC.createGain();
    }

    connect = destination => this.node.connect(destination);

    // Getters
    getNode = () => this.node;
    getGain = () => this.node.gain.value;

    // Setters
    setGain = (val, time = 0) => {
        time
            ? this.node.gain.setTargetAtTime(val, this.AC.currentTime, time)
            : this.node.gain.setValueAtTime(val, this.AC.currentTime);
    }
}

export default Gain;