"use client";

import { IExperience } from "@/models/Experience";
import { formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 as Spinner } from "lucide-react";

export default function ExperienceDetails  ({ 
  experience, 
  onEdit, 
  onDelete, 
  isDeleting 
}: { 
  experience: IExperience;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
})  {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">{experience.currentPosition}</h3>
        <p className="text-lg text-gray-700 mt-1">{experience.organization}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-gray-100 text-yellow-800 rounded-full text-sm">{experience.roleType}</span>
        {experience.featured && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Featured</span>
        )}
        {experience.currentlyWorking && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Current</span>
        )}
      </div>

      <div>
        <p className="text-gray-600">
          {formatDate(experience.startDate)} -{" "}
          {experience.currentlyWorking ? "Present" : experience.endDate ? formatDate(experience.endDate) : ""}
        </p>
      </div>

      {experience.previousPositions.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Previous Positions</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {experience.previousPositions.map((position, idx) => (
              <li key={idx}>{position}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="font-medium mb-2">Description</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {experience.description.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {experience.skills.map((skill) => (
            <Badge key={skill}>
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
          {isDeleting ? <Spinner className="h-4 w-4 animate-spin" /> : "Delete"}
        </Button>
      </div>
    </div>
  );
};
