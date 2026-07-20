'use client';

import { Avatar } from '@/components/ui/avatar';
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Crown } from 'lucide-react';

type RankingTableProps = {
  ranking: RankingUser[]
}

export const RankingTable = ({ ranking }: RankingTableProps) => {
  const columns: ColumnDef<RankingUser>[] = [
    {
      header: 'Posição',
      accessorKey: 'position',
      cell: ({ row }) => {
        const position = row.original.position;

        return (
          <div className='max-w-15 flex flex-col items-center'>
            <Crown className='text-primary text-xl drop-shadow-lg drop-shadow-primary' />
            <p className={cn(
              'text-lg text-muted-foreground font-semibold border border-muted-foreground',
              'rounded-full w-10 h-10 flex items-center justify-center',
              position <= 3 && 'text-primary text-xl',
              position === 1 && 'border-primary drop-shadow-lg drop-shadow-primary bg-primary/10'
            )}>
              {position}
            </p>
          </div>
        );
      }
    },
    {
      header: 'Usuário',
      accessorKey: 'name',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className='flex items-center gap-2 p-2'>
            <Avatar src={user.imageUrl} />
            <p>{user.name}</p>
          </div>
        );
      }
    },
    {
      header: 'Aulas Concluídas',
      accessorKey: 'completedLessons',
    }
  ];
  return <DataTable data={ranking} pagination={false} columns={columns} />;
};