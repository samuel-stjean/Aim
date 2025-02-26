import "@/styles/globals.css";
import Header from '../components/header';
import Footer from '../components/footer';

export default function App({ Component, pageProps }) {
  return(<div className="page-container">
    <Header />
    <main className="content">
      <Component {...pageProps} />
    </main>
    <Footer />
  </div>) ;
}
