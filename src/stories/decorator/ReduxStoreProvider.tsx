import {Provider} from "react-redux";
import {store} from "../../app/store";

export const ReduxStoreProvider = (storyFn: any) => {
    return <Provider store={store} >{storyFn()}</Provider>
}