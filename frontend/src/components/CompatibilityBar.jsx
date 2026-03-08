import { motion } from 'framer-motion';

const colorForScore = (score) => {
  if (score >= 0.8) return 'bg-green-500';
  if (score >= 0.6) return 'bg-emerald-500';
  if (score >= 0.4) return 'bg-yellow-500';
  return 'bg-orange-500';
};

export default function CompatibilityBar({ score, label, className = '' }) {
  const pct = Math.round(score * 100);

  return (
    <div className={className}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
          <span>{label}</span>
          <span className="font-semibold text-gray-700">{pct}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className={`h-full rounded-full ${colorForScore(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
