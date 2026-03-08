import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  Heart,
  Sparkles,
  User,
  Target,
  MessageCircle,
} from 'lucide-react';
import CompatibilityBar from './CompatibilityBar';

export default function MatchCard({ match, index }) {
  const { profile, compatibility_score, embedding_similarity, shared_interests_score, location_score, relationship_goal_score, explanation } = match;
  const pct = Math.round(compatibility_score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* Score badge */}
      <div className="absolute right-4 top-4 z-10">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full text-white font-bold text-lg shadow-lg
          ${pct >= 80 ? 'gradient-bg' : pct >= 60 ? 'bg-emerald-500' : 'bg-yellow-500'}`}>
          {pct}%
        </div>
      </div>

      {/* Header */}
      <div className="gradient-bg px-6 pb-12 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{profile.name}</h3>
            <p className="text-sm text-white/80">{profile.age} years old &middot; {profile.gender}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative -mt-6 rounded-t-2xl bg-white px-6 pb-6 pt-6">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary-500" />
            <span>{profile.location}</span>
          </div>
          {profile.occupation && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary-500" />
              <span>{profile.occupation}</span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Heart className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
            <span>{profile.interests}</span>
          </div>
          <div className="flex items-start gap-2">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
            <span>{profile.relationship_goals}</span>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="mt-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Compatibility Breakdown</p>
          <CompatibilityBar score={embedding_similarity} label="Personality Match" />
          <CompatibilityBar score={shared_interests_score} label="Shared Interests" />
          <CompatibilityBar score={location_score} label="Location" />
          <CompatibilityBar score={relationship_goal_score} label="Relationship Goals" />
        </div>

        {/* AI Explanation */}
        {explanation && (
          <div className="mt-5 rounded-xl bg-accent-50 p-4">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-accent-700">
              <Sparkles className="h-3.5 w-3.5" />
              AI Insight
            </div>
            <p className="text-sm leading-relaxed text-accent-900">{explanation}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
