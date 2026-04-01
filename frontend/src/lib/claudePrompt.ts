export const FLOOR_PLAN_PROMPT = `
TASK: Convert this 2D floor plan sketch into structured JSON for 3D rendering.

STRICT REQUIREMENTS:
1. REMOVE ALL TEXT: No labels, numbers, or annotations in output
2. EXACT GEOMETRY: Wall positions must match the image precisely
3. TOP-DOWN ORTHOGRAPHIC: Pure top-down view data only
4. NO HALLUCINATION: Only include rooms and furniture clearly visible
5. VALID JSON ONLY: No markdown, no backticks, no explanation text outside the JSON

FURNITURE DETECTION:
- Rectangle with pillow shape → bed
- L-shape or rectangle in living area → sofa
- Circle or rectangle with chairs around → dining_table
- Counter shapes + fixtures → stove or sink
- Small rectangle + oval fixture → toilet + sink
- Large rectangle near wall in bathroom → bathtub
- Rectangle with monitor shape → desk

FLOOR MATERIALS:
- Living/bedroom areas → hardwood
- Kitchen/bathroom → tile
- Optional lounge areas → carpet

COORDINATE SYSTEM:
- All values in meters from origin (0,0,0)
- x = left to right, z = front to back, y = height (0 = floor)
- Keep building centered near origin

RETURN THIS EXACT JSON STRUCTURE:
{
  "rooms": [
    {
      "id": "room_1",
      "type": "bedroom",
      "label": "Master Bedroom",
      "position": { "x": 0, "y": 0, "z": 0 },
      "dimensions": { "width": 4.2, "height": 0.1, "depth": 3.8 },
      "floor_material": "hardwood",
      "wall_color": "#F5F5F0",
      "furniture": [
        {
          "type": "bed",
          "position": { "x": 1.0, "y": 0, "z": 1.5 },
          "rotation": 0,
          "dimensions": { "width": 1.6, "depth": 2.0 }
        }
      ]
    }
  ],
  "walls": [
    {
      "id": "wall_1",
      "start": { "x": 0, "z": 0 },
      "end": { "x": 4.2, "z": 0 },
      "height": 2.8,
      "thickness": 0.15
    }
  ],
  "doors": [
    {
      "id": "door_1",
      "wall_id": "wall_1",
      "position": { "x": 1.5, "z": 0 },
      "width": 0.9,
      "swing": "left"
    }
  ],
  "windows": [
    {
      "id": "win_1",
      "wall_id": "wall_1",
      "position": { "x": 2.8, "z": 0 },
      "width": 1.2,
      "height": 1.0,
      "sill_height": 0.9
    }
  ],
  "total_area_sqm": 85.4,
  "building_type": "residential",
  "estimated_scale": "1:50"
}
`
