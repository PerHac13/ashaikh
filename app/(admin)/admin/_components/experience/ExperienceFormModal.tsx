import { Suspense } from 'react';
import ExperienceList from '../experience/ExperienceList';
import ExperienceCreateButton from '../experience/ExperienceCreateButton';
import { Loader } from 'lucide-react';

export default function ExperiencePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Experience</h1>
        <ExperienceCreateButton />
      </div> 
        
      <Suspense fallback={<Loader />}>
        <ExperienceList />
      </Suspense>
    </div>
  );
}