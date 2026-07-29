'use client'

import type { ChangeEvent } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/field'
import { LinkField } from '@/components/forms/link-field'
import { SortableBlock } from './sortable-block'
import { AddBlockMenu, AddBlockButton } from './add-block-menu'
import type { SectionDraft, DescBlock } from '@/features/projects/hooks/use-project-form'
import { Layers } from 'lucide-react'

interface SectionEditorProps {
  sectionDraft: SectionDraft
  isUploading: string | null
  onTitleChange: (title: string) => void
  onImageChange: (image: string) => void
  onVideoChange: (video: string) => void
  onAddDescBlock: (type: string, atIndex?: number) => void
  onRemoveDescBlock: (index: number) => void
  onUpdateDescBlock: (index: number, field: 'type' | 'text' | 'image' | 'video', val: string) => void
  onUpdateDescListItems: (index: number, items: string[]) => void
  onUploadSectionImage: (e: ChangeEvent<HTMLInputElement>) => void
  onUploadDescBlockImage: (e: ChangeEvent<HTMLInputElement>, idx: number) => void
  onReorderBlocks: (blocks: DescBlock[]) => void
}

export function SectionEditor({
  sectionDraft,
  isUploading,
  onTitleChange,
  onImageChange,
  onVideoChange,
  onAddDescBlock,
  onRemoveDescBlock,
  onUpdateDescBlock,
  onUpdateDescListItems,
  onUploadSectionImage,
  onUploadDescBlockImage,
  onReorderBlocks,
}: SectionEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // index-based IDs for DnD – stable enough since blocks sync via useEffect in SortableBlock
  const blockIds = sectionDraft.blocks.map((_, i) => `block-${i}`)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blockIds.indexOf(active.id as string)
    const newIndex = blockIds.indexOf(over.id as string)
    onReorderBlocks(arrayMove(sectionDraft.blocks, oldIndex, newIndex))
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0">

      {/* ── Left: canvas ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-2">

        {/* Empty state */}
        {sectionDraft.blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-700 border-2 border-dashed border-zinc-800 rounded-2xl gap-3">
            <Layers className="w-10 h-10" />
            <p className="text-sm font-medium">No blocks yet</p>
            <p className="text-xs">Use the button below to add your first block</p>
          </div>
        )}

        {/* DnD block list */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
            {sectionDraft.blocks.map((block, idx) => (
              <div key={`block-${idx}`}>
                {/* "+ Add" between blocks */}
                {idx === 0 && (
                  <AddBlockMenu onAdd={(type) => onAddDescBlock(type, 0)} />
                )}

                <SortableBlock
                  id={`block-${idx}`}
                  index={idx}
                  block={block}
                  isUploading={isUploading}
                  onRemove={() => onRemoveDescBlock(idx)}
                  onUpdateText={(val) => onUpdateDescBlock(idx, 'text', val)}
                  onUpdateListItems={(items) => onUpdateDescListItems(idx, items)}
                  onUpdateVideo={(url) => onUpdateDescBlock(idx, 'video', url)}
                  onUpdateImage={(url) => onUpdateDescBlock(idx, 'image', url)}
                  onUploadImage={(e) => onUploadDescBlockImage(e, idx)}
                />

                <AddBlockMenu onAdd={(type) => onAddDescBlock(type, idx + 1)} />
              </div>
            ))}
          </SortableContext>
        </DndContext>

        {/* Bottom "Add Block" button */}
        <AddBlockButton onAdd={(type) => onAddDescBlock(type)} />
      </div>

      {/* ── Right: section settings panel ────────────────────────────────── */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800/60 bg-zinc-950/60 backdrop-blur-sm">
        <div className="p-6 space-y-6 lg:sticky lg:top-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Section Settings
            </p>
            <div className="space-y-4">
              <Field label="Title">
                <Input
                  value={sectionDraft.title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Section title…"
                  className="bg-zinc-900 border-zinc-800 h-10 text-white font-semibold rounded-lg"
                />
              </Field>

              <Field label="Sidebar Image">
                <LinkField
                  value={sectionDraft.image}
                  onChange={onImageChange}
                  onUpload={onUploadSectionImage}
                  uploading={isUploading === 'section.image'}
                  placeholder="Upload or paste URL…"
                />
                {sectionDraft.image && (
                  <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sectionDraft.image}
                      alt="Sidebar preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-[10px] text-zinc-600 mt-1">
                  Renders beside content on desktop.
                </p>
              </Field>

              <Field label="Section Video">
                <LinkField
                  value={sectionDraft.video}
                  onChange={onVideoChange}
                  placeholder="YouTube URL…"
                />
                <p className="text-[10px] text-zinc-600 mt-1">
                  Displayed above content in this section.
                </p>
              </Field>
            </div>
          </div>

          {/* Block count */}
          <div className="pt-4 border-t border-zinc-800/50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              {sectionDraft.blocks.length} block{sectionDraft.blocks.length !== 1 ? 's' : ''}
            </p>
            <p className="text-[10px] text-zinc-700 mt-1">
              Drag ⠿ to reorder · Hover blocks to reveal controls
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
