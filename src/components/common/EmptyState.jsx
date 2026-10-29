import Button from './Button';

export default function EmptyState({ title, message, actionLabel, actionTo }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-slate-600">{message}</p>
      {actionLabel && (
        <Button to={actionTo} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
