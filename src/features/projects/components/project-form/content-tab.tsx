'use client'

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
  useSortable,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LinkField } from '@/components/forms/link-field'
import { AddBlockMenu, AddBlockButton } from './add-block-menu'
import { SortableBlock } from './sortable-block'
import type { UseFormReturn } from 'react-hook-form'
import type { ProjectFormValues } from '@/features/projects/types/project'
import type { SectionState, DescBlock } from '@/features/projects/hooks/use-project-form'

// ── Types ─────────────────────────────────────────────────────────────────────

interface FieldItem {
  id: string
  [key: string]: unknown
}

interface FieldArrayLike {
  fields: FieldItem[]
  append: (value: unknown) => void
  remove: (index: number) => void
}

interface ContentTabProps {
  form: UseFormReturn<ProjectFormValues>
  imageFieldArray: FieldArrayLike
  sectionsState: SectionState[]
  isUploading: string | null
  onAddSection: () => void
  onRemoveSection: (idx: number) => void
  onReorderSections: (sections: SectionState[]) => void
  onUpdateSectionMeta: (idx: number, meta: Partial<Pick<SectionState, 'title' | 'image' | 'video'>>) => void
  onToggleSection: (idx: number) => void
  onToggleSectionSettings: (idx: number) => void
  onAddBlock: (sIdx: number, type: string, atIndex?: number) => void
  onRemoveBlock: (sIdx: number, bIdx: number) => void
  onUpdateBlock: (sIdx: number, bIdx: number, changes: Partial<DescBlock>) => void
  onReorderBlocks: (sIdx: number, newBlocks: DescBlock[]) => void
  onUpdateLayoutConfig: (sIdx: number, bIdx: number, cols: number, bp: string) => void
  onAddLayoutChild: (sIdx: number, bIdx: number, colIdx: number, type: string, atIndex?: number) => void
  onRemoveLayoutChild: (sIdx: number, bIdx: number, colIdx: number, childIdx: number) => void
  onUpdateLayoutChild: (sIdx: number, bIdx: number, colIdx: number, childIdx: number, changes: Partial<DescBlock>) => void
  onReorderLayoutColumn: (sIdx: number, bIdx: number, colIdx: number, newColBlocks: DescBlock[]) => void
  onUploadSectionImage: (sIdx: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onUploadBlockImage: (sIdx: number, bIdx: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onUploadGalleryItem: (sIdx: number, bIdx: number, itemIdx: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onFieldUpload: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, index?: number) => void
}

// ── Layout Block Editor ───────────────────────────────────────────────────────

const BREAKPOINTS = ['sm', 'md', 'lg', 'always'] as const

const BP_GRID: Record<string, string> = {
  sm: 'sm:grid-cols-2',
  md: 'md:grid-cols-2',
  lg: 'lg:grid-cols-2',
  always: 'grid-cols-2',
}

function LayoutColumnPane({
  colIdx,
  colBlocks,
  isUploading,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onReorder,
}: {
  colIdx: number
  colBlocks: DescBlock[]
  isUploading: string | null
  onAddBlock: (type: string, atIndex?: number) => void
  onRemoveBlock: (childIdx: number) => void
  onUpdateBlock: (childIdx: number, changes: Partial<DescBlock>) => void
  onReorder: (newBlocks: DescBlock[]) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const ids = colBlocks.map((b) => b._key)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oi = ids.indexOf(active.id as string)
    const ni = ids.indexOf(over.id as string)
    onReorder(arrayMove(colBlocks, oi, ni))
  }

  return (
    <div className="bg-zinc-950/40 p-3 min-h-[80px] flex flex-col">
      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 mb-2">
        Col {colIdx + 1}
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {colBlocks.map((block, childIdx) => (
            <div key={block._key}>
              {childIdx === 0 && <AddBlockMenu onAdd={(type) => onAddBlock(type, 0)} />}
              <SortableBlock
                id={block._key}
                index={childIdx}
                block={block}
                isUploading={isUploading}
                onRemove={() => onRemoveBlock(childIdx)}
                onUpdateText={(v) => onUpdateBlock(childIdx, { text: v })}
                onUpdateListItems={(items) => onUpdateBlock(childIdx, { items })}
                onUpdateVideo={(v) => onUpdateBlock(childIdx, { video: v })}
                onUpdateImage={(v) => onUpdateBlock(childIdx, { image: v })}
                onUploadImage={undefined}
                onUploadGalleryItem={undefined}
              />
              <AddBlockMenu onAdd={(type) => onAddBlock(type, childIdx + 1)} />
            </div>
          ))}
        </SortableContext>
      </DndContext>

      <AddBlockButton onAdd={(type) => onAddBlock(type)} />
    </div>
  )
}

function LayoutBlockEditor({
  block,
  isUploading,
  onRemove,
  onUpdateConfig,
  onAddChild,
  onRemoveChild,
  onUpdateChild,
  onReorderColumn,
}: {
  block: DescBlock
  isUploading: string | null
  onRemove: () => void
  onUpdateConfig: (cols: number, bp: string) => void
  onAddChild: (colIdx: number, type: string, atIndex?: number) => void
  onRemoveChild: (colIdx: number, childIdx: number) => void
  onUpdateChild: (colIdx: number, childIdx: number, changes: Partial<DescBlock>) => void
  onReorderColumn: (colIdx: number, newBlocks: DescBlock[]) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block._key,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const cols = block.layoutColumns ?? 2
  const bp = block.layoutBreakpoint ?? 'md'
  const children = block.children ?? Array.from({ length: cols }, () => [])

  const col3class = bp === 'always' ? 'grid-cols-3' : `grid-cols-1 ${BP_GRID[bp]?.replace('2', '3') ?? 'md:grid-cols-3'}`
  const col2class = `grid-cols-1 ${BP_GRID[bp] ?? 'md:grid-cols-2'}`
  const gridClass = cols === 1 ? 'grid-cols-1' : cols === 3 ? col3class : col2class

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`my-2 border border-zinc-700/60 rounded-xl overflow-hidden bg-zinc-900/20 ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/60 bg-zinc-900/60">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mr-1">
          Layout
        </span>
        {/* Column count */}
        <div className="flex gap-0.5">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onUpdateConfig(n, bp)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${cols === n ? 'bg-primary text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-zinc-700 text-[9px]">cols</span>
        {/* Breakpoint */}
        {cols > 1 && (
          <div className="flex gap-0.5 ml-2">
            {BREAKPOINTS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onUpdateConfig(cols, b)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${bp === b ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-zinc-700 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Columns */}
      <div className={`grid gap-px bg-zinc-800/30 ${gridClass}`}>
        {Array.from({ length: cols }, (_, colIdx) => (
          <LayoutColumnPane
            key={colIdx}
            colIdx={colIdx}
            colBlocks={children[colIdx] ?? []}
            isUploading={isUploading}
            onAddBlock={(type, atIdx) => onAddChild(colIdx, type, atIdx)}
            onRemoveBlock={(childIdx) => onRemoveChild(colIdx, childIdx)}
            onUpdateBlock={(childIdx, changes) => onUpdateChild(colIdx, childIdx, changes)}
            onReorder={(newBlocks) => onReorderColumn(colIdx, newBlocks)}
          />
        ))}
      </div>
    </div>
  )
}

// ── Section Panel ─────────────────────────────────────────────────────────────

function SectionPanel({
  section,
  sIdx,
  dragHandleProps,
  isUploading,
  onRemoveSection,
  onUpdateSectionMeta,
  onToggleSection,
  onToggleSectionSettings,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onReorderBlocks,
  onUpdateLayoutConfig,
  onAddLayoutChild,
  onRemoveLayoutChild,
  onUpdateLayoutChild,
  onReorderLayoutColumn,
  onUploadSectionImage,
  onUploadBlockImage,
  onUploadGalleryItem,
}: {
  section: SectionState
  sIdx: number
  dragHandleProps: Record<string, unknown>
  isUploading: string | null
  onRemoveSection: (idx: number) => void
  onUpdateSectionMeta: (idx: number, meta: Partial<Pick<SectionState, 'title' | 'image' | 'video'>>) => void
  onToggleSection: (idx: number) => void
  onToggleSectionSettings: (idx: number) => void
  onAddBlock: (sIdx: number, type: string, atIndex?: number) => void
  onRemoveBlock: (sIdx: number, bIdx: number) => void
  onUpdateBlock: (sIdx: number, bIdx: number, changes: Partial<DescBlock>) => void
  onReorderBlocks: (sIdx: number, newBlocks: DescBlock[]) => void
  onUpdateLayoutConfig: (sIdx: number, bIdx: number, cols: number, bp: string) => void
  onAddLayoutChild: (sIdx: number, bIdx: number, colIdx: number, type: string, atIndex?: number) => void
  onRemoveLayoutChild: (sIdx: number, bIdx: number, colIdx: number, childIdx: number) => void
  onUpdateLayoutChild: (sIdx: number, bIdx: number, colIdx: number, childIdx: number, changes: Partial<DescBlock>) => void
  onReorderLayoutColumn: (sIdx: number, bIdx: number, colIdx: number, newColBlocks: DescBlock[]) => void
  onUploadSectionImage: (sIdx: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onUploadBlockImage: (sIdx: number, bIdx: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onUploadGalleryItem: (sIdx: number, bIdx: number, itemIdx: number, e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const blockIds = section.blocks.map((b) => b._key)

  function handleBlockDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oi = blockIds.indexOf(active.id as string)
    const ni = blockIds.indexOf(over.id as string)
    onReorderBlocks(sIdx, arrayMove(section.blocks, oi, ni))
  }

  return (
    <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/40">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/60">
        <button
          type="button"
          {...dragHandleProps}
          className="p-1 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdateSectionMeta(sIdx, { title: e.target.value })}
          placeholder="Section title…"
          className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-zinc-600 min-w-0"
        />
        <button
          type="button"
          onClick={() => onToggleSectionSettings(sIdx)}
          title="Section settings"
          className={`p-1.5 rounded-lg transition-colors ${
            section.showSettings
              ? 'bg-primary/20 text-primary'
              : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemoveSection(sIdx)}
          title="Remove section"
          className="p-1.5 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onToggleSection(sIdx)}
          className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-colors"
        >
          {section.isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Body */}
      {section.isOpen && (
        <div className="border-t border-zinc-800/60">
          {/* Settings sub-panel */}
          {section.showSettings && (
            <div className="px-5 py-4 border-b border-zinc-800/40 bg-zinc-900/30 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Section Settings
              </p>
              <div className="grid gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1.5 block">Sidebar Image</label>
                  <LinkField
                    value={section.image}
                    onChange={(v) => onUpdateSectionMeta(sIdx, { image: v })}
                    onUpload={(e) => onUploadSectionImage(sIdx, e)}
                    uploading={isUploading === `s${sIdx}.image`}
                    placeholder="Upload or paste URL…"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1.5 block">Section Video</label>
                  <LinkField
                    value={section.video}
                    onChange={(v) => onUpdateSectionMeta(sIdx, { video: v })}
                    placeholder="YouTube URL…"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Block list */}
          <div className="px-5 py-4">
            {section.blocks.length === 0 && (
              <div className="text-center py-8 text-zinc-700 text-sm border-2 border-dashed border-zinc-800/60 rounded-xl mb-2">
                No blocks yet
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleBlockDragEnd}
            >
              <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
                {section.blocks.map((block, bIdx) => (
                  <div key={block._key}>
                    {bIdx === 0 && <AddBlockMenu onAdd={(type) => onAddBlock(sIdx, type, 0)} />}

                    {block.type === 'layout' ? (
                      <LayoutBlockEditor
                        block={block}
                        isUploading={isUploading}
                        onRemove={() => onRemoveBlock(sIdx, bIdx)}
                        onUpdateConfig={(cols, bp) => onUpdateLayoutConfig(sIdx, bIdx, cols, bp)}
                        onAddChild={(colIdx, type, atIndex) =>
                          onAddLayoutChild(sIdx, bIdx, colIdx, type, atIndex)
                        }
                        onRemoveChild={(colIdx, childIdx) =>
                          onRemoveLayoutChild(sIdx, bIdx, colIdx, childIdx)
                        }
                        onUpdateChild={(colIdx, childIdx, changes) =>
                          onUpdateLayoutChild(sIdx, bIdx, colIdx, childIdx, changes)
                        }
                        onReorderColumn={(colIdx, newBlocks) =>
                          onReorderLayoutColumn(sIdx, bIdx, colIdx, newBlocks)
                        }
                      />
                    ) : (
                      <SortableBlock
                        id={block._key}
                        index={bIdx}
                        block={block}
                        isUploading={isUploading}
                        onRemove={() => onRemoveBlock(sIdx, bIdx)}
                        onUpdateText={(v) => onUpdateBlock(sIdx, bIdx, { text: v })}
                        onUpdateListItems={(items) => onUpdateBlock(sIdx, bIdx, { items })}
                        onUpdateVideo={(v) => onUpdateBlock(sIdx, bIdx, { video: v })}
                        onUpdateImage={(v) => onUpdateBlock(sIdx, bIdx, { image: v })}
                        onUploadImage={(e) => onUploadBlockImage(sIdx, bIdx, e)}
                        onUploadGalleryItem={(e, itemIdx) =>
                          onUploadGalleryItem(sIdx, bIdx, itemIdx, e)
                        }
                      />
                    )}

                    <AddBlockMenu onAdd={(type) => onAddBlock(sIdx, type, bIdx + 1)} />
                  </div>
                ))}
              </SortableContext>
            </DndContext>

            <AddBlockButton onAdd={(type) => onAddBlock(sIdx, type)} />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sortable Section Wrapper ──────────────────────────────────────────────────

function SortableSectionPanel({
  section,
  sIdx,
  ...rest
}: { section: SectionState; sIdx: number } & Omit<
  Parameters<typeof SectionPanel>[0],
  'section' | 'sIdx' | 'dragHandleProps'
>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section._key,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50 z-50' : ''}>
      <SectionPanel
        section={section}
        sIdx={sIdx}
        dragHandleProps={{ ...attributes, ...listeners }}
        {...rest}
      />
    </div>
  )
}

// ── Main ContentTab ───────────────────────────────────────────────────────────

export function ContentTab({
  form,
  imageFieldArray,
  sectionsState,
  isUploading,
  onAddSection,
  onRemoveSection,
  onReorderSections,
  onUpdateSectionMeta,
  onToggleSection,
  onToggleSectionSettings,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onReorderBlocks,
  onUpdateLayoutConfig,
  onAddLayoutChild,
  onRemoveLayoutChild,
  onUpdateLayoutChild,
  onReorderLayoutColumn,
  onUploadSectionImage,
  onUploadBlockImage,
  onUploadGalleryItem,
  onFieldUpload,
}: ContentTabProps) {
  const { setValue, watch } = form
  const watchedProject = watch()

  const { fields: imageFields, append: appendImage, remove: removeImage } = imageFieldArray

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const sectionIds = sectionsState.map((s) => s._key)

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oi = sectionIds.indexOf(active.id as string)
    const ni = sectionIds.indexOf(over.id as string)
    onReorderSections(arrayMove(sectionsState, oi, ni))
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Sections
          </Label>
          <Button
            type="button"
            onClick={onAddSection}
            className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" /> Add Section
          </Button>
        </div>

        {sectionsState.length === 0 && (
          <div className="text-center py-16 text-zinc-600 text-sm border-2 border-dashed border-zinc-800 rounded-2xl">
            No sections yet. Click &quot;Add Section&quot; to start building.
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sectionsState.map((section, sIdx) => (
                <SortableSectionPanel
                  key={section._key}
                  section={section}
                  sIdx={sIdx}
                  isUploading={isUploading}
                  onRemoveSection={onRemoveSection}
                  onUpdateSectionMeta={onUpdateSectionMeta}
                  onToggleSection={onToggleSection}
                  onToggleSectionSettings={onToggleSectionSettings}
                  onAddBlock={onAddBlock}
                  onRemoveBlock={onRemoveBlock}
                  onUpdateBlock={onUpdateBlock}
                  onReorderBlocks={onReorderBlocks}
                  onUpdateLayoutConfig={onUpdateLayoutConfig}
                  onAddLayoutChild={onAddLayoutChild}
                  onRemoveLayoutChild={onRemoveLayoutChild}
                  onUpdateLayoutChild={onUpdateLayoutChild}
                  onReorderLayoutColumn={onReorderLayoutColumn}
                  onUploadSectionImage={onUploadSectionImage}
                  onUploadBlockImage={onUploadBlockImage}
                  onUploadGalleryItem={onUploadGalleryItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4 pt-4 border-t border-zinc-900">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Image Gallery
          </Label>
          <Button
            type="button"
            onClick={() => appendImage('')}
            variant="ghost"
            className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white"
          >
            <Plus className="w-3 h-3 mr-1.5" /> Add Image
          </Button>
        </div>

        <div className="space-y-2">
          {imageFields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex-1">
                <LinkField
                  value={(watchedProject.images?.[idx] as string) ?? ''}
                  onChange={(v) => setValue(`images.${idx}` as never, v as never)}
                  onUpload={(e) => onFieldUpload(e, 'images', idx)}
                  uploading={isUploading === `images.${idx}`}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeImage(idx)}
                className="w-8 h-8 text-zinc-600 hover:text-red-500 rounded-lg hover:bg-red-500/10 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
