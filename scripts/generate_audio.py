#!/usr/bin/env python3
import math
import struct
import wave
import random

SAMPLE_RATE = 44100
DURATION = 22.0
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES

def clamp(v, min_v=-1.0, max_v=1.0):
    return max(min_v, min(max_v, v))

def add_sample(idx, l_val, r_val):
    if 0 <= idx < TOTAL_SAMPLES:
        left[idx] += l_val
        right[idx] += r_val

def add_sub_boom(start_s, amp=0.7):
    start_idx = int(start_s * SAMPLE_RATE)
    dur_samples = int(2.5 * SAMPLE_RATE)
    for i in range(dur_samples):
        t = i / SAMPLE_RATE
        # Pitch drops from 120Hz to 35Hz
        freq = 35.0 + 85.0 * math.exp(-t * 8.0)
        phase = 2.0 * math.pi * freq * t
        env = math.exp(-t * 2.2)
        val = math.sin(phase) * env * amp
        add_sample(start_idx + i, val, val)

def add_braam(start_s, base_freq=55.0, amp=0.75, length=3.5):
    start_idx = int(start_s * SAMPLE_RATE)
    dur_samples = int(length * SAMPLE_RATE)
    phase1 = 0.0
    phase2 = 0.0
    phase3 = 0.0
    for i in range(dur_samples):
        t = i / SAMPLE_RATE
        # Initial pitch bend
        pitch_mult = 1.0 + 0.4 * math.exp(-t * 12.0)
        f1 = base_freq * pitch_mult
        f2 = (base_freq * 1.01) * pitch_mult
        f3 = (base_freq * 0.5) * pitch_mult
        
        phase1 += 2.0 * math.pi * f1 / SAMPLE_RATE
        phase2 += 2.0 * math.pi * f2 / SAMPLE_RATE
        phase3 += 2.0 * math.pi * f3 / SAMPLE_RATE
        
        # Saturated saw/sine wave
        s1 = math.sin(phase1) + 0.5 * math.sin(phase1 * 2) + 0.25 * math.sin(phase1 * 3)
        s2 = math.sin(phase2) + 0.5 * math.sin(phase2 * 2) + 0.25 * math.sin(phase2 * 3)
        s3 = math.sin(phase3) # Sub
        
        # Soft clipping
        val_l = math.tanh(s1 * 1.5 + s3 * 0.8)
        val_r = math.tanh(s2 * 1.5 + s3 * 0.8)
        
        # Filter cutoff envelope (brass bite)
        filter_env = math.exp(-t * 1.8) + 0.2 * math.exp(-t * 0.5)
        env = math.exp(-t * 1.2) * filter_env
        
        add_sample(start_idx + i, val_l * env * amp, val_r * env * amp)

def add_drone(start_s, dur_s, freq=55.0, amp=0.25):
    start_idx = int(start_s * SAMPLE_RATE)
    dur_samples = int(dur_s * SAMPLE_RATE)
    phase1 = 0.0
    phase2 = 0.0
    for i in range(dur_samples):
        t = i / SAMPLE_RATE
        # Slow pulse LFO
        lfo = 0.8 + 0.2 * math.sin(2.0 * math.pi * 0.3 * t)
        f1 = freq + 0.2 * math.sin(2.0 * math.pi * 0.1 * t)
        f2 = freq * 1.005
        
        phase1 += 2.0 * math.pi * f1 / SAMPLE_RATE
        phase2 += 2.0 * math.pi * f2 / SAMPLE_RATE
        
        # Fade in and out
        fade = 1.0
        if t < 1.0:
            fade = t / 1.0
        elif t > dur_s - 1.5:
            fade = (dur_s - t) / 1.5
            
        vl = (math.sin(phase1) + 0.4 * math.sin(phase1 * 2)) * lfo * fade * amp
        vr = (math.sin(phase2) + 0.4 * math.sin(phase2 * 2)) * lfo * fade * amp
        add_sample(start_idx + i, vl, vr)

def add_arp(start_s, dur_s, bpm=124, amp=0.3):
    start_idx = int(start_s * SAMPLE_RATE)
    dur_samples = int(dur_s * SAMPLE_RATE)
    # Notes in A minor (A3, C4, E4, G4, A4, G4, E4, C4)
    notes = [220.0, 261.63, 329.63, 392.00, 440.0, 392.00, 329.63, 261.63]
    step_sec = 60.0 / (bpm * 4) # 16th note
    total_steps = int(dur_s / step_sec)
    
    for s in range(total_steps):
        note_freq = notes[s % len(notes)]
        step_start_idx = start_idx + int(s * step_sec * SAMPLE_RATE)
        step_dur_samples = int(step_sec * 0.9 * SAMPLE_RATE)
        
        # Pan alternating
        pan = 0.3 if (s % 2 == 0) else 0.7
        
        phase = 0.0
        for i in range(step_dur_samples):
            if step_start_idx + i >= TOTAL_SAMPLES:
                break
            t = i / SAMPLE_RATE
            phase += 2.0 * math.pi * note_freq / SAMPLE_RATE
            env = math.exp(-t * 24.0) # Pluck
            # Build intensity over time
            build = min(1.0, 0.3 + 0.7 * ((s * step_sec) / dur_s))
            v = math.sin(phase) * env * amp * build
            add_sample(step_start_idx + i, v * (1.0 - pan), v * pan)

def add_riser(start_s, dur_s, start_f=60.0, end_f=1400.0, amp=0.45):
    start_idx = int(start_s * SAMPLE_RATE)
    dur_samples = int(dur_s * SAMPLE_RATE)
    phase = 0.0
    for i in range(dur_samples):
        t = i / dur_samples
        freq = start_f * math.pow(end_f / start_f, t)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        
        # White noise layer
        noise = (random.random() * 2.0 - 1.0) * 0.3 * (t * t)
        
        env = t * t # Exponential swell
        v = (math.sin(phase) * 0.7 + noise) * env * amp
        add_sample(start_idx + i, v * 0.9, v * 1.1)

def add_chord(start_s, dur_s, freqs=[220.0, 261.63, 329.63, 440.0], amp=0.4):
    start_idx = int(start_s * SAMPLE_RATE)
    dur_samples = int(dur_s * SAMPLE_RATE)
    for i in range(dur_samples):
        t = i / SAMPLE_RATE
        fade = 1.0
        if t < 0.2:
            fade = t / 0.2
        elif t > dur_s - 1.5:
            fade = (dur_s - t) / 1.5
        
        val = 0.0
        for idx, f in enumerate(freqs):
            detune = 1.0 + 0.002 * (idx - 1.5)
            val += math.sin(2.0 * math.pi * f * detune * t)
        val = (val / len(freqs)) * fade * amp
        add_sample(start_idx + i, val * 0.95, val * 1.05)

print("Synthesizing cinematic trailer soundscape...")

# 0.0s - Scene 1 starts: Sub boom + deep drone
add_sub_boom(0.0, amp=0.85)
add_braam(0.2, base_freq=55.0, amp=0.7, length=3.8)
add_drone(0.0, 21.5, freq=55.0, amp=0.28)

# 4.0s - Scene 2 (Banner): Braam impact + start arp
add_sub_boom(4.0, amp=0.8)
add_braam(4.1, base_freq=49.0, amp=0.75, length=3.8) # G1
add_arp(4.2, 11.8, bpm=126, amp=0.32)

# 8.0s - Scene 3 (Artwork 1): Bass impact + chord
add_sub_boom(8.0, amp=0.75)
add_braam(8.1, base_freq=43.65, amp=0.8, length=3.8) # F1
add_chord(8.2, 3.8, freqs=[174.61, 220.0, 261.63, 349.23], amp=0.35) # F chord

# 12.0s - Scene 4 (Artwork 2): Rising tension
add_sub_boom(12.0, amp=0.8)
add_braam(12.1, base_freq=49.0, amp=0.85, length=3.5) # G1
add_chord(12.1, 3.8, freqs=[196.0, 246.94, 293.66, 392.0], amp=0.4) # G chord
add_riser(12.5, 3.5, start_f=70.0, end_f=1600.0, amp=0.6) # SWELL into climax!

# 16.0s - Scene 5 (Climax! $ANSEM Token reveal): Massive drop!
add_sub_boom(16.0, amp=0.95)
add_braam(16.05, base_freq=55.0, amp=0.9, length=4.5) # A1
add_chord(16.1, 4.8, freqs=[220.0, 277.18, 329.63, 440.0, 554.37], amp=0.5) # A Maj/power
add_arp(16.2, 4.5, bpm=126, amp=0.28)

# Master limiting & writing
out_path = '/tmp/trailer_audio.wav'
with wave.open(out_path, 'w') as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SAMPLE_RATE)
    
    # Soft limiter
    max_val = max(max(abs(x) for x in left), max(abs(x) for x in right), 1.0)
    print(f"Peak amplitude before normalization: {max_val:.2f}")
    
    frames = bytearray()
    for i in range(TOTAL_SAMPLES):
        # Master volume fade out in last 1 second
        t = i / SAMPLE_RATE
        master_fade = 1.0
        if t > 21.0:
            master_fade = max(0.0, (22.0 - t) / 1.0)
            
        l_s = math.tanh(left[i] / max_val * 1.25) * 32000.0 * master_fade
        r_s = math.tanh(right[i] / max_val * 1.25) * 32000.0 * master_fade
        frames.extend(struct.pack('<hh', int(l_s), int(r_s)))
        
    f.writeframes(frames)

print(f"Audio rendered successfully to {out_path} ({len(frames)} bytes)")
