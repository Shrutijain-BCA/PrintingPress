// src/components/shared/FileUpload.tsx
import { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import type { DocumentFile } from '../../types'
import { formatFileSize } from '../../utils/format'

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
]

interface Props {
  onFilesChange: (files: DocumentFile[]) => void
}

export default function FileUpload({ onFilesChange }: Props) {
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [dragging, setDragging] = useState(false)

  const processFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const valid: DocumentFile[] = Array.from(incoming)
      .filter(f => ACCEPTED_TYPES.includes(f.type) && f.size <= 50 * 1024 * 1024)
      .map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        pages: Math.ceil(Math.random() * 20) + 1, // Replace with real page-count extraction
      }))
    const updated = [...files, ...valid]
    setFiles(updated)
    onFilesChange(updated)
  }

  const remove = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx)
    setFiles(updated)
    onFilesChange(updated)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }, [files]) // eslint-disable-line

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
          ${dragging
            ? 'border-[#FF6B00] bg-orange-50'
            : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/40'
          }
        `}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={e => processFiles(e.target.files)}
        />
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors
          ${dragging ? 'bg-[#FF6B00]' : 'bg-white shadow-sm'}
        `}>
          <Upload className={`w-8 h-8 ${dragging ? 'text-white' : 'text-[#FF6B00]'}`} />
        </div>
        <p className="font-bold text-gray-900 mb-1">
          {dragging ? 'Drop your files here' : 'Tap to browse or drag & drop'}
        </p>
        <p className="text-sm text-gray-400">PDF · Word · PPT · JPG · PNG &nbsp;·&nbsp; Max 50 MB</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(f.size)} · ~{f.pages} pages</p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <button
                onClick={e => { e.stopPropagation(); remove(i) }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
