import { getExperiences } from '@/actions/experienceActions';
import { IExperience } from '@/models/Experience';
import ExperienceCard from './ExperienceCard';
import NoExperiencesFound from './NoExperienceFound';
export default async function ExperienceList() {
  
  const experiences = await getExperiences();
  
  if (!experiences || experiences.length === 0) {
    return <NoExperiencesFound />;
  }

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiences?.map((experience: IExperience) => (
        <ExperienceCard 
          key={experience._id.toString()} 
          experience={experience} 
        />
      ))}
    </div>
  );
}