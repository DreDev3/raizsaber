'use server';

import { prisma } from '@/lib/prisma';

export const getNewUserStats = async (): Promise<StatsChartData[]> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const getLastSevenDays = () => {
      const dates = [];
      
      for(let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
      }
      return dates;
  };

  const users = await prisma.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: sevenDaysAgo
      }
    },
    _count: {
      _all: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const lastSevenDays = getLastSevenDays();
  const usersCounts = new Map(
    users.map(user => [user.createdAt.toISOString().split('T')[0], user._count._all])
  );

  return lastSevenDays.map(date => ({
    date,
    count: usersCounts.get(date.toISOString().split('T')[0]) || 0
  }));
};

export const getPurchasedCoursesStats = async (): Promise<StatsChartData[]> => {
  const lastThirtyDaysAgo = new Date();
  lastThirtyDaysAgo.setDate(lastThirtyDaysAgo.getDate() - 30);
  lastThirtyDaysAgo.setHours(0, 0, 0, 0);

  const getLastThirtyDays = () => {
      const dates = [];
      
      for(let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
      }
      return dates;
  };

  const purchases = await prisma.coursePurchase.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: lastThirtyDaysAgo
      }
    },
    _count: {
      _all: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const lastThirtyDays = getLastThirtyDays();
  const purchasesCounts = new Map(
    purchases.map(purchase => [purchase.createdAt.toISOString().split('T')[0], purchase._count._all])
  );

  return lastThirtyDays.map(date => ({
    date,
    count: purchasesCounts.get(date.toISOString().split('T')[0]) || 0
  }));
};