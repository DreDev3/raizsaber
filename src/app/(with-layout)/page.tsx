import { CoursesList } from '@/components/pages/courses/courses-list';
import { CourseTagsList } from '@/components/pages/courses/tags-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';


type CoursesPageProps = {
  searchParams: Promise<{
    query: string;
    tags: string | string[];
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { query, tags } = await searchParams;

  const suspenseKey = JSON.stringify({ query, tags });

  return (
    <>
      <Suspense key={`tags-${suspenseKey}`} fallback={<Skeleton className='w-full h-5.5 min-h-5.5' />} >
        <CourseTagsList />
      </Suspense>

      <Suspense key={suspenseKey} fallback={<Skeleton className='flex-1' />} >
        <CoursesList query={query} tags={tags} />
      </Suspense>
    </>
  );
}
