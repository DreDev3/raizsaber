import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog/index';
import { InputField } from '@/components/ui/form/input-field';
import { Form } from '@/components/ui/form/primitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { createId } from '@paralleldrive/cuid2';
import z from 'zod';
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(1, 'Campo obrigatório'),
  description: z.string().min(1, 'Campo obrigatório'),
});

type ModuleFormData = z.infer<typeof formSchema>;

export type ModuleFormItem = ModuleFormData & {
  id: string;
}

type ManageModuleDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: ModuleFormItem | null;
  setInitialData?: (data: ModuleFormItem | null) => void;
}

export const ManageModuleDialog = ({ open, setOpen, initialData, setInitialData }: ManageModuleDialogProps) => {
  const { getValues, setValue, reset: resetForm } = useFormContext();
  const form = useForm<ModuleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    }
  });

  const { handleSubmit, reset } = form;

  const isEditing = !!initialData;

  useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    }
  }, [initialData, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({ title: '', description: '' });
      setInitialData?.(null);
    }
  }, [open, reset, setInitialData]);

  const onSubmit = (data: ModuleFormData) => {
    const modules = getValues('modules');

    if (isEditing) {
      const updatedModules = modules.map((module: ModuleFormItem) => {
        if (module.id === initialData.id) {
          return { ...module, ...data };
        }
        return module;
      });
      setValue('modules', updatedModules, { shouldValidate: true });
      resetForm(getValues());
      setOpen(false);
      return;
    }

    modules.push({
      ...data,
      id: createId(),
      order: 1,
      lessons: []
    });
    setValue('modules', modules, { shouldValidate: true });
    resetForm(getValues());
    setOpen(false);
  };

  return (
    <Dialog
      title={isEditing ? 'Editar Módulo' : 'Adicionar Módulo'}
      open={open}
      setOpen={setOpen}
      width='500px'
      content={
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <InputField name='title' label='Título' placeholder='Ex: Modulo 1: Introdução ao React' />
            <InputField name='description' label='Descrição' placeholder='Ex: Nesta aula, você aprenderá os fundamentos do React.' />

            <Button className='max-w-max ml-auto' onClick={() => handleSubmit(onSubmit)()}>
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </form>
        </Form>
      }
    />

  );
};