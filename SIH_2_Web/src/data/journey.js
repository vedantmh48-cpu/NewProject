/**
 * The scroll journey. Scene ids are also the page anchors, so the floating
 * navigation keeps linking to real sections that stay in the document.
 * `nav` labels appear in the navigation bar; every scene appears in the rail.
 */
export const scenes = [
  { id: "home", label: "The Earth", nav: "Home" },
  { id: "about", label: "The Problem", nav: "Project" },
  { id: "mission", label: "AI Mission", nav: "Mission" },
  { id: "features", label: "Capabilities", nav: "Features" },
  { id: "transform", label: "Transformation", nav: null },
  { id: "workflow", label: "How It Works", nav: null },
  { id: "technology", label: "Technology", nav: "Technology" },
  { id: "screenshots", label: "The Application", nav: "Screenshots" },
  { id: "download", label: "Download", nav: null },
  { id: "faq", label: "Questions", nav: null },
  { id: "team", label: "Meet the Team", nav: null },
];

export const sceneIds = scenes.map((scene) => scene.id);

export const navItems = scenes.filter((scene) => scene.nav);

export function sceneNumber(id) {
  const index = sceneIds.indexOf(id);
  return String((index < 0 ? 0 : index) + 1).padStart(2, "0");
}
