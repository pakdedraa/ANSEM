#!/usr/bin/env python3
"""
Trailer Generator for $ANSEM — Father of the Dog
Creates a 1080p cinematic trailer with synthesized custom soundtrack,
Ken Burns motion on authentic assets, dynamic typography, and transitions.
Outputs to: public/ansem_trailer.mp4 (without modifying the web layout).
"""

import os
import sys
import math
import struct
import wave
import random
import subprocess

FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

AUDIO_PATH = "/tmp/trailer_audio.wav"
OUTPUT_MP4 = "public/ansem_trailer.mp4"
TMP_DIR = "/tmp/trailer_build"

CA_TEXT = "SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK"

def write_text(name, content):
    path = os.path.join(TMP_DIR, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path

def generate_audio():
    print(">>> 1/3 Generating cinematic synthesizer soundtrack...")
    sample_rate = 44100
    duration = 21.5
    total_samples = int(sample_rate * duration)
    
    left = [0.0] * total_samples
    right = [0.0] * total_samples

    def add_sample(idx, l_val, r_val):
        if 0 <= idx < total_samples:
            left[idx] += l_val
            right[idx] += r_val

    def add_sub_boom(start_s, amp=0.85):
        start_idx = int(start_s * sample_rate)
        dur = int(2.5 * sample_rate)
        for i in range(dur):
            t = i / sample_rate
            freq = 35.0 + 95.0 * math.exp(-t * 9.0)
            phase = 2.0 * math.pi * freq * t
            env = math.exp(-t * 2.0)
            v = math.sin(phase) * env * amp
            add_sample(start_idx + i, v, v)

    def add_braam(start_s, base_freq=55.0, amp=0.75, length=3.5):
        start_idx = int(start_s * sample_rate)
        dur = int(length * sample_rate)
        p1, p2, p3 = 0.0, 0.0, 0.0
        for i in range(dur):
            t = i / sample_rate
            pitch_mult = 1.0 + 0.45 * math.exp(-t * 14.0)
            f1 = base_freq * pitch_mult
            f2 = (base_freq * 1.012) * pitch_mult
            f3 = (base_freq * 0.5) * pitch_mult
            
            p1 += 2.0 * math.pi * f1 / sample_rate
            p2 += 2.0 * math.pi * f2 / sample_rate
            p3 += 2.0 * math.pi * f3 / sample_rate
            
            s1 = math.sin(p1) + 0.5 * math.sin(p1 * 2) + 0.25 * math.sin(p1 * 3)
            s2 = math.sin(p2) + 0.5 * math.sin(p2 * 2) + 0.25 * math.sin(p2 * 3)
            s3 = math.sin(p3)
            
            vl = math.tanh(s1 * 1.6 + s3 * 0.9)
            vr = math.tanh(s2 * 1.6 + s3 * 0.9)
            
            filter_env = math.exp(-t * 1.8) + 0.2 * math.exp(-t * 0.5)
            env = math.exp(-t * 1.1) * filter_env
            add_sample(start_idx + i, vl * env * amp, vr * env * amp)

    def add_drone(start_s, dur_s, freq=55.0, amp=0.25):
        start_idx = int(start_s * sample_rate)
        dur = int(dur_s * sample_rate)
        p1, p2 = 0.0, 0.0
        for i in range(dur):
            t = i / sample_rate
            lfo = 0.8 + 0.2 * math.sin(2.0 * math.pi * 0.25 * t)
            p1 += 2.0 * math.pi * (freq + 0.2 * math.sin(0.2 * t)) / sample_rate
            p2 += 2.0 * math.pi * (freq * 1.006) / sample_rate
            
            fade = 1.0
            if t < 1.0:
                fade = t / 1.0
            elif t > dur_s - 1.5:
                fade = max(0.0, (dur_s - t) / 1.5)
                
            vl = (math.sin(p1) + 0.4 * math.sin(p1 * 2)) * lfo * fade * amp
            vr = (math.sin(p2) + 0.4 * math.sin(p2 * 2)) * lfo * fade * amp
            add_sample(start_idx + i, vl, vr)

    def add_arp(start_s, dur_s, bpm=124, amp=0.3):
        start_idx = int(start_s * sample_rate)
        notes = [220.0, 261.63, 329.63, 392.00, 440.0, 392.00, 329.63, 261.63]
        step_sec = 60.0 / (bpm * 4)
        total_steps = int(dur_s / step_sec)
        
        for s in range(total_steps):
            note_freq = notes[s % len(notes)]
            step_start = start_idx + int(s * step_sec * sample_rate)
            step_dur = int(step_sec * 0.88 * sample_rate)
            pan = 0.3 if (s % 2 == 0) else 0.7
            phase = 0.0
            for i in range(step_dur):
                if step_start + i >= total_samples:
                    break
                t = i / sample_rate
                phase += 2.0 * math.pi * note_freq / sample_rate
                env = math.exp(-t * 26.0)
                build = min(1.0, 0.3 + 0.7 * ((s * step_sec) / dur_s))
                v = math.sin(phase) * env * amp * build
                add_sample(step_start + i, v * (1.0 - pan), v * pan)

    def add_riser(start_s, dur_s, amp=0.6):
        start_idx = int(start_s * sample_rate)
        dur = int(dur_s * sample_rate)
        phase = 0.0
        for i in range(dur):
            t = i / dur
            freq = 70.0 * math.pow(1500.0 / 70.0, t)
            phase += 2.0 * math.pi * freq / sample_rate
            noise = (random.random() * 2.0 - 1.0) * 0.35 * (t * t)
            env = t * t
            v = (math.sin(phase) * 0.65 + noise) * env * amp
            add_sample(start_idx + i, v * 0.9, v * 1.1)

    def add_chord(start_s, dur_s, freqs=[220.0, 261.63, 329.63, 440.0], amp=0.4):
        start_idx = int(start_s * sample_rate)
        dur = int(dur_s * sample_rate)
        for i in range(dur):
            t = i / sample_rate
            fade = 1.0
            if t < 0.2:
                fade = t / 0.2
            elif t > dur_s - 1.5:
                fade = max(0.0, (dur_s - t) / 1.5)
            val = 0.0
            for idx, f in enumerate(freqs):
                detune = 1.0 + 0.0025 * (idx - 1.5)
                val += math.sin(2.0 * math.pi * f * detune * t)
            val = (val / len(freqs)) * fade * amp
            add_sample(start_idx + i, val * 0.95, val * 1.05)

    # Sequence Arrangement
    add_sub_boom(0.0, amp=0.85)
    add_braam(0.15, base_freq=55.0, amp=0.72, length=3.8)
    add_drone(0.0, 21.0, freq=55.0, amp=0.28)

    add_sub_boom(4.0, amp=0.8)
    add_braam(4.05, base_freq=49.0, amp=0.75, length=3.8)
    add_arp(4.1, 11.9, bpm=126, amp=0.3)

    add_sub_boom(8.0, amp=0.8)
    add_braam(8.05, base_freq=43.65, amp=0.8, length=3.8)
    add_chord(8.1, 3.8, freqs=[174.61, 220.0, 261.63, 349.23], amp=0.35)

    add_sub_boom(12.0, amp=0.85)
    add_braam(12.05, base_freq=49.0, amp=0.82, length=3.8)
    add_chord(12.1, 3.8, freqs=[196.0, 246.94, 293.66, 392.0], amp=0.4)
    add_riser(12.4, 3.6, amp=0.65)

    add_sub_boom(16.0, amp=0.98)
    add_braam(16.05, base_freq=55.0, amp=0.9, length=4.5)
    add_chord(16.1, 4.6, freqs=[220.0, 277.18, 329.63, 440.0, 554.37], amp=0.5)
    add_arp(16.15, 4.5, bpm=126, amp=0.28)

    max_val = max(max(abs(x) for x in left), max(abs(x) for x in right), 1.0)
    with wave.open(AUDIO_PATH, 'w') as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        frames = bytearray()
        for i in range(total_samples):
            t = i / sample_rate
            master_fade = 1.0
            if t > 20.5:
                master_fade = max(0.0, (21.5 - t) / 1.0)
            l_s = math.tanh(left[i] / max_val * 1.25) * 32000.0 * master_fade
            r_s = math.tanh(right[i] / max_val * 1.25) * 32000.0 * master_fade
            frames.extend(struct.pack('<hh', int(l_s), int(r_s)))
        f.writeframes(frames)
    print(f"Audio ready at {AUDIO_PATH}")

def run_cmd(cmd, desc=""):
    if desc:
        print(f"--> {desc}")
    res = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode != 0:
        print(f"Error running command: {cmd}\n{res.stderr.decode('utf-8', errors='ignore')}")
        sys.exit(1)

def render_scenes():
    os.makedirs(TMP_DIR, exist_ok=True)
    print(">>> 2/3 Preparing textual assets and rendering video scenes...")

    # Text files to bypass escaping issues
    t_s1_1 = write_text("t_s1_1.txt", "BEFORE THE TIMELINE CROWNED ITS MASCOTS...")
    t_s1_2 = write_text("t_s1_2.txt", "ONE FIGURE WALKED BESIDE THE PACK")
    
    t_s2_badge = write_text("t_s2_badge.txt", "OFFICIAL SOLANA MEME LORE")
    t_s2_title = write_text("t_s2_title.txt", "HE GAVE THE DOG HIS SHADES")
    
    t_s3_1 = write_text("t_s3_1.txt", "NO FAKE ROADMAPS.")
    t_s3_2 = write_text("t_s3_2.txt", "NO CORPORATE UTILITY.")
    t_s3_3 = write_text("t_s3_3.txt", "JUST PURE TIMELINE CULTURE.")
    t_s3_quote = write_text("t_s3_quote.txt", "\"Culture is not manufactured in a whitepaper.\"")
    
    t_s4_1 = write_text("t_s4_1.txt", "THE PACK PROTECTS THE FATHER")
    t_s4_2 = write_text("t_s4_2.txt", "AND THE FATHER LEADS THE PACK")
    
    t_s5_title = write_text("t_s5_title.txt", "$ANSEM")
    t_s5_sub = write_text("t_s5_sub.txt", "FATHER OF THE DOG")
    t_s5_label = write_text("t_s5_label.txt", "CONTRACT ADDRESS (SOLANA)")
    t_s5_ca = write_text("t_s5_ca.txt", CA_TEXT)
    t_s5_cta = write_text("t_s5_cta.txt", "OFFICIAL TOKEN MINT · DEXSCREENER · JUPITER · RAYDIUM")

    # Scene 1: Prologue (4.5s)
    s1_out = f"{TMP_DIR}/s1.mp4"
    cmd_s1 = (
        f'ffmpeg -y -f lavfi -i color=c=black:s=1920x1080:d=4.5:r=30 '
        f'-vf "'
        f'drawtext=fontfile={FONT_BOLD}:textfile={t_s1_1}:'
        f'fontsize=42:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-40:'
        f'alpha=\'if(lt(t,0.4),0,if(lt(t,1.2),(t-0.4)/0.8,if(lt(t,3.8),1,(4.5-t)/0.7)))\','
        f'drawtext=fontfile={FONT_MONO}:textfile={t_s1_2}:'
        f'fontsize=32:fontcolor=0x34d399:x=(w-text_w)/2:y=(h-text_h)/2+40:'
        f'alpha=\'if(lt(t,1.6),0,if(lt(t,2.4),(t-1.6)/0.8,if(lt(t,3.8),1,(4.5-t)/0.7)))\''
        f'" -c:v libx264 -pix_fmt yuv420p {s1_out}'
    )
    run_cmd(cmd_s1, "Scene 1: Prologue")

    # Scene 2: Banner (4.5s)
    s2_out = f"{TMP_DIR}/s2.mp4"
    cmd_s2 = (
        f'ffmpeg -y -loop 1 -i public/assets/ansem-banner.png -t 4.5 '
        f'-vf "'
        f'scale=2048:1152,zoompan=z=\'min(zoom+0.0008,1.08)\':d=135:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s=1920x1080:fps=30,'
        f'drawbox=y=0:h=120:color=black@0.7:t=fill,'
        f'drawbox=y=ih-150:h=150:color=black@0.75:t=fill,'
        f'drawtext=fontfile={FONT_MONO}:textfile={t_s2_badge}:'
        f'fontsize=26:fontcolor=0x34d399:x=(w-text_w)/2:y=45:alpha=\'if(lt(t,0.4),t/0.4,1)\','
        f'drawtext=fontfile={FONT_BOLD}:textfile={t_s2_title}:'
        f'fontsize=64:fontcolor=white:shadowcolor=black:shadowx=3:shadowy=3:x=(w-text_w)/2:y=h-115:alpha=\'if(lt(t,0.5),t/0.5,1)\''
        f'" -c:v libx264 -pix_fmt yuv420p {s2_out}'
    )
    run_cmd(cmd_s2, "Scene 2: Banner & Origin")

    # Scene 3: Artwork 1 (4.5s)
    s3_out = f"{TMP_DIR}/s3.mp4"
    cmd_s3 = (
        f'ffmpeg -y -loop 1 -i public/assets/ansem-artwork-1.png -t 4.5 '
        f'-vf "'
        f'scale=2160:2160,zoompan=z=\'min(zoom+0.0006,1.06)\':d=135:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s=1920x1080:fps=30,'
        f'drawbox=x=0:y=0:w=1120:h=ih:color=black@0.74:t=fill,'
        f'drawtext=fontfile={FONT_BOLD}:textfile={t_s3_1}:'
        f'fontsize=52:fontcolor=white:shadowcolor=black:shadowx=3:shadowy=3:x=120:y=340:alpha=\'if(lt(t,0.4),t/0.4,1)\','
        f'drawtext=fontfile={FONT_BOLD}:textfile={t_s3_2}:'
        f'fontsize=52:fontcolor=white:shadowcolor=black:shadowx=3:shadowy=3:x=120:y=420:alpha=\'if(lt(t,1.0),(t-0.6)/0.4,1)\','
        f'drawtext=fontfile={FONT_BOLD}:textfile={t_s3_3}:'
        f'fontsize=44:fontcolor=0x34d399:shadowcolor=black:shadowx=3:shadowy=3:x=120:y=510:alpha=\'if(lt(t,1.6),(t-1.2)/0.4,1)\','
        f'drawtext=fontfile={FONT_MONO}:textfile={t_s3_quote}:'
        f'fontsize=26:fontcolor=0xd4d4d4:x=120:y=620:alpha=\'if(lt(t,2.2),(t-1.8)/0.4,1)\''
        f'" -c:v libx264 -pix_fmt yuv420p {s3_out}'
    )
    run_cmd(cmd_s3, "Scene 3: Artwork 1 & Creed")

    # Scene 4: Artwork 2 (4.5s)
    s4_out = f"{TMP_DIR}/s4.mp4"
    cmd_s4 = (
        f'ffmpeg -y -loop 1 -i public/assets/ansem-artwork-2.png -t 4.5 '
        f'-vf "'
        f'scale=2160:2160,zoompan=z=\'min(zoom+0.0007,1.07)\':d=135:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s=1920x1080:fps=30,'
        f'drawbox=y=ih-260:h=260:color=black@0.78:t=fill,'
        f'drawtext=fontfile={FONT_BOLD}:textfile={t_s4_1}:'
        f'fontsize=54:fontcolor=white:shadowcolor=black:shadowx=3:shadowy=3:x=(w-text_w)/2:y=h-210:alpha=\'if(lt(t,0.5),t/0.5,1)\','
        f'drawtext=fontfile={FONT_BOLD}:textfile={t_s4_2}:'
        f'fontsize=40:fontcolor=0x34d399:shadowcolor=black:shadowx=3:shadowy=3:x=(w-text_w)/2:y=h-130:alpha=\'if(lt(t,1.2),(t-0.7)/0.5,1)\''
        f'" -c:v libx264 -pix_fmt yuv420p {s4_out}'
    )
    run_cmd(cmd_s4, "Scene 4: Artwork 2 & Pack")

    # Scene 5: Climax ($ANSEM Token Genesis) (5.5s)
    s5_out = f"{TMP_DIR}/s5.mp4"
    cmd_s5 = (
        f'ffmpeg -y -f lavfi -i color=c=black:s=1920x1080:d=5.5:r=30 '
        f'-loop 1 -i public/assets/ansem-logo.png -filter_complex "'
        f'[1:v]scale=230:312[logo];'
        f'[0:v][logo]overlay=(W-w)/2:120:shortest=1[bg_logo];'
        f'[bg_logo]drawtext=fontfile={FONT_BOLD}:textfile={t_s5_title}:'
        f'fontsize=100:fontcolor=white:shadowcolor=black:shadowx=4:shadowy=4:x=(w-text_w)/2:y=480,'
        f'drawtext=fontfile={FONT_BOLD}:textfile={t_s5_sub}:'
        f'fontsize=36:fontcolor=0xd4d4d4:shadowcolor=black:shadowx=2:shadowy=2:x=(w-text_w)/2:y=590,'
        f'drawbox=x=(iw-1100)/2:y=670:w=1100:h=90:color=white@0.08:t=fill,'
        f'drawbox=x=(iw-1100)/2:y=670:w=1100:h=90:color=white@0.25:t=1,'
        f'drawtext=fontfile={FONT_MONO}:textfile={t_s5_label}:'
        f'fontsize=18:fontcolor=0xa3a3a3:x=(w-text_w)/2:y=685,'
        f'drawtext=fontfile={FONT_MONO}:textfile={t_s5_ca}:'
        f'fontsize=24:fontcolor=0x34d399:x=(w-text_w)/2:y=718,'
        f'drawtext=fontfile={FONT_MONO}:textfile={t_s5_cta}:'
        f'fontsize=22:fontcolor=white:x=(w-text_w)/2:y=820:alpha=\'if(lt(t,4.5),1,(5.5-t)/1.0)\''
        f'" -c:v libx264 -pix_fmt yuv420p {s5_out}'
    )
    run_cmd(cmd_s5, "Scene 5: Climax & Token Card")

    print(">>> 3/3 Assembling trailer with cinematic transitions and audio track...")
    stitch_cmd = (
        f'ffmpeg -y '
        f'-i {s1_out} '
        f'-i {s2_out} '
        f'-i {s3_out} '
        f'-i {s4_out} '
        f'-i {s5_out} '
        f'-i {AUDIO_PATH} '
        f'-filter_complex "'
        f'[0:v][1:v]xfade=transition=fadeblack:duration=0.5:offset=4.0[v01];'
        f'[v01][2:v]xfade=transition=fadeblack:duration=0.5:offset=8.0[v02];'
        f'[v02][3:v]xfade=transition=fadeblack:duration=0.5:offset=12.0[v03];'
        f'[v03][4:v]xfade=transition=fadeblack:duration=0.5:offset=16.0[vfin]'
        f'" '
        f'-map "[vfin]" -map 5:a '
        f'-c:v libx264 -crf 19 -preset medium -c:a aac -b:a 256k '
        f'-pix_fmt yuv420p -movflags +faststart {OUTPUT_MP4}'
    )
    run_cmd(stitch_cmd, f"Stitching into {OUTPUT_MP4}")
    
    if os.path.exists(OUTPUT_MP4):
        size_mb = os.path.getsize(OUTPUT_MP4) / (1024 * 1024)
        print(f"SUCCESS! Trailer created at {OUTPUT_MP4} ({size_mb:.2f} MB)")
    else:
        print("Failed to produce output MP4!")
        sys.exit(1)

if __name__ == "__main__":
    generate_audio()
    render_scenes()
