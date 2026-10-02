'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Workspace } from '@prisma/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Tooltip from '@/components/global/tooltip';
import EditableFormField from '@/components/global/editable-form-field';
import { updateWorkspace } from '@/actions/workspaces';
import Breadcrumbs, { IBreadcrumb } from '@/components/global/breadcrumbs';

type Props = {
  workspace: Workspace;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(20, { message: 'Name must not be longer than 20 characters.' }),
  description: z
    .string()
    .max(150, {
      message: 'Description must not be longer than 150 characters.',
    })
    .optional(),
});

const WorkspaceTitle = ({ workspace }: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description || '',
    },
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [workspaceDescription, setWorkspaceDescription] = useState(
    workspace.description || ''
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setWorkspaceName(newName);
    form.setValue('name', newName);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDescription = e.target.value;
    setWorkspaceDescription(newDescription);
    form.setValue('description', newDescription);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSaving(true);
    await updateWorkspace(workspace.id, {
      name: data.name,
      description: data.description,
    })
      .then(() => {
        setIsSaving(false);
        setIsEditing({
          name: false,
          description: false,
        });
        toast.success('Workspace updated successfully', {
          position: 'top-right',
          richColors: true,
        });
      })
      .catch((error) => {
        setIsSaving(false);
        toast.error(error.message, {
          position: 'top-right',
          richColors: true,
        });
        console.error(error);
      });
  }

  const discardChanges = (field: 'name' | 'description') => {
    if (field === 'name') {
      setWorkspaceName(workspace.name);
      form.setValue('name', workspace.name);
      form.clearErrors();
    } else if (field === 'description') {
      setWorkspaceDescription(workspace.description || '');
      form.setValue('description', workspace.description || '');
      form.clearErrors();
    }
  };

  const toggleEditMode = (field: 'name' | 'description') => {
    if (isEditing[field]) {
      discardChanges(field);
      setIsEditing({
        name: false,
        description: false,
      });
    } else {
      const otherField = field === 'name' ? 'description' : 'name';
      if (isEditing[otherField]) {
        discardChanges(otherField);
      }
      setIsEditing({
        name: field === 'name',
        description: field === 'description',
      });
    }
  };

  const breadcrumbItems: IBreadcrumb[] = [
    {
      label: 'overview',
    },
    { label: workspaceName },
    {
      label: 'Overview',
      dropdownItems: [
        { label: 'Overview', href: `/workspaces/${workspace.id}` },
        { label: 'Board', href: `/workspaces/${workspace.id}/board` },
        { label: 'Notes', href: '/workspaces/notes' },
      ],
    },
  ];

  return (
    <div className='space-y-2 flex flex-col items-start justify-start'>
      <Breadcrumbs className='ml-3' items={breadcrumbItems} />
      {/* <sup className='text-sm ml-3'>
        <Tooltip content='View all workspaces'>
          <Link className='underline text-muted-foreground' href='/workspaces'>
            workspaces
          </Link>
        </Tooltip>
        {' > '}
        <span className='font-bold'>{workspaceName}</span>
      </sup> */}
      <div className='relative w-full'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col items-start justify-start gap-2 w-full'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EditableFormField
                      isEditing={isEditing.name}
                      toggleIsEditing={() => toggleEditMode('name')}
                      isLoading={isSaving}
                      onDiscard={(e) => {
                        e.preventDefault();
                        toggleEditMode('name');
                      }}
                      tooltipContent='Edit your workspace name'
                      className='flex items-baseline w-full'
                      field={
                        <input
                          {...field}
                          type='text'
                          value={workspaceName}
                          disabled={isSaving}
                          placeholder='Name your workspace'
                          maxLength={20}
                          onChange={handleNameChange}
                          className='placeholder:font-extralight text-5xl md:text-6xl font-bold bg-transparent border-none outline-none w-full'
                        />
                      }
                      content={
                        <h1
                          className='mt-2 md:mt-2.5 text-5xl md:text-6xl font-bold'
                          onClick={() => toggleEditMode('name')}
                        >
                          {workspaceName}
                        </h1>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <EditableFormField
                      isEditing={isEditing.description}
                      toggleIsEditing={() => toggleEditMode('description')}
                      isLoading={isSaving}
                      onDiscard={(e) => {
                        e.preventDefault();
                        toggleEditMode('description');
                      }}
                      tooltipContent='Edit your workspace description'
                      className='flex flex-col w-full'
                      field={
                        <textarea
                          {...field}
                          disabled={isSaving}
                          placeholder='Enter a description...'
                          value={workspaceDescription}
                          onChange={handleDescriptionChange}
                          maxLength={150}
                          className='mt-2.5 md:mt-[13px] placeholder:font-extralight h-24 md:h-14 bg-transparent border-none outline-none w-full resize-none'
                        />
                      }
                      content={
                        <p
                          className={`mt-2.5 md:mt-[13px] text-muted-foreground cursor-pointer flex items-baseline group h-full break-all ${
                            workspaceDescription ? '' : 'italic'
                          }`}
                          onClick={() => toggleEditMode('description')}
                        >
                          {workspaceDescription ||
                            'Enter a description here...'}
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default WorkspaceTitle;
