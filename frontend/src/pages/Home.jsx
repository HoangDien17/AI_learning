import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Brain, Users, ArrowRight, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Advanced embeddings analyze personality, interests, and goals to find deeply compatible partners.',
  },
  {
    icon: Sparkles,
    title: 'Smart Explanations',
    description: 'Get AI-generated insights explaining why each match works — no more guessing.',
  },
  {
    icon: Shield,
    title: 'Multi-Dimensional Scoring',
    description: 'Compatibility is measured across personality, interests, location, and relationship goals.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Vector search delivers your top matches in seconds, ranked by true compatibility.',
  },
];

const steps = [
  { step: '01', title: 'Create Your Profile', desc: 'Tell us about yourself — your personality, interests, and what you\'re looking for.' },
  { step: '02', title: 'AI Analyzes You', desc: 'Our AI creates a deep understanding of who you are and what makes you unique.' },
  { step: '03', title: 'Get Your Matches', desc: 'Receive ranked matches with compatibility scores and personalized explanations.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-bg absolute inset-0 -skew-y-2 origin-top-left scale-110" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Powered by AI &amp; Vector Search
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find Your Perfect Match with{' '}
                <span className="underline decoration-white/40 underline-offset-4">AI</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                Our intelligent matchmaking engine uses deep learning embeddings to understand who you truly are — and connects you with people who complement your life.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  to="/create-profile"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-600 shadow-lg transition-transform hover:scale-105"
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/find-matches"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Find Matches
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why <span className="gradient-text">AI Matchmaker</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              We go beyond surface-level swiping. Our technology understands the deeper aspects of compatibility.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-3 text-primary-600 transition-colors group-hover:bg-primary-100">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">Three simple steps to finding your ideal partner.</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative rounded-2xl bg-white p-8 shadow-sm"
              >
                <span className="gradient-text text-5xl font-extrabold opacity-30">{s.step}</span>
                <h3 className="mt-2 text-xl font-bold text-gray-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-bg rounded-3xl px-8 py-16 shadow-xl"
          >
            <Heart className="mx-auto h-12 w-12 text-white/80" fill="currentColor" />
            <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
              Ready to Meet Your Match?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
              Create your profile today and let our AI find the people who truly fit your life.
            </p>
            <Link
              to="/create-profile"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-600 shadow-lg transition-transform hover:scale-105"
            >
              Create Your Profile <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
