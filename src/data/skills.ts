import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Software Tools",
    skills: [
      { name: "Altium Designer", level: 5 },
      { name: "LTspice",         level: 5 },
      { name: "MATLAB",          level: 4 },
      { name: "Simulink",        level: 4 },
      { name: "KiCad",           level: 3 },
      { name: "SolidWorks",      level: 3 },
      { name: "Visual Studio",   level: 3 },
      { name: "Microsoft Office", level: 4 },
    ],
  },
  {
    name: "Programming",
    skills: [
      { name: "C / C++",       level: 5 },
      { name: "Python",        level: 3 },
      { name: "ARM Assembly",  level: 2 },
      { name: "Java",          level: 3 },
      { name: "Verilog",       level: 2 },
    ],
  },
  {
    name: "Hardware",
    skills: [
      { name: "DC / BLDC Motors",       level: 5 },
      { name: "Microcontrollers",        level: 5 },
      { name: "Oscilloscope",            level: 5 },
      { name: "Signal Generator",        level: 5 },
      { name: "Multimeter",              level: 5 },
      { name: "SMT / THT Soldering",     level: 5 },
    ],
  },
];
