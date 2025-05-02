import { Link, useLocation } from "@remix-run/react";

export default function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                VideoAffiliateHub
              </Link>
            </div>
            <nav className="ml-6 flex items-center space-x-4">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 text-sm font-medium ${
                      location.pathname === "/admin"
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/campaigns/new"
                    className={`px-3 py-2 text-sm font-medium ${
                      location.pathname === "/admin/campaigns/new"
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    New Campaign
                  </Link>
                </>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center">
            {isAdmin ? (
              <Link
                to="/"
                className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                Exit Admin
              </Link>
            ) : (
              <Link
                to="/admin"
                className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
