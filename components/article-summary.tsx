export function ArticleSummary({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [lead, invite] = text.split("\n").map((part) => part.trim());
  return (
    <div className={className}>
      <p>{lead}</p>
      {invite ? <p className="mt-2 italic">{invite}</p> : null}
    </div>
  );
}
