import {PrismaClient} from '@/generated/prisma';

const PrismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof PrismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

export { prisma };

if(process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}