import Link from 'next/link';

const BlankHeader = () => {
  return (
    <header className="header blank-header">
      <Link href="/" className="header-title">
        A.I.M. Bot
      </Link>

      {/* Empty navigation to maintain spacing */}
      <nav className="nav-links"></nav>
    </header>
  );
};

export default BlankHeader;
