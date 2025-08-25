import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/api';
import { components } from '../types/api-types';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Link } from 'react-router-dom';

// Define the Zod schema based on the brief and API schema
const ideaSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
  description: z.string().min(30, 'Description must be at least 30 characters long.'),
  full_name: z.string().min(3, 'Please enter your full name.'),
  submitted_by_email: z.string().email('Please enter a valid email address.'),
  idea_category: z.string().min(1, "Please select a category."),
  // Add other fields from the brief as needed
});

type IdeaFormData = z.infer<typeof ideaSchema>;

const DRAFT_KEY = 'ib_draft_v1';

const SubmitIdeaPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIdeaId, setSubmittedIdeaId] = useState<string | null>(null);

  // Load draft from localStorage
  const defaultValues = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');

  const methods = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues,
  });

  const { handleSubmit, watch, trigger, formState: { errors } } = methods;

  // Save draft to localStorage on change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: IdeaFormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.post<components['schemas']['Idea']>('/ideas/', data);
      setSubmittedIdeaId(response.data.id);
      localStorage.removeItem(DRAFT_KEY);
      methods.reset(); // Clear form
    } catch (error) {
      console.error('Submission failed:', error);
      // Here you would show an error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof IdeaFormData)[] = [];
    if (step === 1) fieldsToValidate = ['title', 'description'];
    if (step === 2) fieldsToValidate = ['full_name', 'submitted_by_email', 'idea_category'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto max-w-2xl py-12 px-6">
        <h1 className="text-3xl font-bold text-deep-teal text-center mb-2">Submit a New Idea</h1>
        <p className="text-neutral text-center mb-8">Let's change the world, one idea at a time.</p>

        {/* Progress Bar */}
        {/* ... implementation for a progress bar ... */}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lift-md">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-6">Step 1: The Big Idea</h2>
              <div className="space-y-6">
                <Input name="title" label="Idea Title" />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                {/* A textarea would be better here, but Input is what we have for now */}
                <Input name="description" label="Describe your idea" />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
             <div>
                <h2 className="text-2xl font-semibold text-primary mb-6">Step 2: Details & Impact</h2>
                 <div className="space-y-6">
                    <Input name="full_name" label="Your Full Name" />
                    {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                    <Input name="submitted_by_email" label="Your Email" />
                    {errors.submitted_by_email && <p className="text-red-500 text-sm">{errors.submitted_by_email.message}</p>}

                    {/* A select/dropdown component would be needed here */}
                    <Input name="idea_category" label="Idea Category" />
                    {errors.idea_category && <p className="text-red-500 text-sm">{errors.idea_category.message}</p>}
                 </div>
             </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-6">Step 3: Finalize</h2>
              <p className="text-neutral mb-6">You're all set! Review your idea details on the previous steps and click submit when you're ready.</p>
              <p className="text-sm text-neutral/80">By submitting, you agree to the terms and conditions of the Idea Bank platform.</p>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>}
            <div /> {/* Spacer */}
            {step < 3 && <Button type="button" onClick={nextStep}>Next</Button>}
            {step === 3 && <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>Submit Idea</Button>}
          </div>
        </form>
      </div>

      <Modal isOpen={!!submittedIdeaId} onClose={() => setSubmittedIdeaId(null)} title="Idea Submitted!">
        <p className="text-neutral">
          Thank you! Your idea has been successfully submitted. Your tracking ID is:
          <strong className="text-deep-teal ml-2">{submittedIdeaId}</strong>
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setSubmittedIdeaId(null)}>Close</Button>
          <Link to={`/track-idea?id=${submittedIdeaId}`}>
            <Button variant="primary">Track Your Idea</Button>
          </Link>
        </div>
      </Modal>
    </FormProvider>
  );
};

export default SubmitIdeaPage;
