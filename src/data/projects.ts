import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "piano-robot",
    title: "Piano-Playing Robot",
    year: 2026,
    shortDesc: "Power architecture, motherboard, and motor driver for an autonomous cart-based piano-playing robot.",
    description:
      "Led systems engineering, power architecture, and custom PCB design for an autonomous piano-playing robot. The robot uses a single motorised cart that travels the length of the piano, carrying two solenoids — one for white keys, one for black — designed by a collaborator. My scope: the main motherboard (ESP32-S3 hub, power regulation, homing) and the motor driver daughterboard (H-bridge, gate drivers, encoder interface).",
    tags: ["Altium Designer", "ESP32-S3", "H-Bridge", "Gate Drivers", "Power Electronics", "PCB Layout"],
    image: "/images/projects/Robot_full.png",
    models: [
      { path: "/models/motor-driver.glb", label: "Motor Driver Daughterboard" },
      { path: "/models/motherboard.glb",  label: "Motherboard" },
    ],
    featured: true,
    problem:
      "The cart motor generates high PWM switching noise and large inductive kickback on the 24V rail. The solenoid daughterboards add 1–1.6A transient spikes per fire. Both couple directly into the same ground plane as the encoder lines and ESP32 logic — causing false encoder counts and MCU brownouts during early integration. A second problem: the H-bridge must be guaranteed off during the ESP32 boot sequence before any GPIO initialises.",
    approach:
      "Separated the system into two boards connected by a 24-pin bus. The motherboard owns logic: ESP32-S3, staged Traco DC-DC regulation (24V → 12V gate rail → 3.3V logic), homing switch with RC debounce, and pull-down safety on PWM lines. The motor driver daughterboard owns power: H-bridge MOSFETs, IR2184 gate drivers, bootstrap circuitry, and encoder header — keeping high-current paths physically away from sensitive signals. Star power routing on the motherboard isolates solenoid return current from logic ground.",
    outcome:
      "Zero ESP32 crashes after star-ground rework. Clean gate waveforms with no ringing. Boot-safe H-bridge confirmed. System ran sustained sessions without thermal issues or false encoder counts.",
    techSpecs: [
      { label: "Power Supply",        value: "VAYALT 24V 25A — 600W industrial SMPS" },
      { label: "Microcontroller",     value: "ESP32-S3-WROOM (Freenove dev board)" },
      { label: "Cart Motor",          value: "24V planetary gear motor, 19:1 reduction" },
      { label: "Solenoids",           value: "2 (white key + black key), 1–1.6A per fire" },
      { label: "MOSFETs",             value: "4× Toshiba TK100E10N1 N-channel (100V / 100A)" },
      { label: "Gate Drivers",        value: "Dual IR2184 half-bridge drivers" },
      { label: "Gate Resistors",      value: "10Ω per MOSFET — di/dt control" },
      { label: "Bootstrap Diodes",    value: "UF4007 fast-recovery + 10µF / 0.1µF cap banks" },
      { label: "Bulk Capacitance",    value: "1000µF across 24V H-bridge rail" },
      { label: "12V Rail",            value: "Traco TSR 2-24120 DC-DC module" },
      { label: "3.3V Rail",           value: "Traco TSR DC-DC module" },
      { label: "Board Interface",     value: "24-pin standardized data bus connector" },
      { label: "Wiring",              value: "18 AWG to heavy-duty PCB terminal blocks" },
    ],
    systemArchitecture:
      "Two-board split: the motherboard handles all logic (ESP32-S3, power regulation, homing, solenoid control signals, motor PWM), while the motor driver daughterboard handles all power (H-bridge, gate drivers, encoder feedback). They connect through a 24-pin bus that carries PWM commands down and encoder quadrature signals back up. Keeping the encoder lines on the motherboard side of the connector — away from the MOSFET switching node — was the key layout decision that eliminated false counts. Power follows a staged path: 24V main rail → 12V gate driver rail (Traco TSR 2-24120) → 3.3V logic rail (second Traco module). Star routing on the motherboard separates solenoid transient return current from the logic ground reference.",
    challenges: [
      {
        title: "Encoder signal isolation from PWM switching noise",
        detail:
          "The H-bridge switches at motor PWM frequency directly above the encoder traces. Routing encoder quadrature signals through the daughterboard would couple switching noise onto the lines and produce phantom counts. The 24-pin bus architecture places all encoder signal handling on the motherboard, physically separating it from the high-current switching node on the daughterboard.",
      },
      {
        title: "Solenoid transient brownouts",
        detail:
          "Each solenoid fire draws 1–1.6A in a short spike. With a shared ground plane, this induced enough ground bounce to crash the ESP32. Star power routing on the motherboard gives solenoid return current its own low-impedance path back to the supply, keeping it off the logic ground reference.",
      },
      {
        title: "Boot-state H-bridge lockout",
        detail:
          "10kΩ pull-down resistors on MOT_PWM_1 and MOT_PWM_2 hold the gate driver inputs low before the ESP32 initialises its GPIOs — making it physically impossible for the H-bridge to fire in an undefined boot state.",
      },
      {
        title: "Homing switch false triggers",
        detail:
          "Motor vibration coupled noise into the homing switch line, causing false position resets mid-run. A 2kΩ + 0.1µF RC low-pass filter on the MCU input pin provides hardware debouncing that survives full-speed motor operation.",
      },
      {
        title: "Gate switching ringing",
        detail:
          "Parasitic gate-loop inductance caused high-frequency ringing on the gate drive waveforms. 10Ω resistors on all four MOSFET gates limit di/dt and damp the oscillation, protecting gate oxide and reducing radiated EMI.",
      },
    ],
    gallery: [
      {
        type: "youtube",
        src: "https://www.youtube.com/embed/57-NtPN3RAc",
        caption: "Demo — Greensleeves",
        group: "Demo",
      },
      {
        type: "youtube",
        src: "https://www.youtube.com/embed/lCqeWlC3jUU",
        caption: "Demo — Imperial March",
        group: "Demo",
      },
      {
        type: "image",
        src: "/images/projects/Robot_full.png",
        caption: "Full system",
        group: "Build Photos",
      },
      {
        type: "image",
        src: "/images/projects/PCB_board_real_life.png",
        caption: "Boards mounted on cart",
        group: "Build Photos",
      },
      {
        type: "image",
        src: "/images/projects/motherboard_altium3D.png",
        caption: "Motherboard — Altium 3D",
        group: "Altium 3D",
      },
      {
        type: "image",
        src: "/images/projects/motordriver_altium_3d.png",
        caption: "Motor Driver — Altium 3D",
        group: "Altium 3D",
      },
      {
        type: "image",
        src: "/images/projects/motherbboard_schematic.png",
        caption: "Motherboard schematic",
        group: "Schematics",
      },
      {
        type: "image",
        src: "/images/projects/motordriver_schematic.png",
        caption: "Motor Driver schematic",
        group: "Schematics",
      },
      {
        type: "image",
        src: "/images/projects/Forward_motor_direction.png",
        caption: "H-Bridge Current Direction — Forward Operation",
        group: "LTspice Simulations",
      },
      {
        type: "image",
        src: "/images/projects/Screenshot 2026-04-19 163011.png",
        caption: "H-Bridge Current Direction — Reverse Operation",
        group: "LTspice Simulations",
      },
      {
        type: "image",
        src: "/images/projects/MOSFET_rise_fall_deadtiming.png",
        caption: "MOSFET Rise/Fall Time & Dead-Time — LTspice",
        group: "LTspice Simulations",
        wide: true,
      },
    ],
    pcbBoards: [
      {
        label: "Motherboard",
        details: [
          "97.5mm × 85mm · 35 components",
          "4-layer stackup: Top (signal) · Mid 1 (GND plane) · Mid 2 (24V plane) · Bottom (3V3 plane)",
          "Signal and 12V traces: 10–20mil",
          "All THT assembly — hand-soldered; no SMD reflow required",
        ],
      },
      {
        label: "Motor Driver Daughterboard",
        details: [
          "75.7mm × 79.8mm · 34 components · all through-hole (THT)",
          "4-layer stackup: Top (signal) · Mid 1 (GND plane) · Mid 2 (24V plane) · Bottom (12V polygon)",
          "Signal and 12V traces: 10–20mil · Motor phase traces: copper polygon pours for high-current capacity",
          "All THT assembly — hand-soldered; no SMD reflow required",
        ],
      },
    ],
    links: [],
  },
  {
    slug: "hapticbot",
    title: "Open Robotics Haptic Knob",
    year: 2025,
    shortDesc: "Custom PCB for a BLDC-driven haptic knob that physically simulates resistors, inductors, and capacitors through torque feedback — built for UBC Open Robotics.",
    description:
      "Collaborated with the hardware team at UBC Open Robotics (2025/2026) to design a haptic knob that makes electrical phenomena tangible — turn it and feel the physical behaviour of a resistor, inductor, or capacitor. The ESP32-S3 runs a closed-loop FOC algorithm that calculates a torque setpoint from a component model (e.g. V=IR) and drives a BLDC gimbal motor to produce that resistance through the knob. My scope: PCB design (schematic to layout), BOM, fabrication, assembly, and bring-up testing.",
    tags: ["Altium Designer", "ESP32-S3", "BLDC / FOC", "TMC6300", "Current Sensing", "PCB Layout", "JLCPCB"],
    image: "/images/projects/Haptic_Knob.png",
    imageFit: "contain",
    imageRight: "/images/projects/Open_Robotics.png",
    imageRightFit: "contain",
    featured: true,
    models: [
      { path: "/models/haptic-knob.glb", label: "Haptic Knob PCB — Rev 1" },
    ],
    gallery: [
      {
        type: "image",
        src: "/images/projects/haptic_knob_2d.png",
        caption: "PCB Layout 2D — Altium Designer",
        group: "Design",
        wide: true,
        objectFit: "contain",
      },
      {
        type: "image",
        src: "/images/projects/Haptic_Knob.png",
        caption: "Haptic Knob PCB — Rev 1",
        group: "Design",
        wide: true,
        objectFit: "contain",
      },
      {
        type: "image",
        src: "/images/projects/TOP_sheet.png",
        caption: "Schematic — Top Sheet",
        group: "Schematics",
        wide: true,
        objectFit: "contain",
      },
      {
        type: "image",
        src: "/images/projects/power.png",
        caption: "Schematic — Power",
        group: "Schematics",
      },
      {
        type: "image",
        src: "/images/projects/Motor_driver.png",
        caption: "Schematic — Motor Driver",
        group: "Schematics",
      },
      {
        type: "image",
        src: "/images/projects/Screenshot 2026-04-19 211907.png",
        caption: "Schematic — Microcontroller",
        group: "Schematics",
      },
      {
        type: "image",
        src: "/images/projects/current_sensor.png",
        caption: "Schematic — Current Sensors",
        group: "Schematics",
      },
      {
        type: "image",
        src: "/images/projects/encoder.png",
        caption: "Schematic — Encoder",
        group: "Schematics",
      },
      {
        type: "image",
        src: "/images/projects/ADC.png",
        caption: "Schematic — ADC",
        group: "Schematics",
      },
    ],
    problem:
      "The TMC6300 motor driver internally bridges phases U and V, ruling out low-side current sensing — the only architecture that gives the FOC loop visibility into all three phase currents is inline per-phase sensing. This meant three INA240A2PWR amplifiers and their analog signal chains had to coexist on a single board with a 30kHz switching driver, without coupling noise into the sense paths.",
    approach:
      "Chose the INA240A2PWR for its built-in PWM rejection (132dB CMRR) to keep current readings clean without extra filtering. Placed shunt resistors inline and close to the driver to minimise high-current loop area; routed differential sense traces parallel and equal-length to preserve CMRR. Used an AO3401A P-MOSFET for near-zero-drop reverse polarity protection, and 22Ω series resistors on all SPI/SSI lines to damp ringing. Firmware validates the encoder's 6-bit CRC every read, substituting the last valid angle on a bad frame.",
    outcome:
      "Rev 1 manufactured and assembled by JLCPCB. Bring-up test plan passed in full: power rails verified (ripple <20mV p-p), reverse polarity confirmed, motor driver logic levels checked, current sensor outputs cross-checked against ADC readings, encoder SSI waveforms verified on oscilloscope. Board is live and integrated with the FOC firmware.",
    techSpecs: [
      { label: "MCU",               value: "ESP32-S3-DevKitC-1-N8R8 — dual-core, 32MB flash, 16MB PSRAM" },
      { label: "FOC",               value: "Core 0 @ 1kHz current loop · Core 1 telemetry + watchdog · 6× PWM @ 30kHz" },
      { label: "Motor Driver",      value: "TMC6300-LA — 3-phase BLDC, QFN-20, 2–11V, max 2A" },
      { label: "Current Sensing",   value: "3× INA240A2PWR — 50V/V gain, 132dB CMRR, 12mΩ / 1W shunt per phase" },
      { label: "Encoder",           value: "MT6701CT-STD — Hall-effect, SSI, 14-bit absolute angle + CRC" },
      { label: "Power",             value: "9V barrel jack → 3A PTC fuse → AO3401A P-MOSFET → LM1085 LDO → 3.3V" },
    ],
    systemArchitecture:
      "ESP32-S3 Core 0 runs the 1kHz FOC loop — reading phase currents via SPI ADC and rotor position via SSI encoder, then outputting 6-channel 30kHz PWM to the TMC6300. The 9V rail feeds the motor driver directly; the LM1085 LDO supplies 3.3V to all logic and analog. RC anti-aliasing filters sit between the current sense amplifiers and the ADC inputs.",
    challenges: [
      {
        title: "Inline current sensing forced by TMC6300 phase bridging",
        detail:
          "The TMC6300 internally bridges phases U and V, so a single low-side shunt can't separate their currents. Inline per-phase sensing (one INA240A2PWR + 12mΩ shunt per phase) was the only architecture that gives the FOC loop independent visibility into all three currents.",
      },
      {
        title: "PWM noise into current sense amplifiers",
        detail:
          "The TMC6300 switches at 30kHz adjacent to the INA240 inputs. The INA240A2PWR's built-in PWM rejection suppresses the common-mode switching transients without additional filtering, keeping sense outputs clean enough for the 1kHz control loop.",
      },
      {
        title: "Encoder CRC fault recovery",
        detail:
          "A corrupt SSI frame fed straight into the FOC loop would cause a torque spike. Firmware validates the MT6701's 6-bit CRC on every read and silently holds the last valid angle on failure, keeping the haptic output stable.",
      },
      {
        title: "Reverse polarity protection without voltage drop",
        detail:
          "A Schottky diode would steal 0.3–0.5V from the LM1085's headroom. An AO3401A P-MOSFET in the high-side path gives near-zero drop under correct polarity; the body diode blocks reverse current instantly.",
      },
    ],
    pcbDetails: [
      "4-layer stackup: Top (signal + 9V/GND pours) · Mid 1 (GND plane) · Mid 2 (3.3V plane) · Bottom (GND plane)",
      "~181mm × 87mm · 94 components · 313 drill holes (302 plated)",
      "All SMD components on Top Layer only — single reflow pass",
      "Through-hole hand-soldered by the team post-arrival: barrel jack, motor screw terminals, fuse, ESP32 socket headers",
      "Key packages: QFN-20 (motor driver), TSSOP-8 (current sense amps), SOP-8 (encoder), SOIC-14 (ADC), 2512 (shunts — 1W dissipation)",
      "Signal traces 5–10mil · Motor phase traces (U/V/W, 2A): copper pours · Signal vias: 0.305mm drill",
      "Shunt resistors placed close to driver; differential sense traces routed parallel and equal-length",
      "Hierarchical schematic: 7 sheets — Top, Power, MCU, Motor Driver, Current Sensors, Encoder, ADC",
      "Gerber + BOM + pick-and-place file submitted to JLCPCB for SMT assembly",
    ],
    teamPhoto: "/images/projects/haptic_knob_team.JPG",
    teamCaption: "UBC Open Robotics, Haptic Knob Team — Top to bottom: Harry Nguyen (Hardware), Guanyu Zhu (Software), Jamie Kang (Software), Trieu Truong (Hardware), Andy Setiawan (Software), Patrick Delfin (Team lead, Hardware), Nami Maleki (Software, pictured)",
    diagram: "/models/03-04-26 Full System Block Diagram.drawio",
    links: [],
  },
  {
    slug: "coin-robot",
    title: "Autonomous Coin-Picking Robot",
    year: 2025,
    shortDesc: "Dual-MCU robot that autonomously detects, classifies, and picks up Canadian coins within a perimeter — built as a 5-person team for ELEC 291 at UBC.",
    description:
      "5-person team project for ELEC 291 (UBC), completed over ~300 hours across 3.5 weeks. Built a dual-mode coin-picking robot from the ground up: chassis, motor driver, metal detector, perimeter detector, wireless remote, and coin-picking mechanism. The robot runs autonomously within a 1m × 0.5m perimeter (auto mode) or responds to joystick commands over wireless radio (manual mode). Two different MCU families were required by the project spec — EFM8LB12 on the robot, ATMEGA328P on the remote.",
    tags: ["C Programming", "EFM8", "ATMEGA328P", "H-Bridge", "Colpitts Oscillator", "JDY-40 Radio", "Embedded Systems"],
    image: "/images/projects/coin_picking_robot_main.jpeg",
    imageRight: "/images/projects/coin_pikcing_robot_main2.jpeg",
    imageRightFit: "cover",
    featured: true,
    youtubeUrl: "https://www.youtube.com/embed/II_CpEMfbMk",
    galleryInline: true,
    gallery: [
      {
        type: "image",
        src: "/images/projects/coin_picking_robot_main.jpeg",
        caption: "Coin-Picking Robot — Group B08",
        group: "Build Photos",
        wide: true,
        natural: true,
      },
    ],
    problem:
      "Integrating metal detection (Colpitts oscillator frequency shift), perimeter awareness (AC field detection), per-coin frequency classification, and a physical pickup mechanism — all running on two different MCU families communicating over JDY-40 radio on battery power. A critical integration bug emerged: the radio command stream (e.g. \"!FN!FN!\") was intermittently parsed off-by-one, causing the robot to receive invalid partial commands and behave unpredictably during both manual and automatic operation.",
    approach:
      "Built and validated each subsystem independently before integration. Metal detector: Colpitts oscillator with discrete CMOS inverter, calibrated against all Canadian coin types to establish per-coin frequency-shift baselines. Perimeter detector: two peak-detector + LM358P op-amp circuits mounted perpendicular at the chassis front, referenced to the ~56600Hz ambient perimeter field. Motor driver: two discrete H-bridges (FQU13N06LTU N-MOS + FQU8P10 P-MOS) isolated from logic via LTV-847 optocouplers. Radio offset bug fixed by hardcoding the invalid partial command strings as recognised no-ops, preserving overall logic flow without restructuring the protocol. Added IR sensors as a perimeter failsafe in case of function generator failure or coil malfunction.",
    outcome:
      "18–19 out of 20 coins per run across 20 independent trials. 100% boundary detection. All Canadian coin types correctly classified. Placed 2nd in a class of 24 teams.",
    techSpecs: [
      { label: "Robot MCU",          value: "EFM8LB12 — PWM motor control, UART (JDY-40), analog perimeter inputs, digital metal detector input" },
      { label: "Remote MCU",         value: "ATMEGA328P — joystick ADC, LCD, speaker PWM, UART (JDY-40)" },
      { label: "Motor Driver",       value: "2× discrete H-bridge — FQU13N06LTU (N-MOS) + FQU8P10 (P-MOS), LTV-847 optocoupler isolation" },
      { label: "Metal Detector",     value: "Colpitts Oscillator + discrete CMOS inverter — frequency-shift detection per coin type" },
      { label: "Perimeter Detector", value: "Dual peak detector + LM358P op-amp — references ~56600Hz AC perimeter field" },
      { label: "Radio",              value: "JDY-40 pair — UART 9600 baud, 3.3V, '!' command header protocol" },
      { label: "Coin Picker",        value: "Electromagnet + 2× servo motors + basket — Timer5_ISR PWM (20ms period)" },
      { label: "Power (Robot)",      value: "4× AA (6V motors) → LM7805 (5V logic) → MCP1700 (3.3V radio)" },
      { label: "Power (Remote)",     value: "9V battery → LM7805 (5V) → MCP1700 (3.3V)" },
      { label: "Language",           value: "Bare-metal C on both MCUs" },
    ],
    systemArchitecture:
      "Two-board system: EFM8 on the robot handles all sensing and actuation (motor PWM, coin-picker servos, metal and perimeter detector reads); ATMEGA328P on the remote handles joystick ADC, LCD, and speaker. They communicate via JDY-40 radio at 9600 baud using a '!' header command protocol. In auto mode the EFM8 runs its own state loop — move forward by default, trigger back-and-turn on perimeter flag, classify and pick up on metal flag. In manual mode it relays joystick commands from the ATMEGA directly to move_robot().",
    challenges: [
      {
        title: "Radio command offset bug",
        detail:
          "The JDY-40 streams commands continuously (e.g. \"!FN!FN!\"). The EFM8 parser occasionally picked up mid-stream fragments like \"!F\" instead of the valid \"FN\", causing unpredictable movement. Fixed by explicitly hardcoding all known invalid partial commands as recognised but ignored instructions, keeping the protocol intact.",
      },
      {
        title: "Coin pickup reliability vs. detection accuracy",
        detail:
          "Coin detection via frequency shift was 100% reliable, but the hardcoded servo arm motion only achieved 80–90% successful pickup. The robot has no feedback on whether a pickup succeeded — every servo activation counts as an attempt toward the 20-coin limit regardless of outcome.",
      },
      {
        title: "Dual MCU family integration",
        detail:
          "The project spec required two different MCU families. Coordinating UART timing, command encoding, and mode-toggle handshaking (\"!TO\" → wait for \"!TD\"/\"!TF\") between the EFM8 and ATMEGA328P required careful protocol design to avoid race conditions during mode switches.",
      },
      {
        title: "Perimeter detector reliability",
        detail:
          "The perimeter detector relies on an externally generated AC field. If the function generator was accidentally switched off or the inductor coils malfunctioned, the robot lost all boundary awareness. Added IR sensors as a hardware failsafe that maintains perimeter containment independently of the AC field.",
      },
    ],
  },
  {
    slug: "reflow-oven",
    title: "Microcontroller-Controlled Reflow Oven",
    year: 2025,
    shortDesc: "Assembly-programmed EFM8 reflow oven controller with FSM-driven thermal profile, SSR power modulation, and real-time Python temperature plotting.",
    description:
      "A microcontroller-controlled reflow oven that investigates and executes all aspects of reflow soldering — design, hardware, firmware, testing, and application. The system solders SMD components onto PCBs hands-free by following a pre-programmed thermal profile: preheat → soak → reflow → cooldown. All firmware is written in 8051 Assembly on an EFM8 microcontroller, with real-time temperature validation via Python Matplotlib.\n\nThe oven measures temperatures from 25°C to 240°C with ±3°C accuracy. Four reflow parameters are fully customizable via pushbuttons — reflow temperature, reflow time, soak temperature, and soak time — with a dedicated start/stop button to initiate or abort the process at any time. The LCD displays the current reflow state, live oven temperature, and running time (both total elapsed and per-stage) throughout the process.\n\nThe system includes automatic abort logic: if the thermocouple is improperly placed or the oven fails to reach 50°C within the first 60 seconds, the process terminates safely.",
    tags: ["8051 Assembly", "EFM8", "Embedded Systems", "FSM", "SSR Control", "Python", "Discrete Circuit Design"],
    image: "/images/projects/oven.png",
    imageRight: "/images/projects/oven2.png",
    imageRightFit: "cover",
    featured: true,
    youtubeUrl: "https://www.youtube.com/embed/dOqIaySOhiM",
    galleryInline: true,
    gallery: [
      {
        type: "image",
        src: "/images/projects/oven.png",
        caption: "Reflow oven setup",
        group: "Build Photos",
      },
      {
        type: "image",
        src: "/images/projects/oven2.png",
        caption: "EFM8 controller board",
        group: "Build Photos",
      },
      {
        type: "image",
        src: "/images/projects/Python_plot_temperature_sensor_data.png",
        caption: "Python plot of thermal profile during Reflow operation",
        group: "Thermal Profile",
        objectFit: "contain",
      },
      {
        type: "image",
        src: "/images/projects/reflow_soldering_profile.png",
        caption: "Desired Reflow thermal profile",
        group: "Thermal Profile",
        objectFit: "contain",
      },
    ],
    problem:
      "Reflow soldering requires hitting exact temperatures at exact times — deviate from the thermal profile and components are damaged or joints are cold. Controlling an AC oven with a microcontroller means dealing with noisy thermocouple readings, a binary-output SSR, and all firmware logic constrained to 8051 Assembly with no floating-point hardware and a single timer interrupt already occupied by the buzzer.",
    approach:
      "Implemented a Finite State Machine in Assembly to sequence the reflow stages (idle → preheat → soak → reflow → cooldown → done). Temperature is read continuously from a thermocouple and compared against stage setpoints. The SSR is driven via an NFET with a protection diode — controlled by duty-cycle modulation rather than simple on/off switching for smoother temperature regulation. Five pushbuttons let the user adjust setpoints and stage durations before starting, displayed live on an LCD. Timer 0 drives a buzzer that plays an audio cue at each FSM state transition. A Python script reads the serial output and plots actual vs. target temperature in real time for validation.",
    outcome:
      "The FSM state-change bug — caused by confusing clear-bit and set-bit instructions in Assembly — was present at the lab demo but fixed shortly after. Every team member used their completed reflow oven to solder their own EFM8 board as the physical deliverable. The system successfully followed the reflow thermal profile and reflowed SMD components onto the board.",
    techSpecs: [
      { label: "MCU", value: "Silicon Labs EFM8LB1 (8051-based) — reflowed by each team member using their own oven" },
      { label: "Firmware language", value: "8051 Assembly (100%)" },
      { label: "Temperature sensor", value: "Type-K thermocouple — 25°C to 240°C, ±3°C accuracy" },
      { label: "Power switching", value: "NFET + protection diode → Solid State Relay (SSR) — duty-cycle modulated" },
      { label: "Display", value: "16×2 LCD — live temperature, stage, and profile progress" },
      { label: "User input", value: "5 pushbuttons — adjustable setpoints, stage durations, start/stop" },
      { label: "Audio feedback", value: "Buzzer/speaker — plays tone at each FSM state transition (Timer 0)" },
      { label: "Validation tooling", value: "Python serial reader + real-time temperature profile plot" },
      { label: "Reflow stages", value: "Idle → Preheat → Soak → Reflow → Cooldown → Done" },
      { label: "Abort conditions", value: "Improper thermocouple placement; oven fails to reach 50°C within 60 s" },
      { label: "Customizable parameters", value: "Reflow temp, reflow time, soak temp, soak time (via pushbuttons)" },
    ],
    challenges: [
      {
        title: "FSM state-change bug in Assembly",
        detail:
          "The FSM refused to transition between states during the lab demo. Root cause: a single-bit confusion between the 'clear bit' (CLR) and 'set bit' (SETB) instructions in the state flag logic — easy to overlook in Assembly where register manipulation is entirely manual. The bug was identified and fixed after the demo.",
      },
      {
        title: "Blocking melody vs. FSM responsiveness",
        detail:
          "A musical melody was programmed but couldn't be cleanly integrated — playing it halted all other FSM processes for the song's full duration. The blocking architecture of the tone generation routine conflicted with the real-time control loop. The solution was a single-beep cue on each state transition using the existing Timer 0 infrastructure, keeping the FSM responsive.",
      },
      {
        title: "Smooth power control with a binary SSR",
        detail:
          "An SSR is either fully on or fully off. Duty-cycle-based power modulation was implemented in Assembly: the SSR is toggled on for a fraction of each fixed time window proportional to heating demand, giving the effect of variable power delivery without a linear power stage.",
      },
      {
        title: "Single timer shared between timing and audio",
        detail:
          "The EFM8 interrupt was occupied by the call_speaker function, so Timer 0 could not also be used for FSM stage timing via interrupt. wait_1ms and wait_Xms functions were modified to integrate buzzer output inline — keeping audio feedback without adding a second interrupt source.",
      },
    ],
  },
];

export const featuredProject = projects.find((p) => p.featured)!;
export const gridProjects = projects.filter((p) => !p.featured);
