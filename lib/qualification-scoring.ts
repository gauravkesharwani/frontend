import type {
  CapacityLevel,
  FitLevel,
  ProcessStyle,
  TimingLevel,
  QualificationBucket,
  InvestorQualification,
  QualificationAnswers,
} from '@/types/lead'

const CAPACITY_SCORES: Record<CapacityLevel, number> = {
  '$100K-$250K': 10,
  '$250K-$500K': 15,
  '$500K-$1M': 20,
  '$1M+': 25,
}

const FIT_SCORES: Record<FitLevel, number> = {
  high_priority: 25,
  medium_priority: 15,
  open_to_exploring: 10,
  not_a_focus: 5,
}

const PROCESS_SCORES: Record<ProcessStyle, number> = {
  toe_in: 10,
  meaningful_first: 20,
  full_commitment: 25,
}

const TIMING_SCORES: Record<TimingLevel, number> = {
  actively_deploying: 25,
  possibly_evaluating: 15,
  just_researching: 5,
}

// Default score for "other" (custom) answers - medium value
const OTHER_DEFAULT_SCORE = 15

function getScore<T extends string>(value: string | undefined, scores: Record<T, number>): number {
  if (!value) return 0
  // Custom "other:" answers get a default medium score
  if (value.startsWith('other:')) return OTHER_DEFAULT_SCORE
  return scores[value as T] ?? OTHER_DEFAULT_SCORE
}

export function calculateQualificationScore(answers: QualificationAnswers): number {
  let score = 0

  score += getScore(answers.capacity, CAPACITY_SCORES)
  score += getScore(answers.fit, FIT_SCORES)
  score += getScore(answers.process, PROCESS_SCORES)
  score += getScore(answers.timing, TIMING_SCORES)

  return score
}

export function determineQualificationBucket(score: number): QualificationBucket {
  if (score >= 70) {
    return 'active_intro'
  }
  if (score >= 40) {
    return 'nurture'
  }
  return 'not_qualified'
}

export function buildQualification(answers: QualificationAnswers): InvestorQualification | null {
  if (
    !answers.investorType ||
    !answers.capacity ||
    !answers.fit ||
    !answers.process ||
    !answers.timing
  ) {
    return null
  }

  const score = calculateQualificationScore(answers)
  const bucket = determineQualificationBucket(score)

  return {
    investorType: answers.investorType,
    capacity: answers.capacity,
    fit: answers.fit,
    process: answers.process,
    timing: answers.timing,
    score,
    bucket,
  }
}
