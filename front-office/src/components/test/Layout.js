import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, home }) {
  return (
    <div>
      {/*<Header />*/}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
