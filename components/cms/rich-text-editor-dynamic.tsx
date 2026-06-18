'use client'

import dynamic from 'next/dynamic'
import { Loader } from 'lucide-react'
import { Suspense } from 'react'

const RichTextEditorContent = dynamic(
  () => import('./rich-text-editor').then((mod) => ({ default: mod.RichTextEditor })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 border border-slate-200 rounded">
        <Loader className="w-5 h-5 animate-spin" />
      </div>
    ),
    ssr: false,
  }
)

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8 border border-slate-200 rounded">
    <Loader className="w-5 h-5 animate-spin" />
  </div>
)

interface RichTextEditorDynamicProps {
  content: string
  onChange: (content: string) => void
  onImageUpload?: (file: File) => Promise<string>
  placeholder?: string
}

export function RichTextEditorDynamic({
  content,
  onChange,
  onImageUpload,
  placeholder,
}: RichTextEditorDynamicProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RichTextEditorContent
        content={content}
        onChange={onChange}
        onImageUpload={onImageUpload}
        placeholder={placeholder}
      />
    </Suspense>
  )
}
