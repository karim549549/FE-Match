/**
 * Score Actions Map
 * Maps action identifiers to their point values
 * Negative values = penalties (reduce score)
 * Positive values = rewards (increase score)
 */

export const SCORE_ACTIONS = {
  // Tooltip penalties (noob actions)
  TOOLTIP_USED: -10,

  // Form actions (can add more later)
  FORM_VALIDATION_ERROR: -5,
  FORM_SUBMIT_SUCCESS: 50,

  // OTP actions
  RESEND_CODE: -50,

  // Social login (can add more later)
  SOCIAL_LOGIN_GOOGLE: 0, // Neutral
  SOCIAL_LOGIN_APPLE: 0, // Neutral

  // Future actions can be added here
  // LOGIN_SUCCESS: 100,
  // LOGIN_FAILED: -20,
  // REGISTER_SUCCESS: 150,
  // etc.
} as const;

export type ScoreAction = keyof typeof SCORE_ACTIONS;

/**
 * Get point value for an action
 */
export function getScoreValue(action: ScoreAction): number {
  return SCORE_ACTIONS[action];
}
