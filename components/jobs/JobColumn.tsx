import JobCard from "./JobCard";

export default function JobColumn({
  title,
  jobs,
  color,
  onStatusChange,
  onDelete,
}: any) {
  return (
    <div className="space-y-3">
      <div className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}>
        {title} ({jobs.length})
      </div>

      <div className="space-y-3">
        {jobs.map((job: any) => (
          <JobCard
            key={job.id}
            job={job}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}