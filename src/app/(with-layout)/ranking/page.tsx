import { getRanking } from '@/actions/ranking';
import { RankingTable } from '@/components/pages/ranking/ranking-table';
import { Crown } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 3600; //atualiza dados da pagina de hora em hora

export const metadata: Metadata = {
  title: 'Ranking',
};

export default async function Ranking() {
  const ranking = await getRanking();

  return (
    <>
      <div className='flex flex-col items-center text-center'>
        <h1 className='text-3xl font-bold flex items-center gap-2'>
          <Crown className='text-primary' />
          Ranking
          <Crown className='text-primary' />
        </h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Está tabela atualiza de hora em hora.
        </p>
      </div>

      <RankingTable ranking={ranking} />
    </>
  );
}