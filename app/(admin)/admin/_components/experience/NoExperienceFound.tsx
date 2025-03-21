import ExperienceCreateButton from './ExperienceCreateButton';

export default function NoExperiencesFound() {
  return (
    <div className=" rounded-lg p-8 text-center">
      <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
      <p className="text-white mb-6">
        You haven&apos;t added any work experiences yet. Add your first experience to get started.
      </p>
      <div className="flex justify-center">
        <ExperienceCreateButton />
      </div>
    </div>
  );
}