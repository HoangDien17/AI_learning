import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { getMatches } from '../api/client';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Matches() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await getMatches(userId);
        setData(result);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner message="AI is finding your best matches..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Could not load matches</h2>
        <p className="mt-2 text-gray-500">{error}</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link to={`/profile/${userId}`} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </Link>

        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary-500" fill="currentColor" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Your Matches</h1>
            <p className="text-gray-500">
              {data.matches.length} compatible {data.matches.length === 1 ? 'match' : 'matches'} found
            </p>
          </div>
        </div>

        {data.matches.length === 0 ? (
          <div className="mt-16 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-700">No matches yet</h3>
            <p className="mt-2 text-gray-500">More profiles are needed to find your ideal match. Check back soon!</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.matches.map((match, i) => (
              <MatchCard key={match.profile.id} match={match} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
