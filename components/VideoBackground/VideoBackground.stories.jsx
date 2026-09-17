import { VideoBackground } from "./VideoBackground";

export default {
  title: "Layout/VideoBackground",
  component: VideoBackground,
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
  args: { name: "video-background-v2", behindNav: false },
};

export const Default = {
  render: (args) => (
    <div style={{ position: "relative", height: "100vh" }}>
      <VideoBackground {...args} />
    </div>
  ),
};
