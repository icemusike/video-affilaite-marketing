import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Header from "~/components/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "VideoAffiliateHub - Seamlessly Combine Videos with Affiliate Links" },
    { name: "description", content: "Create beautiful landing pages that combine YouTube or Vimeo videos with your affiliate links." },
  ];
};

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Video + Affiliate Marketing</span>
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Create beautiful landing pages that combine YouTube or Vimeo videos with your affiliate links.
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/admin"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg"
                >
                  Go to Admin Panel
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">YouTube & Vimeo Support</h3>
                <p className="text-gray-600">
                  Easily embed videos from YouTube or Vimeo to engage your audience.
                </p>
              </div>
              
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">JVZoo Integration</h3>
                <p className="text-gray-600">
                  Seamlessly integrate your JVZoo affiliate links below your videos.
                </p>
              </div>
              
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Easy Admin Panel</h3>
                <p className="text-gray-600">
                  Manage all your campaigns from a simple, intuitive admin dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} VideoAffiliateHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
