import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Hardware",
    skills: [
      { name: "DC / BLDC Motors", level: 5 },
      { name: "ATMEGA328P", level: 5 },
      { name: "ESP32", level: 4 },
      { name: "N76E003 MCU", level: 4 },
      { name: "Oscilloscope & Signal Gen", level: 5 },
      { name: "SMT / THT Soldering", level: 5 },
      { name: "Power Electronics", level: 4 },
    ],
  },
  {
    name: "Programming",
    skills: [
      { name: "C / C++", level: 5 },
      { name: "ARM Assembly", level: 4 },
      { name: "Python", level: 4 },
      { name: "Java", level: 3 },
      { name: "Verilog", level: 3 },
      { name: "Embedded C (bare-metal)", level: 5 },
    ],
  },
  {
    name: "EDA Tools",
    skills: [
      { name: "Altium Designer", level: 5 },
      { name: "LTspice", level: 5 },
      { name: "MATLAB / Simulink", level: 4 },
      { name: "SolidWorks", level: 3 },
      { name: "KiCad", level: 3 },
    ],
  },
];
