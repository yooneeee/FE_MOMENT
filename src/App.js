import { Provider } from "react-redux";
import Router from "./shared/Router";
import { GlobalStyles } from "./styles/GlobalStyles";
import store from "./redux/config/configStore";

function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <Router />
    </Provider>
  );
}

export default App;
