# React Synth
Monophonic Synth with two sub oscillators and a few effects to make it fun.
There is also an oscilloscope and frequency spectrum analyser because they look neat.

## Effects
### Portamento (Glide)
This determines the time that the oscillator and subs take to glide to the next note. (More of a parameter than a full effect really)
#### Parameters
* Time - Time to glide to the next note

### Vibrato
An LFO linked to the frequencies of the oscillator and two subs
#### Parameters
* Rate - Frequency of the LFO
* Depth - The range of the pitch modulation

### Distortion (Drive)
A Waveshaper node used to distort and beef up the signal
#### Parameters
* Distortion - Sets the distortion curve applied
* Dry/Wet - Amount of dry and wet signal

### Filter
A biquad filter used to adjust the frequencies coming through and shape the sound
#### Parameters
* Type - Select for the filter type
* Cutoff - Sets the target frequency for the filter
* Q - Sets the resonance of the filter
* Attack - Sets the attack time for the filter envelope
* Decay - Sets the decay time for the filter envelope
* Env Amt - Sets the amount and direction that the envelope adjusts the filters frequency

### Delay
A delay module that feeds the signal back after a specified delay time
#### Parameters
* Time - Sets the delay time for the feedback signal
* Feedback - Set the gain for the signal being
* Tone - Sets the frequency for the delay node's lowpass filter
* Dry/Wet - Amount of dry and wet signal

### Bit Crusher (Crush)
Using ScriptProcessorNode to simulate bit depth reduction (this is a deprecated method and will be fixed)
#### Parameters
* Depth - Selects the bit depth to simulate
* Dry/Wet - Amount of dry and wet signal

### Reverb
Convolver node used to add some neat reverb effects
#### Parameters
* Type - Selects different impulse responses for the convolver node
* Dry/Wet - Amount of dry and wet signal

## Node connection order
Vibrato LFO -> Osc + Subs -> Distortion -> Filter -> Gain Env -> Delay -> Bit Crusher -> Reverb -> Master Volume -> Out

## Future Ideas
* Currently working on a sequencer to link to this
* One or two general-purpose LFOs that can be assigned to different effect parameters
* A master tempo and a way to sync effect rates like delay time and vibrato speed
* Allow users to save presets
* Master Peak/Gain Meter
* Visual representation of the gain envelope (and maybe filter envelope)
* Super future idea (that may be another synth entirely) would be to make it polyphonic
