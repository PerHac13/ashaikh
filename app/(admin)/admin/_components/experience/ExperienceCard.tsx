"use client";

import { useState } from 'react';
import { formatDate } from '@/utils/dateUtils';
import { IExperience } from '@/models/Experience';
import ExperienceDetailModal from './ExperienceDetailModal';
import { Badge } from '@/components/ui/badge';

type ExperienceCardProps = {
  experience: IExperience ;
};

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <div 
        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{experience.currentPosition}</h3>
          {experience.featured && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Featured</span>
          )}
        </div>
        
        <p className="text-gray-700 font-medium mt-1">{experience.organization}</p>
        
        <div className="mt-2 text-sm text-gray-600">
          <p>
            {formatDate(experience.startDate)} - {experience.currentlyWorking 
              ? 'Present' 
              : experience.endDate ? formatDate(experience.endDate) : ''}
          </p>
          <p className="mt-1">{experience.roleType}</p>
        </div>
        
        <div className="mt-3">
          <p className="text-sm text-gray-500 line-clamp-2">
            {experience.description[0]}
          </p>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {experience.skills.slice(0, 3).map(skill => (
            <Badge key={skill} >
              {skill}
            </Badge>
          ))}
          {experience.skills.length > 3 && (
            <Badge >
              +{experience.skills.length - 3} more
            </Badge>
          )}
        </div>
      </div>
      
      {showModal && (
        <ExperienceDetailModal 
          experience={experience} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}