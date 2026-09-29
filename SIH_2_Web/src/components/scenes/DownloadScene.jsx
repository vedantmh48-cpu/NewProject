import { ArrowRight, ArrowUpRight, Download, MonitorDown, Satellite } from "lucide-react";
import SceneShell from "../ui/SceneShell";
import { MagneticLink, Reveal, SectionHead } from "../ui/Primitives";
import { requirements, siteConfig } from "../../data/siteConfig";

/**
 * Scene 9 - the application download. The availability logic is unchanged: no
 * download URL is configured yet, so the card states that plainly and links are
 * only rendered when real URLs exist in siteConfig.
 */
export default function DownloadScene() {
  const ready = Boolean(siteConfig.downloadUrl);

  return (
    <SceneShell
      id="download"
      className="section download-section section-anchor"
      index={8}
      total={11}
      label="DOWNLOAD"
      tone="bright"
      bare
    >
      <div className="download-wash" />
      <div className="wrap download-wrap">
        <Reveal className="download-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> 09 / GET STARTED
          </div>
          <h2>
            Your Next
            <br />
            <em>Perspective</em>
            <br />
            Starts Here.
          </h2>
          <p>
            Get started with satellite image super-resolution. The first release
            is being prepared.
          </p>
          <div className="download-links">
            {siteConfig.releaseNotesUrl ? (
              <a href={siteConfig.releaseNotesUrl}>
                Release notes <ArrowUpRight size={14} />
              </a>
            ) : (
              <span>Release notes Â· coming soon</span>
            )}
            {siteConfig.installationGuideUrl ? (
              <a href={siteConfig.installationGuideUrl}>
                Installation guide <ArrowUpRight size={14} />
              </a>
            ) : (
              <span>Installation guide Â· coming soon</span>
            )}
          </div>
        </Reveal>
        <Reveal className="download-card" delay={0.1}>
          <div className="download-card-head">
            <span className="download-app-icon">
              <Satellite size={20} />
            </span>
            <span className="download-version">{siteConfig.version}</span>
          </div>
          <h3>{siteConfig.name}</h3>
          <p>Satellite image super-resolution desktop application</p>
          <div className="download-details">
            <span>
              <MonitorDown size={15} /> Windows
            </span>
            <span>File size Â· TBD</span>
          </div>
          <MagneticLink
            className={`button download-button ${ready ? "" : "disabled"}`}
            href={ready ? siteConfig.downloadUrl : undefined}
            aria-disabled={!ready}
            onClick={(event) => !ready && event.preventDefault()}
            data-cursor-label={ready ? "DOWNLOAD" : undefined}
          >
            {ready ? (
              <>
                <Download size={16} /> Download for Windows
              </>
            ) : (
              <>
                Coming soon <ArrowRight size={15} />
              </>
            )}
          </MagneticLink>
          <div className="download-status">
            <span className={ready ? "status-ready" : "status-dot"} />
            {ready
              ? "Release package available"
              : "Installer is not available yet"}
          </div>
        </Reveal>
      </div>

      <div className="wrap download-requirements req-layout">
        <SectionHead
          eyebrow="COMPATIBILITY"
          title={
            <>
              Know before
              <br />
              <em>you install.</em>
            </>
          }
          description="Final system requirements will be published with the first release."
        />
        <div className="req-list">
          {requirements.map(([label, value]) => (
            <div className="req-item" key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
