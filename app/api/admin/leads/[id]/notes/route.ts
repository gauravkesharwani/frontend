import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // In production, fetch notes from database
    const mockNotes = [
      {
        id: 'note_001',
        content: 'Investor mentioned 1031 exchange deadline',
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ]

    return NextResponse.json({ notes: mockNotes })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      )
    }

    // In production:
    // 1. Create note in database
    // 2. Associate with lead

    console.log('Adding note to lead:', { id, content })

    const newNote = {
      id: `note_${Date.now()}`,
      content: content.trim(),
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
}
