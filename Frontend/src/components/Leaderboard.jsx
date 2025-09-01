// /src/components/Leaderboard.jsx
import React from "react";

import goldPng from "../assets/trophygold.png";
import silverPng from "../assets/trophysilver.png";
import bronzePng from "../assets/trophybronze.png";

// real badge icons
import grinderPng from "../assets/QuizGrinderBadge.png";
import thinkerPng from "../assets/QuizThinkerBadge.png";
import superBrainPng from "../assets/SuperBrainBadge.png";

// sample avatars
import bearPng    from "../assets/sampleAvatars/bear.png";
import catPng     from "../assets/sampleAvatars/cat.png";
import dogPng     from "../assets/sampleAvatars/dog.png";
import manPng     from "../assets/sampleAvatars/man.png";
import meerkatPng from "../assets/sampleAvatars/meerkat.png";
import pandaPng   from "../assets/sampleAvatars/panda.png";
import rabbitPng  from "../assets/sampleAvatars/rabbit.png";

// pick from this pool (wraps with modulo so it's easy to vary)
const AVATARS = [bearPng, catPng, dogPng, manPng, meerkatPng, pandaPng, rabbitPng];

// sizes
const TROPHY_SIZE = 55;
const BADGE_SIZE = 35; // change this to resize badges

// palette
const SURFACE     = "#0f141d";
const SURFACE_HDR = "#0b1118";
const ROW_DIVIDER = "#1a2130";
const HOVER_ROW   = "#131a20";
const RADIUS_PX   = 10;

// --------- tiny helpers ----------
const TrophyIcon = ({ src, alt, size }) => (
  <img src={src} alt={alt} width={size} height={size}
       style={{ width: size, height: size, display: "block", flexShrink: 0 }} />
);
const TrophyGold   = ({ size = TROPHY_SIZE }) => <TrophyIcon src={goldPng}   alt="Gold Trophy"   size={size} />;
const TrophySilver = ({ size = TROPHY_SIZE }) => <TrophyIcon src={silverPng} alt="Silver Trophy" size={size} />;
const TrophyBronze = ({ size = TROPHY_SIZE }) => <TrophyIcon src={bronzePng} alt="Bronze Trophy" size={size} />;

const Avatar = ({ src, alt, size = 56, className = "" }) => (
  <img
    src={src}
    alt={alt || "avatar"}
    style={{ width: size, height: size }}
    className={`rounded-full object-cover ${className}`}
  />
);

const Badge = ({ img, alt, count, size = BADGE_SIZE }) => (
  <div className="flex flex-col items-center gap-1">
    <img src={img} alt={alt} width={size} height={size}
         style={{ width: size, height: size, display: "block" }} />
    <span className="text-white/80 text-sm font-medium">{count}</span>
  </div>
);

// --------- card ----------
function LeaderCard({ user, trophy }) {
  return (
    <div
      className="p-6 flex-1 flex flex-col gap-4 shadow-md"
      style={{ backgroundColor: SURFACE, border: `1px solid ${SURFACE}`, borderRadius: `${RADIUS_PX}px` }}
    >
      {/* HEADER: avatar + name on the left, trophy on the right */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} alt={user.name} size={52} />
          <div className="text-white font-semibold text-lg leading-tight">{user.name}</div>
        </div>
        {trophy}
      </div>

      {/* MIDDLE: Level & Points centered with space */}
      <div className="mt-1">
        <div className="flex justify-center">
          <div className="flex items-end gap-8">
            <div className="text-center">
              <div className="text-white/60 text-xs uppercase tracking-wide">Level</div>
              <div className="text-white text-2xl font-bold leading-tight">{user.level}</div>
            </div>

            <div className="text-center">
              <div className="text-white/60 text-xs uppercase tracking-wide">Points</div>
              <div className="text-white text-2xl font-bold leading-tight">{user.points}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── divider between stats and badges (moved down + more visible) ── */}
      <div
        className="h-px mt-6 mb-2"
        style={{
          // soft glow line so it stands out on dark cards
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 100%)"
        }}
      />

      {/* BOTTOM: three REAL badges with counts */}
      <div className="grid grid-cols-3 gap-6 justify-items-center mt-2">
        <Badge img={grinderPng} alt="Quiz Grinder badge"   count={user.badges?.[0] ?? 0} />
        <Badge img={thinkerPng} alt="Quiz Thinker badge"   count={user.badges?.[1] ?? 0} />
        <Badge img={superBrainPng} alt="Super Brain badge" count={user.badges?.[2] ?? 0} />
      </div>
    </div>
  );
}

// --------- page ----------
export default function Leaderboard() {
  // Top 3 cards with avatars
  const top3 = [
    { name: "BabyKnight", avatar: AVATARS[0], level: 27, points: 43045, badges: [4, 7, 2] },
    { name: "Rootless",   avatar: AVATARS[1], level: 22, points: 38910, badges: [3, 6, 1] },
    { name: "Teodor2000", avatar: AVATARS[2], level: 19, points: 31200, badges: [2, 3, 5] },
  ];

  // Table rows with avatars (rotate through pool)
  const rest = [
    { place: 4, name: "Rens",      level: 18, points: 29850, badges: [1, 2, 0], avatar: AVATARS[3] },
    { place: 5, name: "Edwin",     level: 17, points: 28740, badges: [2, 1, 1], avatar: AVATARS[4] },
    { place: 6, name: "FlyWithMe", level: 14, points: 19890, badges: [0, 1, 3], avatar: AVATARS[5] },
    { place: 8, name: "BigBob007", level: 13, points: 17600, badges: [1, 0, 2], avatar: AVATARS[6] },
  ];

  return (
    <div className="space-y-8">
      <div className="h-4 md:h-6" aria-hidden />
      <div className="flex gap-6 mb-6 md:mb-7">
        <LeaderCard user={top3[0]} trophy={<TrophyGold />} />
        <LeaderCard user={top3[1]} trophy={<TrophySilver />} />
        <LeaderCard user={top3[2]} trophy={<TrophyBronze />} />
      </div>

      {/* Table */}
      <div
        className="overflow-hidden shadow-md"
        style={{ backgroundColor: SURFACE, border: `1px solid ${SURFACE}`, borderRadius: `${RADIUS_PX}px` }}
      >
        <table className="w-full text-left text-white/80 text-sm">
          <thead>
            <tr style={{ backgroundColor: SURFACE_HDR, color: "#fff" }}>
              <th className="px-4 py-3">Place</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Badges</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((r, i) => {
              const totalBadges = (r.badges || []).reduce((a, b) => a + b, 0);
              const avatarSrc = r.avatar || AVATARS[i % AVATARS.length];
              return (
                <tr
                  key={r.place}
                  className="transition-colors"
                  style={{ borderBottom: `1px solid ${ROW_DIVIDER}`, backgroundColor: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = HOVER_ROW)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-4 py-3 text-white">{r.place}</td>

                  {/* Username + avatar */}
                  <td className="px-4 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <Avatar src={avatarSrc} alt={r.name} size={32} />
                      <span>{r.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">{r.level}</td>
                  <td className="px-4 py-3">{r.points}</td>
                  <td className="px-4 py-3">{totalBadges}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
