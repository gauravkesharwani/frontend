import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for uploaded files (in production, use proper file storage)
const uploadedFiles = new Map<string, { filename: string; content: string }>()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF or DOCX.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Read file content
    const content = await file.text()

    // Generate upload ID
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store for later extraction
    uploadedFiles.set(uploadId, {
      filename: file.name,
      content: content,
    })

    console.log('File uploaded:', { uploadId, filename: file.name, size: file.size })

    return NextResponse.json({
      uploadId,
      filename: file.name,
      status: 'uploaded',
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// Export the map for use in extract route
export { uploadedFiles }
