import React from "react";
import { useRequest, notifications, Spinner, Box } from "rendition";
import { getRepo } from "./utils/github";
import { clean, cloneRepo, getRepoInfo } from "./utils/requests";
import { NodeProps, LinkProps } from "../server";
import { ResponsiveNetwork } from "@nivo/network";
// import data from "./utils/temp.json";

const App = () => {
  React.useEffect(() => {
    return () => {
      clean();
    };
  }, []);

  // TODO: Make this an input where the user can write repo owner and name
  const [data, loading] = useRequest(
    async () => {
      try {
        const repo = await getRepo("balena-io-modules", "rendition");
        await cloneRepo(repo.data.clone_url);
        return await getRepoInfo();
      } catch (err) {
        notifications.addNotification({
          content: (err as Error).message,
          type: "danger",
        });
      }
    },
    [],
    { polling: false }
  );

  console.log("*** data", data);

  return (
    <Box width="100vw" height="100vh">
      <Spinner show={loading || !data} width="100%" height="100%">
        {!!data && (
          <ResponsiveNetwork<NodeProps, LinkProps>
            data={{
              nodes: data.data.nodes,
              links: data.data.links,
            }}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            linkDistance={function (e) {
              return e.distance;
            }}
            centeringStrength={0.3}
            repulsivity={6}
            nodeSize={function (n) {
              return n.size;
            }}
            activeNodeSize={function (n) {
              return 1.5 * n.size;
            }}
            nodeBorderWidth={1}
            nodeBorderColor={{
              from: "color",
              modifiers: [["darker", 0.8]],
            }}
            linkBlendMode='multiply'
            motionConfig='wobbly'
          />
        )}
      </Spinner>
    </Box>
  );
};

export default App;
