import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User, MapPin, Briefcase, Heart, Brain, Compass, Target, Users, ArrowRight, Loader2,
} from 'lucide-react';
import { createProfile } from '../api/client';

const genderOptions = ['male', 'female', 'non-binary', 'other'];

const initialForm = {
  name: '',
  age: '',
  gender: '',
  location: '',
  occupation: '',
  interests: '',
  personality: '',
  lifestyle: '',
  relationship_goals: '',
  partner_preferences: '',
};

const fields = [
  { name: 'name', label: 'Full Name', icon: User, placeholder: 'Alice Johnson', type: 'text' },
  { name: 'age', label: 'Age', icon: User, placeholder: '29', type: 'number', min: 18, max: 120 },
  { name: 'gender', label: 'Gender', icon: Users, type: 'select' },
  { name: 'location', label: 'Location', icon: MapPin, placeholder: 'San Francisco, CA', type: 'text' },
  { name: 'occupation', label: 'Occupation', icon: Briefcase, placeholder: 'Software Engineer', type: 'text' },
  { name: 'interests', label: 'Interests', icon: Heart, placeholder: 'hiking, traveling, reading, yoga', type: 'text', hint: 'Comma-separated list' },
  { name: 'personality', label: 'Personality', icon: Brain, placeholder: 'Curious, empathetic, and adventurous', type: 'textarea' },
  { name: 'lifestyle', label: 'Lifestyle', icon: Compass, placeholder: 'Active and health-conscious, enjoys weekends outdoors', type: 'textarea' },
  { name: 'relationship_goals', label: 'Relationship Goals', icon: Target, placeholder: 'Long-term relationship leading to marriage', type: 'textarea' },
  { name: 'partner_preferences', label: 'Partner Preferences', icon: Users, placeholder: 'Someone who values family, personal growth, and outdoor activities', type: 'textarea' },
];

export default function CreateProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.age || form.age < 18 || form.age > 120) errs.age = 'Age must be between 18 and 120';
    if (!form.gender) errs.gender = 'Please select a gender';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.interests.trim()) errs.interests = 'At least one interest is required';
    if (!form.personality.trim()) errs.personality = 'Personality description is required';
    if (!form.relationship_goals.trim()) errs.relationship_goals = 'Relationship goals are required';
    if (!form.partner_preferences.trim()) errs.partner_preferences = 'Partner preferences are required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the highlighted fields');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, age: Number(form.age) };
      const profile = await createProfile(payload);
      toast.success('Profile created successfully!');
      navigate(`/profile/${profile.id}`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const Icon = field.icon;
    const error = errors[field.name];
    const base = `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100
      ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'}`;

    const wrapper = (input) => (
      <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <Icon className="h-4 w-4 text-gray-400" />
          {field.label}
        </label>
        <div className="relative">
          <Icon className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          {input}
        </div>
        {field.hint && !error && <p className="mt-1 text-xs text-gray-400">{field.hint}</p>}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );

    if (field.type === 'select') {
      return wrapper(
        <select name={field.name} value={form[field.name]} onChange={handleChange} className={base}>
          <option value="">Select...</option>
          {genderOptions.map((g) => (
            <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return wrapper(
        <textarea
          name={field.name}
          value={form[field.name]}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows={3}
          className={base + ' resize-none'}
        />
      );
    }

    return wrapper(
      <input
        type={field.type}
        name={field.name}
        value={form[field.name]}
        onChange={handleChange}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        className={base}
      />
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Profile</h1>
          <p className="mt-2 text-gray-500">Tell us about yourself so our AI can find your best matches.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(renderField)}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                Create Profile <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
