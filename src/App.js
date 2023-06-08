import { Provider } from "react-redux";
import Router from "./shared/Router";
import { GlobalStyles } from "./styles/GlobalStyles";
import store from "./redux/config/configStore";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export let persistor = persistStore(store);
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalStyles />
        <Router />
      </PersistGate>
    </Provider>
  );
}

export default App;
