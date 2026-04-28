import type { HelloWorldGreeting } from '@lolo/shared/schemas';

interface HelloWorldFeatureProps {
  greeting: HelloWorldGreeting;
}

export function HelloWorldFeature({ greeting }: HelloWorldFeatureProps) {
  return (
    <div className="flex flex-col gap-4 px-6 py-12">
      <h2 className="text-xl font-semibold">{greeting.message}</h2>
      <p className="text-sm text-muted-foreground">
        Generated at {new Date(greeting.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
