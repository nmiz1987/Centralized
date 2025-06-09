import Link from 'next/link';

export function FooterLinks() {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Centralized</h3>
          <p className="text-sm text-gray-600">A modern list tracking tool built with Next.js.</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/features" className="link-animation text-sm text-gray-600">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="link-animation text-sm text-gray-600">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href={process.env.GITHUB_REPO!} target="_blank" rel="noopener noreferrer" className="link-animation text-sm text-gray-600">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t pt-8"></div>
    </>
  );
}
