import React from 'react';
import { components } from '../../types/api-types';
import Card from '../ui/Card';

// The brief shows author_name in the example, which might not be in the base schema.
// We'll define a more complete type here.
type FeedbackWithAuthor = components['schemas']['IdeaFeedback'] & {
  author_name?: string;
};

interface FeedbackListProps {
  feedbacks: FeedbackWithAuthor[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center text-neutral mt-10 py-10 border-t">
        <h3 className="text-2xl font-bold text-deep-teal mb-4">Feedback History</h3>
        <p>No feedback has been provided for this idea yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t pt-10">
      <h3 className="text-2xl font-bold text-deep-teal text-center mb-8">Feedback History</h3>
      <div className="space-y-6 max-w-2xl mx-auto">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} className="bg-white shadow-lift-sm">
            <blockquote className="text-neutral italic">"{feedback.feedback_text}"</blockquote>
            <div className="text-right text-sm text-neutral/80 mt-4">
              <span>- {feedback.author_name || 'Admin'} on </span>
              <time dateTime={feedback.created_at}>{new Date(feedback.created_at).toLocaleDateString()}</time>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
