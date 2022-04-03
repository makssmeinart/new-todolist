import App from "./App";
import { ReduxStoreProvider } from "../stories/decorator/ReduxStoreProvider";
import { HashRouter } from "../stories/decorator/HashRouter";

export default {
  title: "App",
  component: App,
  decorators: [ReduxStoreProvider, HashRouter],
};

export const AppBaseExample = () => {
  return <App demo={false} />;
};
