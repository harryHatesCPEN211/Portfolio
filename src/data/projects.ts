import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "piano-robot",
    title: "Piano-Playing Robot",
    year: 2026,
    shortDesc: "Motor driver PCB for a fully autonomous piano-playing robot.",
    description:
      "Designed and fabricated a custom motor driver daughterboard for an autonomous piano-playing robot. The board drives multiple DC motors with precise PWM control, integrates gate drivers, and handles power management for sustained performance.",
    tags: ["LTspice", "Altium Designer", "PCB Layout", "Power Electronics", "Gate Drivers"],
    image: "/images/projects/piano-robot.jpg",
    modelPath: "/models/motor-driver-pcb.glb",
    featured: true,
    problem:
      "The robot required precise, low-latency finger actuation across 88 keys. Off-the-shelf motor controllers lacked the form factor and electrical characteristics needed for the compact, high-torque actuator array.",
    approach:
      "Designed a custom 4-layer PCB in Altium Designer with dedicated gate driver ICs per motor channel. Simulated switching behavior in LTspice to optimize dead-time and minimize switching losses before layout.",
    outcome:
      "Delivered a board with sub-2ms actuation latency, clean gate waveforms, and zero thermal runaway across a 30-minute continuous play session.",
    links: [],
  },
  {
    slug: "hapticbot",
    title: "HapticBot — Educational Haptic Knob",
    year: 2025,
    shortDesc: "Force-feedback haptic interface built around a BLDC motor and ESP32.",
    description:
      "Built a precision haptic knob device using a brushless DC motor as both actuator and sensor. The ESP32 runs real-time field-oriented control (FOC) to simulate detents, clicks, and resistance profiles with high fidelity.",
    tags: ["Altium", "4-Layer PCB", "BLDC Motor", "ESP32", "Embedded C", "FOC"],
    image: "/images/projects/hapticbot.jpg",
    featured: false,
    problem:
      "Existing haptic input devices are either too expensive or too low-resolution for educational robotics feedback. Needed a sub-$30 BOM that could simulate realistic force profiles.",
    approach:
      "Selected a gimbal BLDC motor for its low back-EMF and high pole count. Implemented SimpleFOC library on ESP32 with a custom PCB integrating the driver, magnetic encoder, and USB-C power in 60×60mm.",
    outcome:
      "Achieved 12-bit position resolution with 200Hz update rate. Demonstrated 5 distinct haptic profiles at a robotics showcase, received best hardware award.",
  },
  {
    slug: "coin-robot",
    title: "Autonomous Coin-Picking Robot",
    year: 2025,
    shortDesc: "Microcontroller-driven robot that autonomously detects and collects coins.",
    description:
      "Programmed an ATMEGA328P-based robot to autonomously navigate, detect coins via IR reflectance sensors, and actuate a collection mechanism using PWM-controlled servos.",
    tags: ["C Programming", "ATMEGA328P", "Analog Circuit Design", "PWM Control", "Sensors"],
    image: "/images/projects/coin-robot.jpg",
    featured: false,
    problem:
      "The robot needed to traverse an unknown arena, distinguish coins from floor markings using reflectance, and collect them within a 2-minute time limit.",
    approach:
      "Wrote bare-metal C for all subsystems — sensor ADC polling, PID-tuned motor control, and a finite state machine for the collection sequence. Designed custom analog signal conditioning for the IR array.",
    outcome:
      "Achieved 94% coin retrieval rate in final competition. Placed 2nd overall in a class of 24 teams.",
  },
  {
    slug: "reflow-oven",
    title: "Microcontroller-Controlled Reflow Oven",
    year: 2025,
    shortDesc: "ARM Assembly firmware for a PID-controlled SMD reflow oven.",
    description:
      "Wrote ARM Assembly firmware for an N76E003 microcontroller to implement a PID temperature controller for a repurposed toaster oven. The system follows a standard solder reflow thermal profile.",
    tags: ["ARM Assembly", "Finite State Machines", "Embedded Systems", "N76E003 MCU", "PID Control"],
    image: "/images/projects/reflow-oven.jpg",
    featured: false,
    problem:
      "Commercial reflow ovens cost $300+. Needed a reliable SMD soldering solution on a student budget, with accurate temperature profiling for lead-free solder paste.",
    approach:
      "Programmed the entire control stack in ARM Assembly — timer configuration, thermocouple ADC sampling, PID computation, and SSR control. Implemented a 4-state FSM (preheat → soak → reflow → cooldown).",
    outcome:
      "Achieved ±3°C accuracy against the IPC-7711 reflow profile. Successfully reflowed two production boards without any cold joints or component damage.",
  },
];

export const featuredProject = projects.find((p) => p.featured)!;
export const gridProjects = projects.filter((p) => !p.featured);
