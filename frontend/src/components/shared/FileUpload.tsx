// src/components/shared/FileUpload.tsx
import { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle, Loader } from 'lucide-react'
import type { DocumentFile } from '../../types'
import { formatFileSize } from '../../utils/format'
import { api } from '../../utils/api'

const ACCEPTED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
]

interface UploadedDoc extends DocumentFile {
  _id?: string
  uploading?: boolean
  uploadError?: string
}

interface Props {
  onFilesChange: (files: DocumentFile[]) => void
}

export default function FileUpload({ onFilesChange }: Props) {
  const [files, setFiles]     = useState<UploadedDoc[]>([])
  const [dragging, setDragging] = useState(false)

  const uploadToServer = async (rawFiles: File[]): Promise<UploadedDoc[]> => {
    const formData = new FormData()
    rawFiles.forEach(f => formData.append('files', f))

    try {
      const res = await api.upload<{ data: { documents: any[] } }>('/documents', formData)
      return res.data.documents.map(d => ({
        _id:      d._id,
        name:     d.fileName,
        size:     d.fileSize,
        type:     d.mimeType,
        pages:    d.pageCount,
        fileUrl:  d.fileUrl,
        uploading: false,
      }))
    } catch {
      // Fallback — keep files local with estimated pages
      return rawFiles.map(f => ({
        name:     f.name,
        size:     f.size,
        type:     f.mimetype,
        pages:    Math.ceil(f.size / (1024 * 50)) || 1,
        uploading: false,
        uploadError: 'Upload failed — will retry on order',
      }))
    }
  }

  const processFiles = useCallback(async (incoming: FileList | null) => {
    if (!incoming) return
    const valid = Array.from(incoming).filter(
      f => ACCEPTED.includes(f.type) && f.size <= 50 * 1024 * 1024
    )
    if (!valid.length) return

    // Show uploading placeholders immediately
    const placeholders: UploadedDoc[] = valid.map(f => ({
      name: f.name, size: f.size, type: f.type, pages: 1, uploading: true,
    }))
    const updated = [...files, ...placeholders]
    setFiles(updated)

    // Upload to server
    const uploaded = await uploadToServer(valid)

    // Replace placeholders with real docs
    const final = [...files, ...uploaded]
    setFiles(final)
    onFilesChange(final)
  }, [files, onFilesChange])

  const remove = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx)
    setFiles(updated)
    onFilesChange(updated)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragging ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40'
        }`}
      >
        <input
          id="file-input" type="file" multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={e => processFiles(e.target.files)}
        />
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${dragging ? 'bg-[#FF6B00]' : 'bg-orange-50'}`}>
          <Upload className={`w-8 h-8 ${dragging ? 'text-white' : 'text-[#FF6B00]'}`} />
        </div>
        <p className="font-bold text-gray-900 mb-1">
          {dragging ? 'Drop files here' : 'Tap to browse or drag & drop'}
        </p>
        <p className="text-sm text-gray-400">PDF · Word · PPT · JPG · PNG &nbsp;·&nbsp; Max 50 MB</p>
      </div>

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
                {f.uploadError && <p className="text-xs text-red-400">{f.uploadError}</p>}
              </div>
              {f.uploading
                ? <Loader className="w-4 h-4 text-[#FF6B00] animate-spin flex-shrink-0" />
                : <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              }
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
