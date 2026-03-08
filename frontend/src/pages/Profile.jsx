import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, MapPin, Briefcase, Heart, Brain, Compass, Target, Users, Search, Copy, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getProfile } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile(userId);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Profile not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const copyId = () => {
    navigator.clipboard.writeText(profile.id);
    setCopied(true);
    toast.success('Profile ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Profile Not Found</h2>
        <p className="mt-2 text-gray-500">{error}</p>
        <Link to="/create-profile" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">
          Create a Profile
        </Link>
      </div>
    );
  }

  const infoItems = [
    { icon: MapPin, label: 'Location', value: profile.location },
    { icon: Briefcase, label: 'Occupation', value: profile.occupation },
    { icon: Heart, label: 'Interests', value: profile.interests },
    { icon: Brain, label: 'Personality', value: profile.personality },
    { icon: Compass, label: 'Lifestyle', value: profile.lifestyle },
    { icon: Target, label: 'Relationship Goals', value: profile.relationship_goals },
    { icon: Users, label: 'Partner Preferences', value: profile.partner_preferences },
  ].filter((item) => item.value);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className="overflow-hidden rounded-2xl shadow-sm">
          <div className="gradient-bg px-6 pb-16 pt-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                <p className="text-white/80">{profile.age} years old &middot; {profile.gender}</p>
              </div>
            </div>
          </div>

          <div className="relative -mt-8 rounded-t-2xl bg-white px-6 pb-8 pt-8">
            {/* ID badge */}
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5">
              <span className="text-xs font-medium text-gray-400">Profile ID</span>
              <code className="flex-1 truncate text-xs text-gray-600">{profile.id}</code>
              <button onClick={copyId} className="text-gray-400 hover:text-gray-600 transition-colors">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Info grid */}
            <div className="space-y-5">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">{label}</p>
                    <p className="text-sm text-gray-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/matches/${profile.id}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                <Search className="h-4 w-4" />
                Find My Matches
              </Link>
              <Link
                to="/create-profile"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Create Another Profile
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
