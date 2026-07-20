'use client';

import {
  createCourse,
  createCourseModules,
  createCourseTag,
  deleteCourseLessons,
  deleteCourseModules,
  getCourseTags,
  revalidateCourseDetails,
  updateCourse,
  updateCourseModules
} from '@/actions/courses';
import { BackButton } from '@/components/ui/back-button';
import { Dropzone } from '@/components/ui/dropzone';
import { Editor } from '@/components/ui/editor';
import { FormField } from '@/components/ui/form/field';
import { InputField } from '@/components/ui/form/input-field';
import { Form } from '@/components/ui/form/primitives';
import { SelectField } from '@/components/ui/form/select-field';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Separator } from '@/components/ui/separator';
import { queryKeys } from '@/constants/query-keys';
import { CourseDifficulty } from '@/generated/prisma';
import { formatDifficulty, urlToFile } from '@/lib/utils';
import { CreateCourseFormData, createCourseSchema } from '@/server/schemas/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ModulesList } from './modules-list';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { dequal } from 'dequal';

type CourseFormInitialData = Omit<CreateCourseFormData, 'thumbnail'> & {
  thumbnailUrl: string;
}

type CourseFormProps = {
  initialData?: CourseFormInitialData;
}

export const CourseForm = ({ initialData }: CourseFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();

  const courseId = params.courseId as string;
  const isEditing = !!initialData;

  const methods = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      description: initialData?.description ?? '',
      price: 0,
      discountPrice: 0,
      difficulty: 'EASY',
      thumbnail: undefined,
      tagIds: [],
      modules: []
    }
  });

  const { handleSubmit, setValue, watch, register, reset, formState: { dirtyFields } } = methods;

  const setInitialData = useCallback(async (data: CourseFormInitialData) => {
    const thumbnailFile = await urlToFile(data.thumbnailUrl);

    reset({
      ...data,
      thumbnail: thumbnailFile
    });
  }, [reset]);

  useEffect(() => {
    if (initialData) setInitialData(initialData);
  }, [initialData, setInitialData]);

  const tagIds = watch('tagIds');

  const difficultyOptions = [
    { label: formatDifficulty('EASY'), value: CourseDifficulty.EASY },
    { label: formatDifficulty('MEDIUM'), value: CourseDifficulty.MEDIUM },
    { label: formatDifficulty('HARD'), value: CourseDifficulty.HARD }
  ];

  const { data: tagsData } = useQuery({
    queryKey: queryKeys.courseTags,
    queryFn: getCourseTags
  });

  const { mutate: handleCreateTag, isPending: isAddingTag } = useMutation({
    mutationFn: createCourseTag,
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTags });

      setValue('tagIds', [...tagIds, newTag.id], { shouldValidate: true });
    }
  });

  const { mutate: handleCreateCourse, isPending: isCreatingCourse } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success('Curso criado com sucesso!');
      router.push('/admin/courses');
    },
    onError: () => {
      toast.error('Erro ao criar curso. Tente novamente.');
    }
  });

  const { mutate: handleUpdateCourse, isPending: isUpdatingCourse } = useMutation({
    mutationFn: async (data: CreateCourseFormData) => {
      if (!initialData) return;

      await updateCourse({
        id: courseId,
        ...data,
        thumbnail: dirtyFields.thumbnail ? data.thumbnail : undefined
      });

      const isModuleUpdated = !dequal(initialData.modules, data.modules);

      if (!isModuleUpdated) {
        await revalidateCourseDetails(courseId);

        return;
      }

      const removedModules = initialData.modules.filter(mod => !data.modules.find(m => m.id === mod.id));

      const allLessons = data.modules.flatMap(mod => mod.lessons);
      const allInitialLessons = initialData.modules.flatMap(mod => mod.lessons);

      const removedLessons = allInitialLessons.filter(
        lesson => !allLessons.find(l => l.id === lesson.id)
      );

      const modulesToCreate = data.modules.filter(mod => !initialData.modules.find(m => m.id === mod.id));

      const modulesToUpdate = data.modules.filter(mod =>
        !removedModules.find(m => m.id === mod.id) && !modulesToCreate.find(m => m.id === mod.id)
      );

      if (!!removedLessons.length) await deleteCourseLessons(removedLessons.map(lesson => lesson.id));
      if (!!removedModules.length) await deleteCourseModules(removedModules.map(mod => mod.id));
      if (!!modulesToCreate.length) await createCourseModules(courseId, modulesToCreate);
      if (!!modulesToUpdate.length) await updateCourseModules(modulesToUpdate);

      await revalidateCourseDetails(courseId);
    },
    onSuccess: () => {
      toast.success('Curso atualizado com sucesso!');
      router.push('/admin/courses');
    },
    onError: () => {
      toast.error('Ocorreu um erro ao atualizar o curso. Tente novamente mais tarde!');
    }
  });

  const tagsOptions = useMemo(() => {
    return (tagsData ?? []).map(tag => ({ label: tag.name, value: tag.id }));
  }, [tagsData]);

  const selectedTags = useMemo(() => {
    return tagsOptions.filter(option => tagIds.includes(option.value));
  }, [tagIds, tagsOptions]);

  const handleChangeTags = (value: Option[]) => {
    const tagToCreate = value.find(tag => !tagsOptions.find(option => option.value === tag.value));

    if (tagToCreate) {
      handleCreateTag(tagToCreate.value);
      return;
    }

    setValue('tagIds', value.map(option => option.value), { shouldValidate: true });
  };

  const onSubmit = (data: CreateCourseFormData) => {
    const dataWithOrder: CreateCourseFormData = {
      ...data,
      modules: data.modules.map((module, moduleIndex) => ({
        ...module,
        order: moduleIndex + 1,
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          ...lesson,
          order: lessonIndex + 1
        }))
      }))
    };

    if (isEditing) {
      handleUpdateCourse(dataWithOrder);
      return;
    }

    handleCreateCourse(dataWithOrder);
  };
  return (
    <>
      <BackButton />

      <div>
        <h1 className='text-2xl font-bold'>{isEditing ? 'Editar Curso' : 'Criar Curso'}</h1>
        <p className='text-muted-foreground mt-2'>
          {
            isEditing
              ? 'Edite o curso com as informações desejadas.'
              : 'Preencha o formulário abaixo para adicionar um novo curso.'
          }
        </p>
      </div>

      <Separator className='my-2' />

      <Form {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid grid-cols-2 gap-6'
        >
          <InputField
            name='title'
            label='Título'
            placeholder='Ex: Curso de React'
          />
          <InputField
            name='shortDescription'
            label='Subtítulo (Opcional)'
            placeholder='Ex: Aprenda a criar aplicações com React do zero'
          />
          <InputField
            type='number'
            label='Preço'
            placeholder='Ex: R$100.00'
            {...register('price', { valueAsNumber: true })}
          />
          <InputField
            type='number'
            label='Preço promocional (Opcional)'
            placeholder='Ex: R$80.00'
            {...register('discountPrice', { valueAsNumber: true })}
          />
          <FormField
            name='tagIds'
            label='Tags'
          >
            {() => <MultipleSelector
              placeholder='Selecione as Tags'
              options={tagsOptions}
              onChange={value => handleChangeTags(value)}
              value={selectedTags}
              disabled={isAddingTag}
              creatable
            />}
          </FormField>
          <SelectField
            name='difficulty'
            label='Dificuldade'
            options={difficultyOptions}
          />
          <FormField name='thumbnail' label='Thumbnail' className='col-span-full'>
            {({ field }) => (
              <Dropzone
                file={field.value}
                setFile={field.onChange}
              />

            )}
          </FormField>
          <FormField name='description' label='Descrição' className='col-span-full'>
            {({ field }) => (
              <Editor
                value={field.value}
                onChange={field.onChange}
              />
            )}
          </FormField>

          <Separator className='my-2 col-span-full' />

          <ModulesList />

          <div className='col-span-full flex justify-end'>
            <Button type='submit' disabled={isCreatingCourse || isUpdatingCourse}>
              {isEditing ? 'Salvar alterações' : 'Criar Curso'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};