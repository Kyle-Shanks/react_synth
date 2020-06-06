import Gain from './gain';

// TODO: Need to update this to use AudioWorklet pattern. This is a deprecated method
class BitCrusher {
    constructor(AC) {
        this.AC = AC;
        this.bufferSize = 256;

        this.dryGain = new Gain(this.AC);
        this.wetGain = new Gain(this.AC);

        this.node = this.AC.createScriptProcessor(this.bufferSize, 1, 1);
        this.setBitDepth(8);

        this.node.connect(this.wetGain.getNode());
    }

    connect = destination => {
        this.dryGain.connect(destination);
        this.wetGain.connect(destination);
    }

    // Getters
    getDryInput = () => this.dryGain.getNode();
    getWetInput = () => this.node;

    // Setters
    setBitDepth = bitDepth => {
        if (bitDepth === this.node.bits) return false;
        this.node.bits = bitDepth; // between 1 and 16
        this.node.normfreq = 0.25; // between 0.0 and 1.0

        const step = Math.pow(0.75, this.node.bits);
        let phaser = 0;
        let last = 0;
        this.node.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < this.bufferSize; i++) {
                phaser += this.node.normfreq;
                if (phaser >= 1.0) {
                    phaser -= 1.0;
                    last = step * Math.floor(input[i] / step + 0.5);
                }
                output[i] = last;
            }
        };
    }
    setAmount = val => {
        this.dryGain.setGain(1 - val);
        this.wetGain.setGain(val);
    }
}

export default BitCrusher;

// class BitCrusherProcessor extends AudioWorkletProcessor {
//     static get parameterDescriptors() {
//         return [
//             { name: 'bitDepth', defaultValue: 12, minValue: 1, maxValue: 16 }, {
//                 name: 'frequencyReduction',
//                 defaultValue: 0.5,
//                 minValue: 0,
//                 maxValue: 1,
//             },
//         ];
//     }

//     constructor() {
//         super();
//         this.phase_ = 0;
//         this.lastSampleValue_ = 0;
//     }

//     process(inputs, outputs, parameters) {
//         const input = inputs[0];
//         const output = outputs[0];

//         // AudioParam array can be either length of 1 or 128. Generally, the code
//         // should prepare for both cases. In this particular example, |bitDepth|
//         // AudioParam is constant but |frequencyReduction| is being automated.
//         const bitDepth = parameters.bitDepth;
//         const frequencyReduction = parameters.frequencyReduction;
//         const isBitDepthConstant = bitDepth.length === 1;

//         for (let channel = 0; channel < input.length; ++channel) {
//             const inputChannel = input[channel];
//             const outputChannel = output[channel];
//             let step = Math.pow(0.5, bitDepth[0]);
//             for (let i = 0; i < inputChannel.length; ++i) {
//                 // We only take care |bitDepth| because |frequencuReduction| will always
//                 // have 128 values.
//                 if (!isBitDepthConstant) {
//                     step = Math.pow(0.5, bitDepth[i]);
//                 }
//                 this.phase_ += frequencyReduction[i];
//                 if (this.phase_ >= 1.0) {
//                     this.phase_ -= 1.0;
//                     this.lastSampleValue_ =
//                         step * Math.floor(inputChannel[i] / step + 0.5);
//                 }
//                 outputChannel[i] = this.lastSampleValue_;
//             }
//         }

//         return true;
//     }
// }

// registerProcessor('bit-crusher-processor', BitCrusherProcessor);