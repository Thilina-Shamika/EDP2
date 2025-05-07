import Link from 'next/link';

const Navigation = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Buy', path: '/buy' },
    { name: 'Commercial', path: '/commercial' },
    { name: 'Off Plan', path: '/off-plan' },
    { name: 'Communities', path: '/communities' },
    { name: 'Media Center', path: '/media-center' },
    { name: 'List Your Property', path: '/list-property' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            EDProp
          </Link>
          
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="hover:text-gray-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <button className="md:hidden">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 