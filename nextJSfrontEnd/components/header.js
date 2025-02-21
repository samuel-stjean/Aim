import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react'; // Correct import

const Header = () => {
  const router = useRouter();

  return (
    <header className="header">
      {/* Back Button (Icon Only) */}
      <button onClick={() => router.push('/')} className="back-button">
        <ArrowLeft size={24} /> {/* Left Arrow Icon */}
      </button>

      <Link href = "/" className='header-title'>
        A.I.M.
      </Link>

      {/* Navigation Links */}
      <nav className="nav-links">
        <Link href="/addIssue" className="nav-link">Add issue</Link>
        <Link href="/get-recommendation" className="nav-link">Get Recommmendation</Link>
        <Link href="/issues" className="nav-link">Issues</Link>
        <Link href = "/tickets" className = "nav-link">Tickets</Link>
        <Link href = "/" className = "nav-link"></Link>
      </nav>
    </header>
  );
};

export default Header;
