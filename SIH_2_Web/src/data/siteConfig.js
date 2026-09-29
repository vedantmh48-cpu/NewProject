// Update these values when the product name and release package are finalized.
export const siteConfig = {
  name: "OrbitSRM",
  version: "Coming soon",
  downloadUrl: "",
  githubUrl: "",
  releaseNotesUrl: "",
  installationGuideUrl: "",
  // Add { title: 'Workspace', src: '/screenshots/workspace.png' } entries when real captures are available.
  screenshots: [],
};

export const technologies = [
  { name: "Python", status: "Planned" },
  { name: "PyTorch", status: "Planned" },
  { name: "FastAPI", status: "Planned" },
  { name: "React", status: "Website" },
  { name: "GDAL", status: "Planned" },
  { name: "Rasterio", status: "Planned" },
  { name: "MapLibre GL JS", status: "Planned" },
];

export const features = [
  [
    "Deep learning super-resolution",
    "Estimate finer spatial detail from medium-resolution imagery.",
    "Planned",
  ],
  [
    "Satellite image processing",
    "Prepare satellite raster imagery for a consistent analysis workflow.",
    "Planned",
  ],
  [
    "Geospatial visualization",
    "Explore image layers in a map-oriented workspace.",
    "Planned",
  ],
  [
    "Original vs enhanced",
    "Inspect source and generated imagery side by side.",
    "Planned",
  ],
  [
    "Image quality evaluation",
    "Review image quality measures alongside visual results.",
    "Planned",
  ],
  [
    "GeoTIFF export",
    "Prepare georeferenced outputs for downstream geospatial tools.",
    "Planned",
  ],
];

export const workflow = [
  "Satellite imagery",
  "Preprocessing",
  "Deep learning",
  "Geospatial reconstruction",
  "Evaluation",
  "Export",
];
export const requirements = [
  ["Operating system", "To be confirmed"],
  ["Memory (RAM)", "To be confirmed"],
  ["Storage", "To be confirmed"],
  ["GPU", "To be confirmed"],
  ["Input formats", "To be confirmed"],
];
export const faqs = [
  [
    "What is satellite super-resolution?",
    "It is a computational approach that estimates a higher-detail image from lower-resolution imagery. The added detail is model-generated, not newly captured satellite measurement.",
  ],
  [
    "Which satellite images are supported?",
    "Sentinel-2 is a potential input source. Supported sensors, bands, and file formats will be confirmed when the application is ready.",
  ],
  [
    "Does the application require an internet connection?",
    "Offline and online requirements have not yet been confirmed.",
  ],
  [
    "Can I export GeoTIFF files?",
    "GeoTIFF export is a planned capability; availability will be confirmed with the first release.",
  ],
  [
    "Does the software work on Windows?",
    "A Windows installer is planned. It is not available yet.",
  ],
  [
    "How accurate is the enhanced imagery?",
    "No validated accuracy figures are available yet. Generated details are estimates and should be interpreted accordingly.",
  ],
  [
    "How do I install the application?",
    "Installation instructions will be published alongside a release package.",
  ],
];
