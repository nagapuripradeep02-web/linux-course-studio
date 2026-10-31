import React from "react";
import { Composition } from "remotion";
import { layout, Main } from "./Main";
import { Thumbnail } from "./Thumbnail";
import { FPS, H, W } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition id="Lesson" component={Main} durationInFrames={layout().total} fps={FPS} width={W} height={H} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);
