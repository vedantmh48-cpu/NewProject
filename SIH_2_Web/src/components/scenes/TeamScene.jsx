import SceneShell from "../ui/SceneShell";
import { Reveal, SectionHead } from "../ui/Primitives";
import TeamMember, { TeamMemberPlaceholder } from "../team/TeamMember";
import { teamMembers } from "../../data/teamMembers";

export default function TeamScene() {
  return (
    <SceneShell
      id="team"
      className="section team-scene section-anchor"
      index={10}
      total={11}
      label="THE TEAM"
      tone="cool"
    >
      <div className="wrap">
        <SectionHead
          eyebrow="THE PEOPLE BEHIND ORBITSRM"
          title="Meet the minds behind the mission."
          description="Meet the team working on AI-powered satellite super-resolution and Earth observation."
          align="center"
        />
        <div className="team-grid" role="list">
          {teamMembers.length ? (
            teamMembers.map((member, index) => (
              <Reveal className="team-reveal" key={member.name} delay={index * 0.1}>
                <TeamMember member={member} />
              </Reveal>
            ))
          ) : (
            <Reveal className="team-reveal team-empty-reveal">
              <TeamMemberPlaceholder />
            </Reveal>
          )}
        </div>
      </div>
    </SceneShell>
  );
}
