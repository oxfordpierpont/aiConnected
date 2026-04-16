import Link from 'next/link';
import { appName } from '@/lib/shared';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-fd-muted-foreground">
        Production Documentation
      </p>
      <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl">
        {appName}
      </h1>
      <p className="max-w-2xl text-lg text-fd-muted-foreground">
        A clean Fumadocs installation for the AI Connected project, deployed for
        Dokploy at{' '}
        <span className="font-medium text-fd-foreground">
          aic-docs.sec-admn.com
        </span>
        .
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs"
          className="rounded-full bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Open Docs
        </Link>
        <Link
          href="/llms.txt"
          className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-accent"
        >
          View llms.txt
        </Link>
      </div>
    </div>
  );
}
