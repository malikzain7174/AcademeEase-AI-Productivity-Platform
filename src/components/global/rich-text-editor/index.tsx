'use client';

import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';

import RcTiptapEditor, {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  ColumnActionButton,
  Emoji,
  ExportPdf,
  ExportWord,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  // ImageUpload,
  ImportWord,
  Indent,
  Italic,
  Katex,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  SearchAndReplace,
  SlashCommand,
  Strike,
  Table,
  TaskList,
  TextAlign,
  Underline,
  Video,
  // VideoUpload,
  TableOfContents,
  Excalidraw,
  TextDirection,
  ImageGif,
  Mermaid,
} from 'reactjs-tiptap-editor';

import 'reactjs-tiptap-editor/style.css';

import './styles.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { AIModalLink } from './ai/config/modal-helpers';
import { AI_MODAL_FEATURES } from './ai/config/modal-config';
import { useEditorState } from './ai/editor-context';
import { debounce } from 'lodash';
import { SaveStatusIndicator } from './save-status';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEditorStore } from '@/store/editor-store';
import {
  LockIcon,
  UnlockIcon,
  ArrowLeftIcon,
  NotebookPen,
  Pencil,
  CheckIcon,
  XIcon,
  SaveIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

// Custom PDF export configuration
const pdfConfig = {
  header: {
    height: '80px',
    contents: `
      <div style="display: flex; flex-direction: column; padding: 0 20px; height: 100%; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; background: linear-gradient(to bottom right, #f3f4f6, #d1d5db); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                <polygon points="12 15 17 21 7 21 12 15"></polygon>
              </svg>
            </div>
            <h1 style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">Academ<span style="color: #6b7280;">Ease</span></h1>
          </div>
          <div style="color: #6b7280; font-size: 10px;">
            {{date}}
          </div>
        </div>
        <div style="padding: 5px 0; border-top: 1px solid #eee;">
          <h2 style="margin: 0; font-size: 14px; color: #111827; font-weight: 500;">{{noteTitle}}</h2>
        </div>
      </div>
    `,
  },
  footer: {
    height: '20px',
    contents: `
      <div style="text-align: center; color: #6b7280; font-size: 9px; padding: 2px; border-top: 1px solid #eee;">
        {{page}} / {{pages}}
      </div>
    `,
  },
  margin: {
    top: 60,
    right: 20,
    bottom: 20,
    left: 20,
  },
  pageBreak: {
    mode: 'css',
    before: '.page-break',
    after: '.page-break',
    avoid: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  },
};

const extensions = [
  BaseKit.configure({
    multiColumn: true,

    placeholder: {
      showOnlyCurrent: true,
    },
  }),

  History,
  SearchAndReplace,
  TextDirection,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  Underline,
  Strike,
  MoreMark,
  Katex,
  Emoji,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link,
  Image.configure({
    resourceImage: 'link',
  }),

  Video.configure({
    resourceVideo: 'link',
  }),

  ImageGif.configure({
    GIPHY_API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY,
  }),
  Blockquote.configure({ spacer: true }),
  SlashCommand,
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock.configure({ defaultTheme: 'github-dark-default' }),
  ColumnActionButton,
  Table,
  Iframe,
  ExportPdf.configure({
    spacer: true,
    config: pdfConfig,
  }),
  ImportWord.configure({
    upload: (files: File[]) => {
      const f = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));
      return Promise.resolve(f);
    },
  }),
  ExportWord,
  Excalidraw,
  Mermaid.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
];

const DEFAULT = ``;

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function Editor() {
  const router = useRouter();
  const { theme } = useTheme();
  const [_, setSelectedText] = useState(DEFAULT);
  const editorRef = React.useRef<any>(null);
  const { setEditor, captureEditorState } = useEditorState();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Use Zustand store for editor state
  const {
    content,
    setContent,
    autoSaveEnabled,
    setAutoSaveEnabled,
    saveStatus,
    errorMessage,
    saveContent,
    savedContent,
    readOnly,
    setReadOnly,
    noteTitle,
    updateNoteTitle,
  } = useEditorStore();

  // Use refs to track state without re-renders
  const contentRef = useRef(content);

  // Update the ref when content changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Auto-save effect with performance optimizations
  useEffect(() => {
    // Skip if auto-save is disabled or content hasn't changed or editor is readonly
    if (!autoSaveEnabled || content === savedContent || readOnly) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set a new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      // Only save if user is not actively typing
      if (!isTypingRef.current) {
        saveContent();
      }
      saveTimeoutRef.current = null;
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, autoSaveEnabled, savedContent, saveContent, readOnly]);

  // Update editor's editable state when readOnly changes
  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (editor && !editor.isDestroyed) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly]);

  // Super minimal selection handler - only update when text is selected
  const handleSelectionUpdate = useCallback((editor: any) => {
    try {
      if (
        editor &&
        !editor.isDestroyed &&
        editor.state &&
        editor.state.selection
      ) {
        const { from, to } = editor.state.selection;
        // Only process if there's an actual selection
        if (from !== to && typeof from === 'number' && typeof to === 'number') {
          const text = editor.state.doc.textBetween(from, to);
          if (text) {
            setSelectedText(text);
          }
        }
      }
    } catch (error) {
      console.error('Error in selection update:', error);
    }
  }, []);

  // Minimal content update handler - only for AI capture
  const captureContentForAI = useCallback(() => {
    try {
      const editor = editorRef.current?.editor;
      if (editor && !editor.isDestroyed) {
        captureEditorState();
      }
    } catch (error) {
      console.error('Error capturing content for AI:', error);
    }
  }, [captureEditorState]);

  // Setup editor only once with minimal handlers
  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (editor) {
      setEditor(editor);

      // Set initial content if it exists and editor is empty
      if (content && !editor.getHTML()) {
        editor.commands.setContent(content);
      }

      // Only attach selection handler - no update handler
      editor.on('selectionUpdate', handleSelectionUpdate);

      // Set initial editable state
      editor.setEditable(!readOnly);

      return () => {
        if (!editor.isDestroyed) {
          editor.off('selectionUpdate', handleSelectionUpdate);
        }
        setEditor(null);
      };
    }
  }, [editorRef.current?.editor, handleSelectionUpdate, setEditor, readOnly]);

  // Optimized debounced value change handler with typing detection
  const debouncedValueChange = useMemo(
    () =>
      debounce((value: any) => {
        // Set typing flag to true
        isTypingRef.current = true;

        // Only update if value has changed and editor is not empty
        if (value && value !== contentRef.current) {
          setContent(value);
        }

        // Reset typing flag after a short delay
        setTimeout(() => {
          isTypingRef.current = false;
        }, 500);
      }, 150),
    [setContent]
  );

  // Handle content changes from the editor
  const handleContentChange = useCallback(
    (value: string) => {
      const editor = editorRef.current?.editor;
      if (editor && !editor.isDestroyed) {
        // Only update if the content has actually changed
        if (value !== contentRef.current) {
          debouncedValueChange(value);
        }
      }
    },
    [debouncedValueChange]
  );

  // Optimized save handler
  const handleSave = useCallback(() => {
    // Cancel any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Trigger save
    saveContent();
  }, [saveContent]);

  // Toggle readonly mode
  const toggleReadOnly = useCallback(() => {
    setReadOnly(!readOnly);
  }, [readOnly, setReadOnly]);

  // Check if content is saved
  const isSaved = content === savedContent;
  const hasUnsavedChanges = !isSaved;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save on Ctrl+S - always save regardless of unsaved status
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); // Prevent browser's save dialog
        e.stopPropagation(); // Stop event propagation
        if (!readOnly) {
          handleSave();
        }
      }
    };

    // Add event listener with capture phase to ensure it's handled before browser defaults
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleSave, readOnly]);

  // Warn before unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Standard way to show a confirmation dialog before leaving
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Memoize the save indicator to prevent unnecessary re-renders
  const saveIndicator = useMemo(
    () => (
      <SaveStatusIndicator
        status={saveStatus}
        onSave={handleSave}
        errorMessage={errorMessage}
        readOnly={readOnly}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    ),
    [saveStatus, handleSave, errorMessage, readOnly, hasUnsavedChanges]
  );

  // Memoize the auto-save toggle to prevent unnecessary re-renders
  const autoSaveToggle = useMemo(
    () => (
      <div className='flex items-center space-x-2'>
        <Switch
          id='auto-save'
          checked={autoSaveEnabled}
          onCheckedChange={setAutoSaveEnabled}
          disabled={readOnly}
        />
        <Label htmlFor='auto-save' className='text-xs'>
          Auto-save
        </Label>
      </div>
    ),
    [autoSaveEnabled, setAutoSaveEnabled, readOnly]
  );

  // Memoize the readonly toggle button
  const readOnlyToggle = useMemo(
    () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleReadOnly}
              className={`${readOnly ? 'text-amber-500 hover:text-amber-600' : 'text-muted-foreground'}`}
            >
              {readOnly ? (
                <LockIcon className='h-4 w-4' />
              ) : (
                <UnlockIcon className='h-4 w-4' />
              )}
              <span className='hidden sm:inline ml-1'>
                {readOnly ? 'Read Only' : 'Editable'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>
            {readOnly ? 'Enable editing' : 'Make read-only'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    [readOnly, toggleReadOnly]
  );

  // Memoize the floating indicator for mobile
  const floatingIndicator = useMemo(
    () =>
      !isSaved && saveStatus !== 'idle' ? (
        <div
          className={`p-2 rounded-full shadow-lg ${
            saveStatus === 'saving'
              ? 'bg-amber-100'
              : saveStatus === 'saved'
                ? 'bg-green-100'
                : 'bg-red-100'
          }`}
        >
          <div
            className={`h-3 w-3 rounded-full ${
              saveStatus === 'saving'
                ? 'bg-amber-500'
                : saveStatus === 'saved'
                  ? 'bg-green-500'
                  : 'bg-red-500'
            } animate-pulse`}
          ></div>
        </div>
      ) : null,
    [isSaved, saveStatus]
  );

  // Handle navigation to workspace notes
  const handleNavigateToNotes = useCallback(() => {
    // Extract workspace ID from the current URL
    const workspaceId = window.location.pathname.split('/')[2];
    router.push(`/workspaces/${workspaceId}/notes`);
  }, [router]);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(noteTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleTitleEdit = useCallback(() => {
    setIsEditingTitle(true);
    setTempTitle(noteTitle);
    // Focus the input after a small delay to ensure it's mounted
    setTimeout(() => titleInputRef.current?.focus(), 0);
  }, [noteTitle]);

  const handleTitleSave = useCallback(async () => {
    if (tempTitle.trim() && tempTitle !== noteTitle) {
      try {
        await updateNoteTitle(tempTitle.trim());
        toast.success('Note title updated successfully');
      } catch (error) {
        toast.error('Failed to update note title');
        setIsEditingTitle(false);
        setTempTitle(noteTitle);
      }
    }
    setIsEditingTitle(false);
  }, [tempTitle, noteTitle, updateNoteTitle]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleTitleSave();
      } else if (e.key === 'Escape') {
        setIsEditingTitle(false);
        setTempTitle(noteTitle);
      }
    },
    [handleTitleSave, noteTitle]
  );

  // Add theme synchronization effect
  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (editor && !editor.isDestroyed) {
      // Update editor's theme based on application theme
      const isDark = theme === 'dark';
      editor.setOptions({
        editorProps: {
          attributes: {
            class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none w-full h-full min-h-[610px] px-4 py-2 ${
              isDark ? 'dark' : ''
            }`,
          },
        },
      });
    }
  }, [theme]);

  return (
    <div className='relative w-full h-full flex flex-col'>
      <div className='sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'>
        <div className='flex items-center justify-between px-2 py-1.5'>
          <div className='flex items-center gap-1 flex-1 min-w-0'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={handleNavigateToNotes}
                    className='h-7 w-7 text-muted-foreground hover:text-foreground'
                  >
                    <ArrowLeftIcon className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='right'>Back to notes</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {noteTitle && (
              <div className='flex items-center gap-1 flex-1 min-w-0 group'>
                <NotebookPen className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type='text'
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={handleTitleKeyDown}
                    className='flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-medium text-foreground'
                  />
                ) : (
                  <div className='flex items-center gap-1 flex-1 min-w-0'>
                    <span className='text-sm font-medium text-foreground truncate'>
                      {noteTitle}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={handleTitleEdit}
                            className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <Pencil className='h-3 w-3 text-muted-foreground' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Edit title</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <div className='flex items-center'>
              {!readOnly && (
                <>
                  {AI_MODAL_FEATURES.map(
                    ({ icon: Icon, title, routeSuffix }) => (
                      <TooltipProvider key={routeSuffix}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant='ghost'
                              size='icon'
                              asChild
                              className='h-7 w-7 text-muted-foreground hover:text-foreground'
                            >
                              <AIModalLink
                                title={title}
                                routeSuffix={routeSuffix}
                                onClick={captureContentForAI}
                              >
                                <Icon className='h-4 w-4' />
                              </AIModalLink>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side='left'>{title}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  )}
                </>
              )}
            </div>

            {!readOnly && <div className='h-4 w-px bg-border' />}

            <div className='flex items-center gap-1.5'>
              <Switch
                id='auto-save'
                checked={autoSaveEnabled}
                onCheckedChange={setAutoSaveEnabled}
                disabled={readOnly}
                className='shrink-0'
              />
              <Label
                htmlFor='auto-save'
                className='text-xs text-muted-foreground whitespace-nowrap'
              >
                Auto-save
              </Label>
            </div>

            <div className='flex items-center'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={toggleReadOnly}
                      className={`h-7 w-7 ${
                        readOnly
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {readOnly ? (
                        <LockIcon className='h-4 w-4' />
                      ) : (
                        <UnlockIcon className='h-4 w-4' />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    {readOnly ? 'Enable editing' : 'Make read-only'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={handleSave}
                      disabled={!hasUnsavedChanges || readOnly}
                      className={`h-7 w-7 ${
                        saveStatus === 'saving'
                          ? 'text-amber-500'
                          : saveStatus === 'saved'
                            ? 'text-green-500'
                            : saveStatus === 'error'
                              ? 'text-red-500'
                              : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {saveStatus === 'saving' ? (
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      ) : saveStatus === 'saved' ? (
                        <CheckIcon className='h-4 w-4' />
                      ) : saveStatus === 'error' ? (
                        <XIcon className='h-4 w-4' />
                      ) : (
                        <SaveIcon className='h-4 w-4' />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    {hasUnsavedChanges ? 'Save changes' : 'All changes saved'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      <div className='flex-grow overflow-auto'>
        <RcTiptapEditor
          ref={editorRef}
          content={content}
          extensions={extensions}
          output='html'
          disabled={readOnly}
          onChangeContent={handleContentChange}
          useEditorOptions={{
            immediatelyRender: true,
            shouldRerenderOnTransaction: false,
            editable: !readOnly,
            editorProps: {
              attributes: {
                class:
                  'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none w-full h-full min-h-[610px] px-4 py-2',
              },
            },
          }}
          contentClass={'w-full h-full min-h-[610px]'}
        />
      </div>

      {/* Floating save indicator for mobile */}
      <div className='md:hidden fixed bottom-4 right-4 z-50'>
        {floatingIndicator}
      </div>
    </div>
  );
}
