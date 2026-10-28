import "./index.css";
import { Composition, Still } from "remotion";
import { Cover } from "./Caligula/Cover";
import { CaligulaVideo } from "./Caligula/Video";
import { FPS, TOTAL_FRAMES } from "./Caligula/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Block for the long 16:9 episode (no burned-in subtitles; see out/*.srt) */}
      <Composition
        id="Caligula-16x9"
        component={CaligulaVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ format: "landscape" as const, subtitles: false, sound: true }}
      />
      {/* Vertical clip for Shorts / Reels / TikTok, with subtitles */}
      <Composition
        id="Caligula-9x16"
        component={CaligulaVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ format: "vertical" as const, subtitles: true, sound: true }}
      />
      <Still id="Cover-16x9" component={Cover} width={1920} height={1080} defaultProps={{ format: "landscape" as const }} />
      <Still id="Cover-9x16" component={Cover} width={1080} height={1920} defaultProps={{ format: "vertical" as const }} />
    </>
  );
};
