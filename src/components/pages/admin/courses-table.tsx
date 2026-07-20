'use client';
import { deleteCourse, updateCourseStatus } from '@/actions/courses';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/ui/tooltip';
import { formatPrice, formatStatus } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Archive, Pencil, Send, Trash } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type CourseTableProps = {
  courses: CourseWithTagsAndModules[];
}

export const CourseTable = ({ courses }: CourseTableProps) => {
  const [search, setSearch] = useState('');

  const { mutate: handleUpdateCourseStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateCourseStatus,
    onSuccess: () => toast.success('Status do curso atualizado com sucesso!'),
    onError: () => toast.error('Erro ao atualizar o status do curso!')
  });

  const { mutateAsync: handleDeleteCourse } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => toast.success('Curso deletado com sucesso!'),
    onError: () => toast.success('Erro ao deletar o sucesso!')
  });

  const columns: ColumnDef<CourseWithTagsAndModules>[] = [
    {
      accessorKey: 'title',
      header: 'Título',
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.original.tags;
        const firstTwoTags = tags.slice(0, 2);
        const remainingTags = tags.slice(2);

        return (
          <div className='flex gap-1'>
            {firstTwoTags.map(tag => (
              <Badge variant='outline' key={`${row.original.id}-${tag.id}`}>
                {tag.name}
              </Badge>
            ))}
            {remainingTags.length > 0 && (
              <Tooltip
                content={remainingTags.map(tag => tag.name).join(', ')}
              >
                <Badge variant='outline'>
                  +{remainingTags.length}
                </Badge>
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'price',
      header: 'Preço',
      cell: ({ row }) => {
        const { price, discountPrice } = row.original;
        return (
          <div className='flex items-center gap-2'>
            {!!discountPrice && (
              <span className='text-[10px] text-muted-foreground line-through'>{formatPrice(price)}</span>
            )}
            {formatPrice(discountPrice ?? price)}
          </div>
        );
      }
    },
    {
      accessorKey: 'modules',
      header: 'Módulos',
      cell: ({ row }) => {
        const modules = row.original.modules;
        return `${modules.length} módulo${modules.length > 1 ? 's' : ''}`;
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'PUBLISHED' ? 'default' : 'outline'}>
            {formatStatus(status)}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Data de Criação',
      cell: ({ row }) => {
        const createdAt = new Date(row.original.createdAt);
        return format(createdAt, 'dd/MM/yyyy');
      }
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => {
        const course = row.original;
        const status = course.status;
        const isPublished = status === 'PUBLISHED';
        return (
          <div className='flex items-center gap-2 justify-end'>
            <Tooltip content={`Alterar status para ${isPublished ? 'Rascunho' : ' Publicado'}`}>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleUpdateCourseStatus({
                  courseId: course.id,
                  status: isPublished ? 'DRAFT' : 'PUBLISHED'
                })}
                disabled={isUpdatingStatus}
              >
                {isPublished ? <Archive /> : <Send />}
              </Button>
            </Tooltip>
            <Tooltip content='Editar curso'>
              <Link passHref href={`/admin/courses/edit/${course.id}`}>
                <Button variant='outline' size='icon'>
                  <Pencil />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content='Excluir curso'>
              <AlertDialog
                title='Excluir Curso'
                description='Tem certeza que deseja excluir esse curso? Essa ação não pode ser revertida.'
                onConfirm={() => handleDeleteCourse(course.id)}
              >
                <Button variant='outline' size='icon'>
                  <Trash />
                </Button>
              </AlertDialog>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const lowerSearch = search.toLowerCase();

      const titleMatch = course.title.toLowerCase().includes(lowerSearch);
      const tagsMatch = course.tags.some(tag => tag.name.toLowerCase().includes(lowerSearch));

      return titleMatch || tagsMatch;
    });
  }, [courses, search]);

  return (
    <>
      <Input
        className='max-w-[400px]'
        placeholder='Pesquisar curso'
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />

      <DataTable columns={columns} data={filteredCourses} />
    </>
  );
};