import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import { components } from '../types/api-types';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Timeline from '../components/ideas/Timeline';
import FeedbackList from '../components/ideas/FeedbackList';

// Define a more complete shape for the data we expect from the API
type TrackedIdea = components['schemas']['Idea'] & {
  timeline: any[]; // Using 'any' as the specific type is not in the schema
  feedbacks: any[];
};

type FormData = {
  ideaId: string;
  email: string;
};

const TrackIdeaPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();

  const [ideaData, setIdeaData] = useState<TrackedIdea | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form from URL parameters on initial load
  useEffect(() => {
    setValue('ideaId', searchParams.get('id') || '');
    setValue('email', searchParams.get('email') || '');
  }, [searchParams, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setIdeaData(null);
    try {
      const response = await api.get<TrackedIdea>(`/ideas/${data.ideaId}/`, {
        params: { email: data.email },
      });
      setIdeaData(response.data);
      // Update URL params for shareability, but don't include email for privacy
      setSearchParams({ id: data.ideaId });
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        setError('Idea ID and email do not match. Please check your details and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-light min-h-screen">
      <div className="container mx-auto max-w-4xl py-12 px-6">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-deep-teal mb-2">Track Your Idea</h1>
            <p className="text-neutral">See the progress of your submission and read feedback.</p>
        </div>

        <Card className="mb-12 shadow-lift-md">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-full">
              <Input label="Idea Tracking ID" {...register('ideaId', { required: 'Idea ID is required' })} />
              {errors.ideaId && <p className="text-red-500 text-sm mt-1">{errors.ideaId.message}</p>}
            </div>
            <div className="w-full">
              <Input label="Your Submission Email" type="email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="pt-2 md:pt-4 w-full md:w-auto">
              <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">Track</Button>
            </div>
          </form>
        </Card>

        {isLoading && <div className="text-center py-10">Loading idea status...</div>}
        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}

        {ideaData && (
          <Card className="animate-fade-up bg-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-deep-teal">{ideaData.title}</h2>
                <p className="text-neutral mt-1">Status for ID: <span className="font-mono bg-gray-100 p-1 rounded">{ideaData.id}</span></p>
              </div>
              <Timeline timeline={ideaData.timeline} currentStageName={ideaData.stage} />
              <FeedbackList feedbacks={ideaData.feedbacks} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrackIdeaPage;
