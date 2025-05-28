import Link from 'next/link';
import { type JSX } from 'react';

export default function HomePage(): JSX.Element {
  return (
    <main className='flex flex-1 flex-col justify-center text-center'>
      <h1 className='mb-4 text-2xl font-bold'>Social SDK</h1>
      <p className='text-fd-muted-foreground mb-4 text-lg'>
        Unified SDK for interacting with various social media platforms
      </p>
      <div className='flex justify-center gap-4'>
        <Link
          href='/docs'
          className='rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700'
        >
          Get Started
        </Link>
        <Link
          href='https://github.com/socialmated/social-sdk'
          className='rounded-full bg-gray-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800'
        >
          View on GitHub
        </Link>
      </div>
    </main>
  );
}
