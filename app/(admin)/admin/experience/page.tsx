import ExperienceCreateButton from "../_components/experience/ExperienceCreateButton";
import ExperienceList from "../_components/experience/ExperienceList";

const ExperiencePage = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Experience</h1>
          <ExperienceCreateButton />
        </div>
      </div>
    
    <div className="container mx-auto px-4 py-8">
      <ExperienceList />
    </div>
    </>
  );
};

export default ExperiencePage;
