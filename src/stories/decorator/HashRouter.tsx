import { HashRouter as Router } from "react-router-dom";

export const HashRouter = (storyFn: any) => {
  return <Router>{storyFn()}</Router>;
};
