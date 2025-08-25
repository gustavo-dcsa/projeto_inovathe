import React from 'react';
import { components } from '../../types/api-types';

// The brief specifies a timeline structure in the GET /api/ideas/{id} response.
// We'll use that as the basis for our props.
type TimelineNode = {
  stage: string;
  status: 'approved' | 'in_analysis' | 'rejected' | 'pending';
  date?: string;
};

interface TimelineProps {
  timeline: TimelineNode[];
  currentStageName: string;
}

// A mapping from stage key to human-readable name, as per the brief.
const STAGE_DISPLAY_NAMES: { [key: string]: string } = {
  submitted: 'Submitted',
  innovation_sector: 'Innovation Sector',
  responsible_manager: 'Manager Review',
  innovation_committee: 'Committee',
  board_of_directors: 'Directors',
  projects: 'Projects',
  implemented: 'Implemented',
};

const Timeline: React.FC<TimelineProps> = ({ timeline, currentStageName }) => {
  const currentStageIndex = timeline.findIndex(t => t.stage === currentStageName);

  return (
    <div className="w-full px-4 sm:px-0">
      <ol className="grid grid-cols-3 sm:grid-cols-7 items-start text-center">
        {timeline.map((node, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;

          let statusColor = 'bg-gray-300';
          if (isCompleted) {
            statusColor = 'bg-primary';
          } else if (isCurrent) {
            if (node.status === 'in_analysis') statusColor = 'bg-highlight';
            else if (node.status === 'rejected') statusColor = 'bg-red-500';
            else statusColor = 'bg-primary';
          }

          return (
            <li key={node.stage} className="relative mb-6 sm:mb-0">
              {/* Connecting Line (not on the last item) */}
              {index < timeline.length - 1 && (
                <div className="hidden sm:block absolute w-full bg-gray-200 h-0.5 top-2.5 left-1/2" />
              )}

              <div className="flex items-center flex-col">
                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${statusColor}`}>
                  {isCompleted && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  )}
                  {isCurrent && node.status === 'rejected' && (
                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-deep-teal">{STAGE_DISPLAY_NAMES[node.stage] || node.stage}</h3>
                  {node.date && <time className="block text-xs text-neutral">{new Date(node.date).toLocaleDateString()}</time>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Timeline;
