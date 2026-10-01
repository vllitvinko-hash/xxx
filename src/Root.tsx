import "./index.css";
import { Composition, Still } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { AnalyticPro } from "./AnalyticPro/AnalyticPro";
import { CoverA, CoverB } from "./Story/Cover";
import { STORY_DURATION, Story } from "./Story/Story";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Обложки для Reels / VK Клипов */}
      <Still id="CoverA" component={CoverA} width={1080} height={1920} />
      <Still id="CoverB" component={CoverB} width={1080} height={1920} />

      {/* Сценарий «Пиво без чипсов»: 1080×1920, ~63 сек */}
      <Composition
        id="Story"
        component={Story}
        durationInFrames={STORY_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Вертикальный ролик для смартфона: 1080×1920, 30 сек */}
      <Composition
        id="AnalyticPro"
        component={AnalyticPro}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoColor1: "#91dAE2",
          logoColor2: "#86A8E7",
        }}
      />
    </>
  );
};
