'use client';
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  Edit,
  Link as LinkIcon,
  MoreHorizontal,
  NotebookPen,
  Pencil,
  SquareArrowOutUpRight,
  Trash2,
  X,
} from 'lucide-react';
import { Note } from '@prisma/client';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PRIORITY_COLORS } from '@/lib/constants'; // Check if this import is being used
import { deleteNote, updateNoteTitle } from '@/actions/notes';
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
import { useRouter } from 'next/navigation';
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
}

export function ExpandableNotes({ notes }: Props) {
  const [active, setActive] = useState<NoteWithTask | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (editingTitle) {
          setEditingTitle(false);
        } else if (!deleteDialogOpen) {
          setActive(null);
        }
      }
    }

    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, editingTitle, deleteDialogOpen]);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTitle]);

  // Remove the useOutsideClick hook as we're handling clicks differently now
  // useOutsideClick(ref, () => {
  //   if (!editingTitle && !deleteDialogOpen) {
  //     setActive(null);
  //   }
  // });

  const handleDeleteNote = async () => {
    const noteId = activeNoteId || (active?.id ?? null);
    if (!noteId) return;

    try {
      setIsDeleting(true);
      const { workspaceId } = await deleteNote(noteId);
      setDeleteDialogOpen(false);
      setActive(null);
      setActiveNoteId(null);
      toast.success('Note deleted successfully');

      // Redirect to the workspace notes page
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete note');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTitleUpdate = async () => {
    if (!active || !titleValue.trim()) return;

    try {
      setIsSaving(true);
      await updateNoteTitle(active.id, titleValue);
      setEditingTitle(false);
      setActive((prev) => (prev ? { ...prev, title: titleValue } : null));
      toast.success('Title updated successfully');
    } catch (error) {
      toast.error('Failed to update title');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingTitle = () => {
    if (active) {
      setTitleValue(active.title);
      setEditingTitle(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <div
            className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden'
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={`card-${active.id}`}
              ref={ref}
              className='bg-card border rounded-lg shadow-lg flex flex-col w-full max-w-3xl h-[80vh] max-h-[800px] overflow-hidden'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='p-4 border-b flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  {editingTitle ? (
                    <div className='flex items-center gap-2'>
                      <motion.div
                        layoutId={`image-${active.id}`}
                        className='p-2 bg-primary/10 rounded-full text-primary'
                      >
                        <NotebookPen className='h-5 w-5' />
                      </motion.div>
                      <div className='flex-1 flex items-center gap-2'>
                        <Input
                          ref={titleInputRef}
                          value={titleValue}
                          onChange={(e) => setTitleValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleTitleUpdate();
                            }
                          }}
                          className='flex-1'
                          placeholder='Enter note title...'
                        />
                        <Button
                          variant='default'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTitleUpdate();
                          }}
                          disabled={isSaving}
                          className='shrink-0'
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant='ghost'
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTitle(false);
                          }}
                          className='shrink-0'
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='flex items-center gap-2'>
                        <motion.div
                          layoutId={`image-${active.id}`}
                          className='p-2 bg-primary/10 rounded-full text-primary'
                        >
                          <NotebookPen className='h-5 w-5' />
                        </motion.div>
                        <motion.h2
                          layoutId={`title-${active.id}`}
                          className='text-xl font-bold text-foreground'
                        >
                          {active.title}
                        </motion.h2>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingTitle();
                          }}
                        >
                          <Pencil className='h-3.5 w-3.5' />
                        </Button>
                      </div>
                      <div className='flex items-center gap-3 ml-10'>
                        {active.task && (
                          <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                            <LinkIcon className='h-3 w-3' />
                            <Link
                              href={`/workspaces/${active.workspaceId}/board/tasks/${active.task.id}`}
                              className='hover:underline hover:text-primary transition-colors'
                            >
                              {active.task.title}
                            </Link>
                            <Badge
                              variant='outline'
                              className={`ml-1 text-[10px] ${PRIORITY_COLORS[active.task.priority] || ''}`}
                            >
                              {active.task.priority}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className='flex items-center gap-2 justify-end'>
                  <TooltipProvider>
                    {active.task && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='outline'
                            size='sm'
                            className='h-8 gap-1 text-primary hover:text-primary hover:bg-primary/10'
                            onClick={(e) => e.stopPropagation()}
                            asChild
                          >
                            <Link
                              href={`/workspaces/${active.workspaceId}/board/tasks/${active.task.id}`}
                            >
                              <LinkIcon className='h-3.5 w-3.5' />
                              <span className='hidden sm:inline'>
                                View Task
                              </span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View linked task</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          className='h-8 gap-1 text-primary hover:text-primary hover:bg-primary/10'
                          onClick={(e) => e.stopPropagation()}
                          asChild
                        >
                          <Link
                            href={`/workspaces/${active.workspaceId}/notes/${active.id}`}
                          >
                            <Pencil className='h-3.5 w-3.5' />
                            <span className='hidden sm:inline'>
                              Edit Content
                            </span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit note content</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          className='h-8 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10'
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialogOpen(true);
                            setActiveNoteId(active.id);
                          }}
                        >
                          <Trash2 className='h-3.5 w-3.5' />
                          <span className='hidden sm:inline'>Delete</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete note</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='ml-1 p-2 hover:bg-accent rounded-full transition-colors'
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(null);
                    }}
                    title='Close'
                  >
                    <X className='h-5 w-5' />
                  </motion.button>
                </div>
              </div>

              <ScrollArea className='flex-1 p-6 overflow-auto'>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-li:my-0 prose-ol:my-2 prose-ul:my-2 prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-md prose-code:text-primary prose-code:bg-primary/10 prose-code:p-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-h1:pt-6 prose-h1:scroll-mt-6 prose-h2:pt-4 prose-h2:scroll-mt-4 prose-img:rounded-md prose-img:mx-auto prose-a:text-primary prose-a:no-underline hover:prose-a:underline'
                >
                  {active.content ? (
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {active.content}
                    </ReactMarkdown>
                  ) : (
                    <p className='text-muted-foreground italic'>
                      No content available
                    </p>
                  )}
                </motion.div>
              </ScrollArea>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto'>
        {notes.map((note) => (
          <motion.div
            layoutId={`card-${note.id}`}
            key={`card-${note.id}`}
            whileHover={{ y: -5 }}
            className='group'
            onClick={() => setActive(note)}
          >
            <Card className='h-full cursor-pointer border hover:border-primary/50 transition-all duration-300 hover:shadow-md flex flex-col'>
              <CardHeader className='pb-2 space-y-1'>
                <div className='flex justify-between items-start'>
                  <div className='flex gap-3 items-center'>
                    <motion.div
                      layoutId={`image-${note.id}`}
                      className='p-2 bg-primary/10 rounded-full text-primary'
                    >
                      <NotebookPen className='h-5 w-5' />
                    </motion.div>
                    <motion.div
                      layoutId={`title-${note.id}`}
                      className='font-medium line-clamp-1'
                    >
                      {note.title}
                    </motion.div>
                  </div>
                </div>

                {note.task && (
                  <div className='flex items-center gap-1 text-xs text-muted-foreground ml-10'>
                    <LinkIcon className='h-3 w-3 shrink-0' />
                    <span className='truncate max-w-[180px]'>
                      {note.task.title}
                    </span>
                    <Badge
                      variant='outline'
                      className={`ml-auto text-[10px] ${PRIORITY_COLORS[note.task.priority] || ''}`}
                    >
                      {note.task.KanbanColumn?.name || note.task.priority}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className='flex-grow overflow-hidden'>
                <div className='text-muted-foreground line-clamp-3 text-sm h-full'>
                  {note.content ? (
                    <div className='prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-headings:my-0 prose-headings:text-sm prose-li:my-0 prose-ol:my-1 prose-ul:my-1 prose-pre:bg-muted/50 prose-pre:text-xs prose-pre:py-1 prose-pre:px-2 prose-pre:rounded prose-code:text-primary prose-code:bg-primary/10 prose-code:py-0.5 prose-code:px-1 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none'>
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {note.content.length > 200
                          ? `${note.content.substring(0, 200)}...`
                          : note.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className='italic'>No content available</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className='pt-0 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className='text-xs text-muted-foreground flex items-center gap-1'
                  >
                    <Calendar className='h-3 w-3' />
                    {format(note.updatedAt, 'dd MMM yyyy')}
                  </Badge>
                </div>
                <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-muted-foreground hover:text-primary'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/workspaces/${note.workspaceId}/notes/${note.id}`
                      );
                    }}
                    title='Edit note'
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-muted-foreground hover:text-destructive'
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveNoteId(note.id);
                      setDeleteDialogOpen(true);
                    }}
                    title='Delete note'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className='text-center py-12'>
          <NotebookPen className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
          <h3 className='text-xl font-medium mb-2'>No notes yet</h3>
          <p className='text-muted-foreground'>
            Create your first note to get started
          </p>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className='z-[100]'>
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
    </>
  );
}
