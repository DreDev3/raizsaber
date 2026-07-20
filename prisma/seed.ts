import { PrismaClient } from '../src/generated/prisma';
import sampleCourses from './sample-courses.json';

const prisma = new PrismaClient();

async function main() {
for (const courseData of sampleCourses) {
  const {tags, modules, thumbnail, ...course} = courseData;

  const createdCourse = await prisma.course.create({
    data: {
      ...course,
      status: 'PUBLISHED',
      thumbnailUrl: thumbnail,
      tags: {
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name }
        }))
      },
      modules: {
        create: modules.map((courseModule, index) => ({
          title: courseModule.title,
          description: courseModule.description,
          order: index + 1,
          lessons: {
            create: courseModule.lessons.map((lesson, lessonIndex) => ({
              title: lesson.title,
              description: lesson.description,
              videoId: lesson.videoId,
              durationInMs: lesson.durationInMs,
              order: lessonIndex + 1
            }))
            }
          })
      )
    },
    },
});

console.log(`Curso criado: ${createdCourse.title}`);
  }
}

main()
.then(async () => {
  await prisma.$disconnect();
})
.catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});