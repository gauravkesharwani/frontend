import { NextRequest, NextResponse } from 'next/server'
import { generateChatCompletion } from '@/lib/openai-client'
import { DealMemoExtraction } from '@/types/deal'

// Extraction prompt for OpenAI
const EXTRACTION_PROMPT = `You are an expert at extracting structured information from real estate investment deal memos.

Extract the following information from the deal memo text and return it as a JSON object:

{
  "name": "Deal/Fund name",
  "dealType": "Type of real estate (multifamily, commercial, industrial, retail, office, mixed-use, land, hospitality, healthcare, self-storage, mobile-home-park, other)",
  "summary": "Brief 1-2 sentence summary of the deal",
  "thesis": "Investment thesis explaining why this deal makes sense",
  "minimumInvestment": Minimum investment amount as a number (no currency symbols),
  "targetReturn": "Target return as a string (e.g., '15-18% IRR')",
  "riskFactors": ["array", "of", "key", "risks"],
  "idealInvestorProfile": "Description of ideal investor",
  "structure": "Deal structure (e.g., LP/GP, REIT, JV)",
  "timeline": "Investment timeline or hold period",
  "confidence": Your confidence score from 0 to 1 based on how complete the information was
}

If information is not available, use reasonable defaults or leave fields empty.
Return ONLY valid JSON, no other text.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uploadId } = body

    if (!uploadId) {
      return NextResponse.json(
        { error: 'uploadId is required' },
        { status: 400 }
      )
    }

    // In production, retrieve the uploaded file content
    // For now, we'll use mock text for demonstration

    // Mock deal memo text for demonstration
    const documentText = `
    PRIVATE OFFERING MEMORANDUM

    Sunset Apartments Fund III

    A Value-Add Multifamily Investment Opportunity

    EXECUTIVE SUMMARY

    Sunset Apartments Fund III is a real estate private equity fund focused on acquiring and improving
    Class B and C multifamily properties in high-growth Sun Belt markets. The fund targets a 15-18%
    net IRR over a 5-7 year hold period.

    INVESTMENT THESIS

    The Sun Belt region continues to experience significant population and job growth, driving strong
    demand for workforce housing. By acquiring underperforming properties and implementing operational
    improvements and targeted renovations, we can meaningfully increase NOI and generate attractive
    risk-adjusted returns.

    FUND TERMS

    Minimum Investment: $100,000
    Target Return: 15-18% Net IRR
    Fund Size: $75 million
    Structure: LP/GP
    Hold Period: 5-7 years
    Management Fee: 1.5% annually
    Carried Interest: 20% above 8% preferred return

    RISK FACTORS

    - Market conditions may affect property values and rental rates
    - Interest rate changes may impact financing costs
    - Execution risk in renovation and operational improvements
    - Concentration risk in Sun Belt markets

    IDEAL INVESTOR PROFILE

    This fund is suitable for accredited investors seeking passive income generation with moderate
    risk tolerance. Investors should have a minimum 5-7 year investment horizon and be comfortable
    with illiquid investments.
    `

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return mock extraction if OpenAI is not configured
      console.log('OpenAI not configured, returning mock extraction')

      const mockExtraction: DealMemoExtraction = {
        name: 'Sunset Apartments Fund III',
        dealType: 'multifamily',
        summary: 'A value-add multifamily fund targeting Class B and C properties in Sun Belt markets with strong rent growth potential.',
        thesis: 'Capitalize on Sun Belt population growth and housing demand by acquiring underperforming properties and implementing operational improvements to increase NOI.',
        minimumInvestment: 100000,
        targetReturn: '15-18% IRR',
        riskFactors: ['market_risk', 'interest_rate_risk', 'execution_risk', 'concentration_risk'],
        idealInvestorProfile: 'Accredited investors seeking passive income with moderate risk tolerance and 5-7 year investment horizon.',
        structure: 'LP/GP',
        timeline: '5-7 years',
        confidence: 0.92,
        rawText: documentText.trim(),
      }

      return NextResponse.json({
        extraction: mockExtraction,
        rawText: documentText.trim(),
      })
    }

    // Use OpenAI to extract structured data
    const response = await generateChatCompletion(
      [
        {
          role: 'user',
          content: `Extract information from this deal memo:\n\n${documentText}`,
        },
      ],
      {
        instructions: EXTRACTION_PROMPT,
        reasoning: 'medium',
      }
    )

    // Parse the JSON response
    let extraction: DealMemoExtraction

    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanResponse = response.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7)
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.slice(3)
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3)
      }

      const parsed = JSON.parse(cleanResponse.trim())

      extraction = {
        name: parsed.name || 'Untitled Deal',
        dealType: parsed.dealType || 'other',
        summary: parsed.summary || '',
        thesis: parsed.thesis || '',
        minimumInvestment: parsed.minimumInvestment || 0,
        targetReturn: parsed.targetReturn || '',
        riskFactors: Array.isArray(parsed.riskFactors) ? parsed.riskFactors : [],
        idealInvestorProfile: parsed.idealInvestorProfile || '',
        structure: parsed.structure || '',
        timeline: parsed.timeline || '',
        confidence: parsed.confidence || 0.5,
        rawText: documentText.trim(),
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse extraction results' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      extraction,
      rawText: documentText.trim(),
    })
  } catch (error) {
    console.error('Error extracting deal data:', error)
    return NextResponse.json(
      { error: 'Failed to extract deal information' },
      { status: 500 }
    )
  }
}
