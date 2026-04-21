"""
Converts STEP files to GLB for use in the web viewer.
Preserves per-solid colours from the STEP file where available,
then falls back to sensible PCB defaults.

Usage:
    python scripts/convert-step-to-glb.py

Output:
    public/models/motor-driver.glb
    public/models/motherboard.glb
"""

import sys
import os
import trimesh
import numpy as np

JOBS = [
    {
        "input":  "public/models/Motor_driver.step",
        "output": "public/models/motor-driver.glb",
        "label":  "Motor Driver PCB",
    },
    {
        "input":  "public/models/motherboard.step",
        "output": "public/models/motherboard.glb",
        "label":  "Motherboard PCB",
    },
]

# Default PCB green (soldermask) for any mesh that has no colour
DEFAULT_COLOR = np.array([13, 92, 30, 255], dtype=np.uint8)   # #0d5c1e

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

for job in JOBS:
    inp, out, label = job["input"], job["output"], job["label"]
    print(f"\n-- {label} --------------------------")
    print(f"   Loading  {inp}")

    scene = trimesh.load(inp, force="scene")

    if not isinstance(scene, trimesh.Scene):
        scene = trimesh.scene.scene.Scene(geometry={"mesh": scene})

    print(f"   Meshes   {len(scene.geometry)}")

    # Apply default colour to any mesh that is colourless / all-white
    for name, mesh in scene.geometry.items():
        if not isinstance(mesh, trimesh.Trimesh):
            continue
        try:
            color_vis = mesh.visual.to_color()
            vc = np.array(color_vis.vertex_colors)
            # If every vertex is near-white (no STEP colour), apply default
            if vc[:, :3].mean() > 230:
                mesh.visual = trimesh.visual.ColorVisuals(
                    mesh=mesh, vertex_colors=DEFAULT_COLOR
                )
        except Exception:
            mesh.visual = trimesh.visual.ColorVisuals(
                mesh=mesh, vertex_colors=DEFAULT_COLOR
            )

    print(f"   Writing  {out}")
    scene.export(out)

    size_mb = os.path.getsize(out) / 1024 / 1024
    print(f"   Done     {size_mb:.2f} MB")

print("\nAll conversions complete.")
