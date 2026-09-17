import fs from 'fs';
import { execSync } from 'child_process';

const SVG_SOLO_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="100%" height="100%">
  <rect width="500" height="650" fill="#000000"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- PIXEL-ART STEPPED HAIR OUTER CONTOUR -->
    <path d="
      M 195 240
      L 175 235
      L 165 210
      L 165 190
      L 155 190
      L 155 170
      L 140 170
      L 140 150
      L 125 150
      L 125 130
      L 140 130
      L 140 110
      L 155 110
      L 155 90
      L 170 90
      L 170 75
      L 190 75
      L 190 60
      L 210 60
      L 210 50
      L 235 50
      L 235 40
      L 265 40
      L 265 50
      L 290 50
      L 290 60
      L 310 60
      L 310 75
      L 325 75
      L 325 95
      L 335 95
      L 335 120
      L 325 120
      L 325 145
      L 315 145
      L 315 175
      L 330 185
      L 345 220
      L 345 260
      L 360 300
      L 380 340
      L 410 390
      L 440 450
      L 460 520
      L 465 650
    " />

    <!-- INNER FOREHEAD & TEMPLE HAIRLINE -->
    <path d="
      M 185 145
      L 210 140
      L 235 140
      L 255 160
      L 260 175
      L 250 185
      L 245 205
    " />
    
    <!-- TEMPLE TO EAR CONTOUR -->
    <path d="
      M 285 165
      L 300 165
      L 300 195
      L 290 205
      L 275 205
    " />

    <!-- EAR DETAIL -->
    <path d="
      M 290 170
      L 305 175
      L 305 195
      L 295 205
      M 295 180
      L 300 185
      L 295 195
    " />

    <!-- FOREHEAD / BROW HIGHLIGHT -->
    <polygon points="190,155 235,150 220,165 185,165" fill="#FFFFFF" stroke="none" />
    
    <!-- EYEBROW & EYE -->
    <path d="M 180 175 L 225 170" stroke-width="6" />
    <polygon points="185,185 220,180 215,195 190,195" fill="#FFFFFF" stroke="none" />
    <!-- PUPIL -->
    <circle cx="202" cy="188" r="4" fill="#000000" stroke="none" />
    <!-- UNDER EYE SHADOW / CHEEK ACCENT -->
    <path d="M 180 200 L 210 198" stroke-width="3" />

    <!-- NOSE -->
    <path d="
      M 205 175
      L 215 220
      L 200 230
      L 220 232
      L 225 220
    " stroke-width="4.5" />

    <!-- CHEEK HIGHLIGHT GEOMETRIC BLOCK -->
    <polygon points="225,185 250,180 250,225 230,230" fill="#FFFFFF" stroke="none" />

    <!-- MOUTH & ICONIC CHARISMATIC SMIRK -->
    <path d="
      M 185 245
      Q 215 240 245 230
    " stroke-width="5" />
    
    <!-- WHITE TEETH GRIN (POLYGON) -->
    <polygon points="192,250 238,236 230,265 198,268" fill="#FFFFFF" stroke="none" />
    <!-- TEETH SEPARATOR LINE -->
    <path d="M 194,258 L 235,248" stroke="#000000" stroke-width="2.5" />

    <!-- LOWER LIP & CHIN -->
    <path d="M 200 275 L 230 270" stroke-width="4" />
    
    <!-- CHIN HIGHLIGHT -->
    <polygon points="210,290 225,288 220,305 212,305" fill="#FFFFFF" stroke="none" />

    <!-- JAWLINE & CHIN CONTOUR -->
    <path d="
      M 160 210
      L 185 255
      L 205 295
      L 225 305
      L 255 270
      L 285 230
    " stroke-width="5" />

    <!-- NECK & STERNOCLEIDOMASTOID -->
    <path d="
      M 225 315
      L 230 355
      M 275 245
      L 310 325
      M 255 335
      L 285 390
    " stroke-width="4.5" />

    <!-- T-SHIRT COLLAR -->
    <path d="
      M 210 365
      Q 260 355 315 330
    " stroke-width="6" />

    <!-- TORSO & SLEEVE SEAM -->
    <path d="
      M 195 385
      L 180 470
      L 170 550
      L 160 650
      M 315 330
      L 365 420
      L 380 500
      L 395 650
      M 270 425
      L 355 410
    " stroke-width="5" />
  </g>
</svg>`;

const SVG_FATHER_AND_DOG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <rect width="800" height="800" fill="#000000"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
    
    <!-- === ANSEM (CENTER / RIGHT) === -->
    <!-- PIXEL HAIR CONTOUR -->
    <path d="
      M 435 230
      L 415 225
      L 405 200
      L 405 180
      L 395 180
      L 395 160
      L 380 160
      L 380 140
      L 365 140
      L 365 120
      L 380 120
      L 380 100
      L 395 100
      L 395 80
      L 410 80
      L 410 65
      L 430 65
      L 430 50
      L 450 50
      L 450 40
      L 485 40
      L 485 50
      L 515 50
      L 515 65
      L 535 65
      L 535 80
      L 550 80
      L 550 100
      L 560 100
      L 560 125
      L 550 125
      L 550 150
      L 540 150
      L 540 180
      L 560 195
      L 580 235
      L 590 280
      L 610 330
      L 630 380
      L 660 450
      L 690 530
      L 715 630
      L 720 780
    " />

    <!-- INNER FOREHEAD & TEMPLE -->
    <path d="
      M 425 135
      L 450 130
      L 475 130
      L 495 150
      L 500 165
      L 490 175
      L 485 195
    " />
    
    <!-- EAR -->
    <path d="
      M 530 155
      L 545 160
      L 545 180
      L 535 190
      L 520 190
      M 535 165
      L 540 172
      L 535 180
    " />

    <!-- BROW HIGHLIGHT -->
    <polygon points="430,145 475,140 460,155 425,155" fill="#FFFFFF" stroke="none" />
    
    <!-- EYE & BROW -->
    <path d="M 420 165 L 465 160" stroke-width="6" />
    <polygon points="425,175 460,170 455,185 430,185" fill="#FFFFFF" stroke="none" />
    <circle cx="442" cy="178" r="4" fill="#000000" stroke="none" />

    <!-- NOSE -->
    <path d="
      M 445 165
      L 455 210
      L 440 220
      L 460 222
      L 465 210
    " stroke-width="4.5" />

    <!-- CHEEK HIGHLIGHT -->
    <polygon points="465,175 490,170 490,215 470,220" fill="#FFFFFF" stroke="none" />

    <!-- SMILING TEETH MOUTH -->
    <path d="M 425 235 Q 455 230 485 220" stroke-width="5" />
    <polygon points="432,240 478,226 470,255 438,258" fill="#FFFFFF" stroke="none" />
    <path d="M 434,248 L 475,238" stroke="#000000" stroke-width="2.5" />
    <path d="M 440 265 L 470 260" stroke-width="4" />

    <!-- JAWLINE -->
    <path d="
      M 400 200
      L 425 245
      L 445 285
      L 465 295
      L 495 260
      L 525 220
    " stroke-width="5" />

    <!-- NECK & COLLAR -->
    <path d="
      M 465 305 L 470 345
      M 515 235 L 550 315
      M 495 325 L 525 380
      M 450 355 Q 500 345 555 320
    " stroke-width="5" />

    <!-- T-SHIRT SLEEVE & BACK -->
    <path d="
      M 555 320 L 605 410 L 620 490 L 635 640
      M 510 415 L 595 400
    " stroke-width="5" />

    <!-- ANSEM'S ARM REACHING FORWARD AROUND THE DOG -->
    <path d="
      M 430 370
      L 370 440
      L 310 500
      L 260 550
      L 220 590
    " stroke-width="6" />

    <!-- ANSEM'S HAND / FINGERS ON THE DOG'S BACK -->
    <path d="
      M 220 570
      L 245 560
      L 270 568
      L 265 590
      L 235 595
      Z
    " fill="#000000" stroke="#FFFFFF" stroke-width="4.5" />
    <path d="
      M 205 585
      L 230 578
      L 255 585
      L 250 605
      L 220 610
      Z
    " fill="#000000" stroke="#FFFFFF" stroke-width="4.5" />
    <path d="
      M 190 605
      L 215 598
      L 240 605
      L 235 625
      L 205 630
      Z
    " fill="#000000" stroke="#FFFFFF" stroke-width="4.5" />
    <path d="
      M 180 625
      L 200 620
      L 225 628
      L 220 645
      L 195 650
      Z
    " fill="#000000" stroke="#FFFFFF" stroke-width="4.5" />

    <!-- === THE DOG WITH SUNGLASSES (BOTTOM / LEFT) === -->
    
    <!-- TOP OF DOG HEAD & FLOPPY EARS -->
    <path d="
      M 290 380
      L 320 370
      L 345 375
      L 370 390
      L 395 410
      L 420 440
      L 435 480
      L 440 520
      L 430 555
      L 410 570
    " stroke-width="5" />
    
    <!-- LEFT EAR -->
    <path d="
      M 290 380
      L 260 400
      L 240 430
      L 230 470
      L 235 510
      L 250 540
      L 280 560
    " stroke-width="5" />

    <!-- ICONIC SUNGLASSES -->
    <!-- LEFT LENS -->
    <polygon points="265,420 325,410 320,465 260,460" fill="#000000" stroke="#FFFFFF" stroke-width="5" />
    <!-- RIGHT LENS -->
    <polygon points="340,408 405,420 395,475 335,465" fill="#000000" stroke="#FFFFFF" stroke-width="5" />
    <!-- BRIDGE -->
    <path d="M 325 412 L 340 410" stroke-width="6" />

    <!-- SNOUT / MUZZLE -->
    <path d="
      M 330 470
      L 305 500
      L 310 525
      L 330 540
      L 370 540
      L 390 525
      L 395 500
      L 370 470
    " stroke-width="4.5" />
    
    <!-- DOG NOSE -->
    <polygon points="335,500 365,500 350,525" fill="#FFFFFF" stroke="none" />
    <circle cx="343" cy="510" r="3" fill="#000000" stroke="none" />
    <circle cx="357" cy="510" r="3" fill="#000000" stroke="none" />

    <!-- DOG MOUTH / JAW -->
    <path d="
      M 350 525 L 350 540
      M 335 535 Q 350 545 365 535
    " stroke-width="4" />

    <!-- FLUFFY JAGGED CHEST FUR (ELECTRIC TUFTS) -->
    <path d="
      M 280 560
      L 250 580
      L 275 600
      L 230 630
      L 265 645
      L 210 680
      L 250 700
      L 190 740
      L 240 760
      L 180 800
    " stroke-width="5" />

    <path d="
      M 400 560
      L 430 590
      L 390 620
      L 440 645
      L 380 680
      L 425 710
      L 360 750
      L 410 770
      L 340 800
    " stroke-width="5" />

    <!-- INNER FUR TEXTURE STROKES -->
    <polygon points="280,610 320,570 300,640" fill="#FFFFFF" stroke="none" />
    <polygon points="340,590 375,560 360,630" fill="#FFFFFF" stroke="none" />
    <polygon points="290,660 340,620 320,700" fill="#FFFFFF" stroke="none" />
    <polygon points="350,650 395,620 375,710" fill="#FFFFFF" stroke="none" />
    <polygon points="270,720 320,680 300,770" fill="#FFFFFF" stroke="none" />
    <polygon points="340,710 385,675 365,775" fill="#FFFFFF" stroke="none" />
  </g>
</svg>`;

const SVG_BULL_AND_DOG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 800" width="100%" height="100%">
  <rect width="900" height="800" fill="#000000"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
    
    <!-- === THE BULL (LEFT) === -->
    <!-- HORNS -->
    <path d="
      M 190 320
      C 150 300 90 270 70 230
      C 60 210 65 190 75 180
      C 85 195 105 240 180 270
    " stroke-width="6" fill="#000000" />
    
    <path d="
      M 300 310
      C 340 280 390 230 400 180
      C 405 160 395 155 380 165
      C 370 185 350 240 270 280
    " stroke-width="6" fill="#000000" />

    <!-- BULL FOREHEAD & BROW -->
    <path d="
      M 180 270
      L 225 285
      L 270 280
      L 290 330
      L 260 370
      L 210 375
      L 170 335
      Z
    " stroke-width="5" />

    <!-- BULL NOSE / SNOUT -->
    <path d="
      M 195 380
      L 155 420
      L 165 460
      L 215 470
      L 255 450
      L 250 410
      L 210 380
    " stroke-width="5" />
    
    <!-- NOSTRILS -->
    <ellipse cx="180" cy="445" rx="10" ry="14" fill="#FFFFFF" stroke="none" transform="rotate(-15 180 445)" />
    <ellipse cx="235" cy="440" rx="10" ry="14" fill="#FFFFFF" stroke="none" transform="rotate(15 235 440)" />

    <!-- BULL MUSCULAR CHEST & SHOULDERS -->
    <path d="
      M 165 465
      L 140 520
      L 185 590
      L 150 670
      L 190 750
      L 170 800
      M 255 450
      L 290 520
      L 260 610
      L 310 700
      L 280 800
    " stroke-width="5.5" />

    <!-- BULL GRAPHIC HIGHLIGHT CUTS -->
    <polygon points="200,310 240,310 220,350" fill="#FFFFFF" stroke="none" />
    <polygon points="150,370 175,355 165,395" fill="#FFFFFF" stroke="none" />
    <polygon points="170,520 210,490 190,570" fill="#FFFFFF" stroke="none" />
    <polygon points="230,510 265,490 250,560" fill="#FFFFFF" stroke="none" />
    <polygon points="180,610 220,580 200,680" fill="#FFFFFF" stroke="none" />

    <!-- === ANSEM (CENTER) === -->
    <!-- PIXEL HAIR -->
    <path d="
      M 535 230
      L 515 225
      L 505 200
      L 505 180
      L 495 180
      L 495 160
      L 480 160
      L 480 140
      L 465 140
      L 465 120
      L 480 120
      L 480 100
      L 495 100
      L 495 80
      L 510 80
      L 510 65
      L 530 65
      L 530 50
      L 550 50
      L 550 40
      L 585 40
      L 585 50
      L 615 50
      L 615 65
      L 635 65
      L 635 80
      L 650 80
      L 650 100
      L 660 100
      L 660 125
      L 650 125
      L 650 150
      L 640 150
      L 640 180
      L 660 195
      L 680 235
      L 690 280
      L 710 330
      L 730 380
      L 760 450
      L 790 530
      L 815 630
    " />

    <!-- ANSEM FACE & SMILE -->
    <polygon points="530,145 575,140 560,155 525,155" fill="#FFFFFF" stroke="none" />
    <path d="M 520 165 L 565 160" stroke-width="6" />
    <polygon points="525,175 560,170 555,185 530,185" fill="#FFFFFF" stroke="none" />
    <circle cx="542" cy="178" r="4" fill="#000000" stroke="none" />

    <path d="M 545 165 L 555 210 L 540 220 L 560 222 L 565 210" stroke-width="4.5" />
    <polygon points="565,175 590,170 590,215 570,220" fill="#FFFFFF" stroke="none" />

    <path d="M 525 235 Q 555 230 585 220" stroke-width="5" />
    <polygon points="532,240 578,226 570,255 538,258" fill="#FFFFFF" stroke="none" />
    <path d="M 534,248 L 575,238" stroke="#000000" stroke-width="2.5" />

    <!-- JAWLINE -->
    <path d="M 500 200 L 525 245 L 545 285 L 565 295 L 595 260 L 625 220" stroke-width="5" />
    <path d="M 550 355 Q 600 345 655 320" stroke-width="5" />

    <!-- === THE DOG WITH SUNGLASSES (BOTTOM RIGHT) === -->
    <polygon points="495,470 555,460 550,515 490,510" fill="#000000" stroke="#FFFFFF" stroke-width="5" />
    <polygon points="570,458 635,470 625,525 565,515" fill="#000000" stroke="#FFFFFF" stroke-width="5" />
    <path d="M 555 462 L 570 460" stroke-width="6" />

    <!-- DOG SNOUT & NOSE -->
    <polygon points="565,550 595,550 580,575" fill="#FFFFFF" stroke="none" />
    <circle cx="573" cy="560" r="3" fill="#000000" stroke="none" />
    <circle cx="587" cy="560" r="3" fill="#000000" stroke="none" />

    <!-- JAGGED CHEST FUR -->
    <polygon points="510,660 550,620 530,690" fill="#FFFFFF" stroke="none" />
    <polygon points="570,640 605,610 590,680" fill="#FFFFFF" stroke="none" />
    <polygon points="520,710 570,670 550,750" fill="#FFFFFF" stroke="none" />
    <polygon points="580,700 625,665 605,760" fill="#FFFFFF" stroke="none" />
    <path d="
      M 480 600 L 450 630 L 475 650 L 430 690 L 470 715 L 420 760 L 450 800
      M 630 600 L 660 630 L 620 660 L 670 685 L 610 720 L 655 750 L 600 800
    " stroke-width="5" />
  </g>
</svg>`;

const SVG_CINEMATIC_BANNER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
  <rect width="1600" height="900" fill="#000000"/>
  <!-- SUBTLE ATMOSPHERIC GRID -->
  <g stroke="#1A1A1A" stroke-width="1" opacity="0.4">
    <line x1="0" y1="150" x2="1600" y2="150"/>
    <line x1="0" y1="300" x2="1600" y2="300"/>
    <line x1="0" y1="450" x2="1600" y2="450"/>
    <line x1="0" y1="600" x2="1600" y2="600"/>
    <line x1="0" y1="750" x2="1600" y2="750"/>
    <line x1="200" y1="0" x2="200" y2="900"/>
    <line x1="400" y1="0" x2="400" y2="900"/>
    <line x1="600" y1="0" x2="600" y2="900"/>
    <line x1="800" y1="0" x2="800" y2="900"/>
    <line x1="1000" y1="0" x2="1000" y2="900"/>
    <line x1="1200" y1="0" x2="1200" y2="900"/>
    <line x1="1400" y1="0" x2="1400" y2="900"/>
  </g>

  <!-- AMBIENT RADIAL FOCUS -->
  <radialGradient id="bannerGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.08"/>
    <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.02"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
  </radialGradient>
  <circle cx="800" cy="450" r="500" fill="url(#bannerGlow)"/>

  <!-- CENTER ARTWORK GROUP (SCALED & POSITIONED) -->
  <g transform="translate(480, 80) scale(0.85)">
    ${SVG_FATHER_AND_DOG.replace(/<\/?svg[^>]*>/g, '').replace(/<rect width="800" height="800" fill="#000000"\/>/, '')}
  </g>
</svg>`;

// Write SVG files
fs.writeFileSync('public/assets/ansem-logo.svg', SVG_SOLO_LOGO);
fs.writeFileSync('public/assets/ansem-father-dog.svg', SVG_FATHER_AND_DOG);
fs.writeFileSync('public/assets/ansem-bull-dog.svg', SVG_BULL_AND_DOG);
fs.writeFileSync('public/assets/ansem-banner.svg', SVG_CINEMATIC_BANNER);

console.log("SVGs generated successfully!");

// Convert to high-res PNGs using ImageMagick
try {
  execSync('convert -background black -density 300 public/assets/ansem-logo.svg -resize 600x780 public/assets/ansem-logo.png');
  execSync('convert -background black -density 300 public/assets/ansem-father-dog.svg -resize 800x800 public/assets/ansem-father-dog.png');
  execSync('convert -background black -density 300 public/assets/ansem-bull-dog.svg -resize 900x800 public/assets/ansem-bull-dog.png');
  execSync('convert -background black -density 300 public/assets/ansem-banner.svg -resize 1600x900 public/assets/ansem-banner.png');
  console.log("PNGs converted successfully!");
} catch (err) {
  console.warn("Convert warning:", err.message);
}
