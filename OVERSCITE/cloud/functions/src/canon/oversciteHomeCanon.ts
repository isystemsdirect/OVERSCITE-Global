
export const OVERSCITE_HOME_CANON = {
  governance: {
    scope: "HOME_INSPECTION_ONLY",
    immutable: true,
  },
  inspection_structure: {
    metadata_required: [
      "inspector_id",
      "client_name",
      "property_address",
      "inspection_date",
      "weather_conditions",
      "occupancy_status",
      "utilities_status",
    ],
  },
  domains: {
    "RO": {
      "codePrefix": "RO",
      "required_fields": [
        {
          "key": "roof_covering_type",
          "type": "enum",
          "required": true,
          "allowed_values": ["Asphalt Shingles", "Metal", "Tile", "Wood", "Slate", "Other"],
          "description": "Primary type of roof covering material."
        },
        {
          "key": "viewed_from",
          "type": "enum",
          "required": true,
          "allowed_values": ["Walked on Roof", "Viewed from Eaves", "Viewed from Ground", "Not Visible"],
          "description": "Method used to inspect the roof."
        }
      ],
      "defect_categories": [
        "RO_GENERAL_DAMAGE",
        "RO_FLASHING_ISSUES",
        "RO_ROOF_PENETRATIONS",
        "RO_GUTTERS_DOWNSPOUTS"
      ],
      "limitations_field": "full_access_limitations",
      "inspection_method_if_applicable": "visual_inspection"
    }
  },
  ancillary_modules: {}
} as const;
