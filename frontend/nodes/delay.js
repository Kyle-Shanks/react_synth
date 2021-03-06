import Filter from './filter';
import Gain from './gain';

class Delay {
    constructor(AC) {
        this.AC = AC;
        this.dryGain = new Gain(this.AC);
        this.wetGain = new Gain(this.AC);

        this.delayNode = this.AC.createDelay();
        this.tone = new Filter(this.AC);
        this.feedbackGain = new Gain(this.AC);

        this.tone.connect(this.delayNode);
        this.delayNode.connect(this.feedbackGain.getNode());
        this.feedbackGain.connect(this.wetGain.getNode());
        this.feedbackGain.connect(this.delayNode);

        this.maxDelayTime = 1;
    }

    connect = destination => {
        this.dryGain.connect(destination);
        this.wetGain.connect(destination);
    }

    // Getters
    getDryInput = () => this.dryGain.getNode();
    getWetInput = () => this.tone.getNode();

    // Setters
    setAmount = val => {
        this.dryGain.setGain(1 - val);
        this.wetGain.setGain(val);
    }
    setFeedback = val => this.feedbackGain.setGain(val);
    setTone = val => this.tone.setFreq(val);
    setDelayTime = val => {
        if (val < 0 || val > this.maxDelayTime) return false;
        this.delayNode.delayTime.setValueAtTime(val, this.AC.currentTime);
    }
}

export default Delay;