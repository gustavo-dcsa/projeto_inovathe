import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import { BUSINESS_UNIT_CHOICES, CATEGORY_CHOICES } from '../constants/mock_choices'; // Using mock choices for now

// Define the validation schema with Zod
const ideaSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  full_name: z.string().min(2, 'Please enter your full name'),
  submitted_by_email: z.string().email('Please enter a valid email address'),
  submission_type: z.string(),
  business_unit: z.string().min(1, 'Please select a business unit'),
  idea_category: z.string().min(1, 'Please select a category'),
});

type IdeaFormInputs = z.infer<typeof ideaSchema>;

const SubmitIdeaPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<IdeaFormInputs>({
    resolver: zodResolver(ideaSchema),
  });

  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IdeaFormInputs> = async (data) => {
    setSubmissionError(null);
    setSuccessId(null);
    try {
      const response = await api.post('/ideas/', data);
      setSuccessId(response.data.id);
      reset();
    } catch (err) {
      setSubmissionError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  if (successId) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600">Success!</h1>
        <p className="mt-4">Your idea has been submitted. Please save your Idea ID to track its progress.</p>
        <p className="mt-2 font-mono bg-gray-200 p-2 inline-block"><strong>{successId}</strong></p>
        <button onClick={() => setSuccessId(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Submit Another Idea
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Submit a New Idea</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input id="title" {...register('title')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input id="full_name" {...register('full_name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>}
        </div>
        <div>
          <label htmlFor="submitted_by_email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="submitted_by_email" type="email" {...register('submitted_by_email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          {errors.submitted_by_email && <p className="text-sm text-red-600 mt-1">{errors.submitted_by_email.message}</p>}
        </div>

        {/* Example of select inputs */}
        <div>
          <label htmlFor="business_unit" className="block text-sm font-medium text-gray-700">Business Unit</label>
          <select id="business_unit" {...register('business_unit')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Select a unit...</option>
            {BUSINESS_UNIT_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {errors.business_unit && <p className="text-sm text-red-600 mt-1">{errors.business_unit.message}</p>}
        </div>
        <div>
          <label htmlFor="idea_category" className="block text-sm font-medium text-gray-700">Category</label>
          <select id="idea_category" {...register('idea_category')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Select a category...</option>
            {CATEGORY_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {errors.idea_category && <p className="text-sm text-red-600 mt-1">{errors.idea_category.message}</p>}
        </div>


        {submissionError && <p className="text-red-500">{submissionError}</p>}
        <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
          {isSubmitting ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>
    </div>
  );
};

export default SubmitIdeaPage;
