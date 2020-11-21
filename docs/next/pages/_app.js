import "../styles/index.css";
import Layout from "../layouts/MainLayout";

function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout || ((page) => <Layout children={page} />);

  return getLayout(<Component {...pageProps} />);
}

export default App;
