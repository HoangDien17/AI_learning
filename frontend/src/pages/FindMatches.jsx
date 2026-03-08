import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function FindMatches() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = userId.trim();
    if (!UUID_REGEX.test(id)) {
      toast.error('Please enter a valid profile ID (UUID format)');
      return;
    }
    setLoading(true);
    navigate(`/matches/${id}`);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <Search className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Matches</h1>
          <p className="mt-2 text-gray-500">
            Enter your profile ID to discover AI-powered compatible matches.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <label className="block text-sm font-medium text-gray-700">Profile ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <p className="mt-2 text-xs text-gray-400">
            You receive your profile ID when you create a profile. You can also view it on your profile page.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Searching...
              </>
            ) : (
              <>
                Find Matches <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
