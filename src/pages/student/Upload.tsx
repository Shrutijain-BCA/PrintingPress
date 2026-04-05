// src/pages/student/Upload.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import FileUpload from '../../components/shared/FileUpload'
import Button from '../../components/ui/Button'
import type { DocumentFile } from '../../types'

export default function Upload() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<DocumentFile[]>([])

  const totalPages = files.reduce((s, f) => s + f.pages, 0)

  return (
    <div className="px-4 pt-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Upload Documents</h1>
        <p className="text-sm text-gray-400 mt-1">PDF · Word · PPT · Images — up to 50 MB each</p>
      </div>

      <FileUpload onFilesChange={setFiles} />

      {files.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:border-0 md:bg-transparent md:mt-6 md:p-0">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#FF6B00] rounded-2xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-black">{files.length} file{files.length > 1 ? 's' : ''} ready</p>
                <p className="text-orange-100 text-xs">{totalPages} pages total</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate('/print-options', { state: { files } })}
                className="bg-white text-[#FF6B00] hover:bg-orange-50 border-0"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
