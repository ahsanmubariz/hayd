# Design System

<!-- impeccable:design-schema 1 -->

## Visual World: Glazed Ceramic Sanctuary & Organic Lunar Rhythm

Hayd's interface is designed as an intimate, dignified sanctuary for menstrual tracking. Grounded in organic ceramic warmth and celestial rhythm, it rejects both patronizing pink-washed tropes and cold clinical grids.

### 1. Palette & Surface Tokens

- **Light Mode (Porcelain Glaze)**:
  - Background: `#FAF7F2` (Warm Glazed Porcelain)
  - Foreground: `#1C1917` (Deep Sumi Ink / Charcoal)
  - Card: `#FFFFFF` with `inset 0 1px 0 rgba(255,255,255,0.9)` glaze highlight
  - Border: `#EAE3D8`
  - Muted Surface: `#F3EDE4`
  - Muted Text: `#78716C`

- **Dark Mode (Smoked Obsidian Tea-Room)**:
  - Background: `#131211` (Deep Smoked Obsidian)
  - Foreground: `#EDE8E1` (Warm Bone / Parchment)
  - Card: `#1C1A18` with `inset 0 1px 0 rgba(255,255,255,0.06)` sheen
  - Border: `#2C2925`
  - Muted Surface: `#24211E`
  - Muted Text: `#A8A29E`

- **Biological Phase Accents**:
  - Menstrual / Bleeding: `#D94A3D` (Earthy Vermilion Lacquer) / Dark: `#E86356`
  - Follicular / Spotting: `#E8927C` (Glazed Rose Stone) / Dark: `#E09384`
  - Fertile Window & Ovulation: `#4E8771` (Celadon / Green Tea Glaze) / Dark: `#64A38B`
  - Luteal & Predictions: `#D48B38` (Smoked Ochre / Amber) / Dark: `#E29F4F`

### 2. Geometry & Tactile Language

- **Surfaces**: Soft 24px (`rounded-3xl`) and 16px (`rounded-2xl`) ceramic dishes with subtle top sheen and diffuse ambient drop shadow.
- **Pebble Chips**: Rounded-full interactive badges (`px-3 py-1.5`) with phase-tinted backgrounds and hairline borders.
- **Press Physics**: Micro-spring feedback (`active:scale-[0.98] transition-all duration-150`) on all interactive buttons and chips.
- **Browser Detailing**: Custom rounded scrollbars, vermilion text selection (`::selection`), and offset focus rings.

### 3. Key Domain Components

- **Cycle Disc (`CycleRing`)**:
  - Outer concentric orbit with dashed porcelain track.
  - Glowing gradient phase arc rendered via SVG linear gradients.
  - Inset center ceramic plate displaying large tabular cycle day and phase indicator pill.
- **Phase Timeline (`PhaseTimeline`)**:
  - Continuous pill-shaped progress track with color-coded biological milestones (Period, Fertile Window, Ovulation dot, and Today marker).
- **Calendar Matrix (`CalendarGrid`)**:
  - Tactile day cells with solid period markers, dashed prediction halos, and sage ovulation dots.
- **Floating Navigation Dock (`BottomNav`)**:
  - Floating bottom pill with frosted backdrop blur (`bg-card/90 backdrop-blur-md`), bespoke SVG icons, and glowing active dot indicator.
