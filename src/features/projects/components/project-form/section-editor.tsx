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
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/field'
import { LinkField } from '@/components/forms/link-field'
import { SortableBlock } from './sortable-block'
import { AddBlockMenu, AddBlockButton } from './add-block-menu'
import type { SectionDraft, DescBlock } from '@/features/projects/hooks/use-project-form'
import { Layers, Columns2, Square } from 'lucide-react'

const BREAKPOINT_OPTIONS = [
  { value: 'sm', label: 'sm', desc: '640px+' },
  { value: 'md', label: 'md', desc: '768px+' },
  { value: 'lg', label: 'lg', desc: '1024px+' },
  { value: 'always', label: 'always', desc: 'no collapse' },
]

interface SectionEditorProps {
  sectionDraft: SectionDraft
  isUploading: string | null
  onTitleChange: (title: string) => void
  onImageChange: (image: string) => void
  onVideoChange: (video: string) => void
  onColumnsChange: (cols: number) => void
  onBreakpointChange: (bp: string) => void
  onAddDescBlock: (type: string, atIndex?: number, columnIndex?: number) => void
  onRemoveDescBlock: (index: number) => void
  onUpdateDescBlock: (index: number, field: 'type' | 'text' | 'image' | 'video', val: string) => void
  onUpdateDescListItems: (index: number, items: string[]) => void
  onMoveBlockToColumn: (mainIndex: number, col: number) => void
  onReorderColumnBlocks: (column: number, oldIdx: number, newIdx: number) => void
  onUploadSectionImage: (e: ChangeEvent<HTMLInputElement>) => void
  onUploadDescBlockImage: (e: ChangeEvent<HTMLInputElement>, idx: number) => void
  onUploadGalleryItem: (e: ChangeEvent<HTMLInputElement>, blockIdx: number, itemIdx: number) => void
  onReorderBlocks: (blocks: DescBlock[]) => void
}

// ── Single-column canvas ───────────────────────────────────────────────────────
function SingleColumnCanvas({
  sectionDraft,
  isUploading,
  onAddDescBlock,
  onRemoveDescBlock,
  onUpdateDescBlock,
  onUpdateDescListItems,
  onUploadDescBlockImage,
  onUploadGalleryItem,
  onReorderBlocks,
}: Pick<
  SectionEditorProps,
  | 'sectionDraft'
  | 'isUploading'
  | 'onAddDescBlock'
  | 'onRemoveDescBlock'
  | 'onUpdateDescBlock'
  | 'onUpdateDescListItems'
  | 'onUploadDescBlockImage'
  | 'onUploadGalleryItem'
  | 'onReorderBlocks'
>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const blockIds = sectionDraft.blocks.map((_, i) => `block-${i}`)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blockIds.indexOf(active.id as string)
    const newIndex = blockIds.indexOf(over.id as string)
    onReorderBlocks(arrayMove(sectionDraft.blocks, oldIndex, newIndex))
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-2">
      {sectionDraft.blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-700 border-2 border-dashed border-zinc-800 rounded-2xl gap-3">
          <Layers className="w-10 h-10" />
          <p className="text-sm font-medium">No blocks yet</p>
          <p className="text-xs">Use the button below to add your first block</p>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          {sectionDraft.blocks.map((block, idx) => (
            <div key={`block-${idx}`}>
              {idx === 0 && <AddBlockMenu onAdd={(type) => onAddDescBlock(type, 0)} />}
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
                onUploadGalleryItem={(e, itemIdx) => onUploadGalleryItem(e, idx, itemIdx)}
              />
              <AddBlockMenu onAdd={(type) => onAddDescBlock(type, idx + 1)} />
            </div>
          ))}
        </SortableContext>
      </DndContext>

      <AddBlockButton onAdd={(type) => onAddDescBlock(type)} />
    </div>
  )
}

// ── Column pane (used in 2-col mode) ──────────────────────────────────────────
function ColumnPane({
  colIndex,
  label,
  sectionDraft,
  isUploading,
  onAddDescBlock,
  onRemoveDescBlock,
  onUpdateDescBlock,
  onUpdateDescListItems,
  onMoveBlockToColumn,
  onReorderColumnBlocks,
  onUploadDescBlockImage,
  onUploadGalleryItem,
}: {
  colIndex: number
  label: string
  sectionDraft: SectionDraft
  isUploading: string | null
  onAddDescBlock: (type: string, atIndex?: number, columnIndex?: number) => void
  onRemoveDescBlock: (index: number) => void
  onUpdateDescBlock: (index: number, field: 'type' | 'text' | 'image' | 'video', val: string) => void
  onUpdateDescListItems: (index: number, items: string[]) => void
  onMoveBlockToColumn: (mainIndex: number, col: number) => void
  onReorderColumnBlocks: (column: number, oldIdx: number, newIdx: number) => void
  onUploadDescBlockImage: (e: ChangeEvent<HTMLInputElement>, idx: number) => void
  onUploadGalleryItem: (e: ChangeEvent<HTMLInputElement>, blockIdx: number, itemIdx: number) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const colItems = sectionDraft.blocks
    .map((b, i) => ({ block: b, mainIdx: i }))
    .filter(({ block }) => (block.columnIndex ?? 0) === colIndex)

  const colIds = colItems.map(({ mainIdx }) => `col${colIndex}-${mainIdx}`)
  const targetCol = colIndex === 0 ? 1 : 0

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = colIds.indexOf(active.id as string)
    const newIdx = colIds.indexOf(over.id as string)
    if (oldIdx === -1 || newIdx === -1) return
    onReorderColumnBlocks(colIndex, oldIdx, newIdx)
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col border border-zinc-800/60 rounded-2xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-zinc-800/60 bg-zinc-900/40">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
        <span className="ml-2 text-[10px] text-zinc-700">{colItems.length} block{colItems.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {colItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-zinc-800 border-2 border-dashed border-zinc-800/50 rounded-xl gap-2">
            <Layers className="w-6 h-6" />
            <p className="text-xs">Empty column</p>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={colIds} strategy={verticalListSortingStrategy}>
            {colItems.map(({ block, mainIdx }, colPos) => (
              <div key={`col${colIndex}-${mainIdx}`}>
                {colPos === 0 && (
                  <AddBlockMenu onAdd={(type) => onAddDescBlock(type, undefined, colIndex)} />
                )}
                <SortableBlock
                  id={`col${colIndex}-${mainIdx}`}
                  index={mainIdx}
                  block={block}
                  isUploading={isUploading}
                  onRemove={() => onRemoveDescBlock(mainIdx)}
                  onUpdateText={(val) => onUpdateDescBlock(mainIdx, 'text', val)}
                  onUpdateListItems={(items) => onUpdateDescListItems(mainIdx, items)}
                  onUpdateVideo={(url) => onUpdateDescBlock(mainIdx, 'video', url)}
                  onUpdateImage={(url) => onUpdateDescBlock(mainIdx, 'image', url)}
                  onUploadImage={(e) => onUploadDescBlockImage(e, mainIdx)}
                  onUploadGalleryItem={(e, itemIdx) => onUploadGalleryItem(e, mainIdx, itemIdx)}
                  onMoveToColumn={() => onMoveBlockToColumn(mainIdx, targetCol)}
                  moveColumnLabel={`Move to Column ${targetCol + 1}`}
                />
                <AddBlockMenu onAdd={(type) => onAddDescBlock(type, undefined, colIndex)} />
              </div>
            ))}
          </SortableContext>
        </DndContext>

        <AddBlockButton onAdd={(type) => onAddDescBlock(type, undefined, colIndex)} />
      </div>
    </div>
  )
}

// ── Main SectionEditor ─────────────────────────────────────────────────────────
export function SectionEditor({
  sectionDraft,
  isUploading,
  onTitleChange,
  onImageChange,
  onVideoChange,
  onColumnsChange,
  onBreakpointChange,
  onAddDescBlock,
  onRemoveDescBlock,
  onUpdateDescBlock,
  onUpdateDescListItems,
  onMoveBlockToColumn,
  onReorderColumnBlocks,
  onUploadSectionImage,
  onUploadDescBlockImage,
  onUploadGalleryItem,
  onReorderBlocks,
}: SectionEditorProps) {
  const is2Col = sectionDraft.columns >= 2

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0">

      {/* ── Canvas ────────────────────────────────────────────────────────── */}
      {is2Col ? (
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex gap-4">
          <ColumnPane
            colIndex={0}
            label="Column 1"
            sectionDraft={sectionDraft}
            isUploading={isUploading}
            onAddDescBlock={onAddDescBlock}
            onRemoveDescBlock={onRemoveDescBlock}
            onUpdateDescBlock={onUpdateDescBlock}
            onUpdateDescListItems={onUpdateDescListItems}
            onMoveBlockToColumn={onMoveBlockToColumn}
            onReorderColumnBlocks={onReorderColumnBlocks}
            onUploadDescBlockImage={onUploadDescBlockImage}
            onUploadGalleryItem={onUploadGalleryItem}
          />
          <ColumnPane
            colIndex={1}
            label="Column 2"
            sectionDraft={sectionDraft}
            isUploading={isUploading}
            onAddDescBlock={onAddDescBlock}
            onRemoveDescBlock={onRemoveDescBlock}
            onUpdateDescBlock={onUpdateDescBlock}
            onUpdateDescListItems={onUpdateDescListItems}
            onMoveBlockToColumn={onMoveBlockToColumn}
            onReorderColumnBlocks={onReorderColumnBlocks}
            onUploadDescBlockImage={onUploadDescBlockImage}
            onUploadGalleryItem={onUploadGalleryItem}
          />
        </div>
      ) : (
        <SingleColumnCanvas
          sectionDraft={sectionDraft}
          isUploading={isUploading}
          onAddDescBlock={onAddDescBlock}
          onRemoveDescBlock={onRemoveDescBlock}
          onUpdateDescBlock={onUpdateDescBlock}
          onUpdateDescListItems={onUpdateDescListItems}
          onUploadDescBlockImage={onUploadDescBlockImage}
          onUploadGalleryItem={onUploadGalleryItem}
          onReorderBlocks={onReorderBlocks}
        />
      )}

      {/* ── Right: settings panel ────────────────────────────────────────── */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800/60 bg-zinc-950/60 backdrop-blur-sm">
        <div className="p-6 space-y-6 lg:sticky lg:top-0 overflow-y-auto max-h-screen">

          {/* Section settings */}
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

          {/* Column layout */}
          <div className="pt-4 border-t border-zinc-800/50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Layout
            </p>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => onColumnsChange(1)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-xs font-medium ${
                  !is2Col
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
                }`}
              >
                <Square className="w-4 h-4" />
                1 Column
              </button>
              <button
                type="button"
                onClick={() => onColumnsChange(2)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-xs font-medium ${
                  is2Col
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
                }`}
              >
                <Columns2 className="w-4 h-4" />
                2 Columns
              </button>
            </div>

            {is2Col && (
              <div>
                <p className="text-[10px] text-zinc-600 mb-2">Collapse columns below:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {BREAKPOINT_OPTIONS.map(({ value, label, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onBreakpointChange(value)}
                      className={`py-2 px-3 rounded-lg border text-left transition-all ${
                        sectionDraft.breakpoint === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider">{label}</div>
                      <div className="text-[9px] mt-0.5 opacity-70">{desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-700 mt-2">
                  Use ⇄ on each block to move it between columns.
                </p>
              </div>
            )}
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
