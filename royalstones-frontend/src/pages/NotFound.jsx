import { Link } from 'react-router-dom';
import PageWrapper from '../util/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="min-h-screen flex items-start justify-center px-4 mt-20">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-4xl font-bold text-gray-800 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-4 mb-8">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}