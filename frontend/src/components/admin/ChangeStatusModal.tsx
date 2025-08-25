import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Idea } from '../../types';
import { STATUS_CHOICES, STAGE_CHOICES } from '../../constants/choices';
import Modal from '../Modal';

interface ChangeStatusModalProps {
  idea: Idea;
  onClose: () => void;
}

const updateIdeaStatus = async ( {ideaId, status, stage}: {ideaId: string, status: string, stage: string} ) => {
  const { data } = await api.patch(`/ideas/${ideaId}/`, { status, stage });
  return data;
};

const ChangeStatusModal = ({ idea, onClose }: ChangeStatusModalProps) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(idea.status);
  const [stage, setStage] = useState(idea.stage);

  const mutation = useMutation({
    mutationFn: updateIdeaStatus,
    onSuccess: () => {
      // Invalidate and refetch the allIdeas query to show the updated data
      queryClient.invalidateQueries({ queryKey: ['allIdeas'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ ideaId: idea.id, status, stage });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Update: ${idea.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            {STATUS_CHOICES.map(choice => (
              <option key={choice.value} value={choice.value}>{choice.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700">Stage</label>
          <select
            id="stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            {STAGE_CHOICES.map(choice => (
              <option key={choice.value} value={choice.value}>{choice.label}</option>
            ))}
          </select>
        </div>
        {mutation.isError && <p className="text-red-500">An error occurred. Please try again.</p>}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Cancel</button>
          <button type="submit" disabled={mutation.isPending} className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
            {mutation.isPending ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeStatusModal;
