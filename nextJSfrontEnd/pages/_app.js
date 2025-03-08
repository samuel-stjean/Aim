import "@/styles/globals.css";
import Footer from '../components/footer';
import BlankHeader from "@/components/blankheader";

export default function App({ Component, pageProps }) {
  return(<div className="page-container">
    <BlankHeader />
    <main className="content">
      <Component {...pageProps} />
    </main>
    <Footer />
  </div>) ;
}
