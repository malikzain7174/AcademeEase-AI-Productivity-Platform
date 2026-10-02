'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Edit,
  Link as LinkIcon,
  NotebookPen,
  Trash2,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { Note } from '@prisma/client';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteNote } from '@/actions/notes';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NoteWithTask extends Note {
  task?: {
    id: string;
    title: string;
    priority: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW' | 'LOWEST';
    kanbanColumnId: string | null;
    KanbanColumn?: {
      name: string;
    } | null;
  } | null;
}

interface Props {
  notes: NoteWithTask[];
  taskId: string;
}

export function TaskNotes({ notes, taskId }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      setIsDeleting(true);
      const { workspaceId } = await deleteNote(noteToDelete);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {notes.map((note) => (
          <motion.div key={note.id} whileHover={{ y: -5 }} className='group'>
            <Link
              href={`/workspaces/${note.workspaceId}/notes/${note.id}`}
              className='block h-full'
            >
              <Card className='h-full cursor-pointer border hover:border-primary/50 transition-all duration-300 hover:shadow-md flex flex-col'>
                <CardHeader className='pb-2 space-y-1'>
                  <div className='flex justify-between items-start'>
                    <div className='flex gap-3 items-center'>
                      <div className='p-2 bg-primary/10 rounded-full text-primary'>
                        <NotebookPen className='h-5 w-5' />
                      </div>
                      <div className='font-medium line-clamp-1'>
                        {note.title}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='flex-1'>
                  <div className='text-muted-foreground line-clamp-3 text-sm'>
                    {note.content ? (
                      <div className='prose-sm'>
                        <ReactMarkdown>{note.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className='italic'>No content available</p>
                    )}
                  </div>
                </CardContent>
                <CardContent className='pt-0 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      className='text-xs text-muted-foreground flex items-center gap-1'
                    >
                      <Calendar className='h-3 w-3' />
                      {format(note.updatedAt, 'dd MMM yyyy')}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-1'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-primary'
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(
                                `/workspaces/${note.workspaceId}/notes/${note.id}`,
                                '_blank'
                              );
                            }}
                            title='Open in new tab'
                          >
                            <SquareArrowOutUpRight className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open in new tab</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-destructive'
                            onClick={(e) => {
                              e.preventDefault();
                              setNoteToDelete(note.id);
                              setDeleteDialogOpen(true);
                            }}
                            title='Delete note'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete note</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className='text-center py-12'>
          <NotebookPen className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
          <h3 className='text-xl font-medium mb-2'>No notes yet</h3>
          <p className='text-muted-foreground'>Create a note to get started</p>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
