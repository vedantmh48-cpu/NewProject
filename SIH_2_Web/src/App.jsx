import { useEffect } from "react";
import { useSceneTracker } from "./lib/hooks";
import { sceneIds } from "./data/journey";
import { siteConfig } from "./data/siteConfig";
import CustomCursor from "./components/CustomCursor";
import IntroSequence from "./components/IntroSequence";
import Navbar from "./components/Navbar";
import JourneyRail from "./components/JourneyRail";
import SiteFooter from "./components/SiteFooter";
import { BackToTop, PageProgress } from "./components/ui/Chrome";
import HeroScene from "./components/scenes/HeroScene";
import ProblemScene from "./components/scenes/ProblemScene";
import MissionScene from "./components/scenes/MissionScene";
import CapabilityScene from "./components/scenes/CapabilityScene";
import TransformScene from "./components/scenes/TransformScene";
import WorkflowScene from "./components/scenes/WorkflowScene";
import TechnologyScene from "./components/scenes/TechnologyScene";
import ApplicationScene from "./components/scenes/ApplicationScene";
import DownloadScene from "./components/scenes/DownloadScene";
import QuestionsScene from "./components/scenes/QuestionsScene";
import TeamScene from "./components/scenes/TeamScene";
import ContactSection from "./components/ContactSection";

/**
 * TerraSRM immersive scroll journey.
 *
 * Scene 1 Earth -> 2 project -> 3 AI mission -> 4 capabilities ->
 * 5 transformation -> 6 how it works -> 7 technology -> 8 application ->
 * 9 download -> 10 questions -> 11 team.
 * Every section id from the previous version is preserved, so existing anchors,
 * the application preview and the download content keep working.
 */
export default function App() {
  const { active, index, total } = useSceneTracker(sceneIds);

  useEffect(() => {
    document.title = `${siteConfig.name} — See Beyond the Resolution`;
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <CustomCursor />
      <IntroSequence />
      <PageProgress />
      <Navbar activeScene={active} sceneIndex={index} sceneTotal={total} />
      <JourneyRail activeScene={active} />
      <main id="main">
        <HeroScene />
        <ProblemScene />
        <MissionScene />
        <CapabilityScene />
        <TransformScene />
        <WorkflowScene />
        <TechnologyScene />
        <ApplicationScene />
        <DownloadScene />
        <QuestionsScene />
        <TeamScene />
        <ContactSection />
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
