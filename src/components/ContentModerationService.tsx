interface ModerationResult {
  isViolation: boolean;
  violationType: 'hate-speech' | 'harassment' | 'threats' | 'discrimination' | 'spam' | 'none';
  severity: 'low' | 'medium' | 'high';
  flaggedWords: string[];
  reason: string;
}

interface UserViolation {
  id: string;
  timestamp: string;
  content: string;
  violationType: string;
  severity: string;
}

class ContentModerationService {
  private static instance: ContentModerationService;
  
  private hateSpeechKeywords = [
    // Slurs and discriminatory terms
    'hate', 'stupid', 'idiot', 'moron', 'loser', 'pathetic',
    // Threatening language
    'kill', 'die', 'hurt', 'attack', 'destroy', 'eliminate',
    // Harassment terms
    'harass', 'bully', 'torment', 'abuse', 'stalk',
    // Discriminatory language patterns
    'all [group] are', 'those people', 'they should be',
  ];

  private threatKeywords = [
    'kill you', 'hurt you', 'find you', 'come for you', 'get you',
    'violence', 'harm', 'threat', 'dangerous', 'weapon'
  ];

  private harassmentKeywords = [
    'shut up', 'go away', 'nobody likes you', 'you suck', 'worthless',
    'embarrassing', 'shame', 'disgusting', 'gross'
  ];

  private spamKeywords = [
    'click here', 'free money', 'make money fast', 'buy now',
    'limited time', 'act now', 'guaranteed'
  ];

  static getInstance(): ContentModerationService {
    if (!ContentModerationService.instance) {
      ContentModerationService.instance = new ContentModerationService();
    }
    return ContentModerationService.instance;
  }

  moderateContent(content: string, title?: string): ModerationResult {
    const fullText = `${title || ''} ${content}`.toLowerCase();
    const flaggedWords: string[] = [];
    let violationType: ModerationResult['violationType'] = 'none';
    let severity: ModerationResult['severity'] = 'low';
    let reason = '';

    // Check for hate speech
    const hateSpeechFound = this.hateSpeechKeywords.filter(keyword => {
      if (fullText.includes(keyword.toLowerCase())) {
        flaggedWords.push(keyword);
        return true;
      }
      return false;
    });

    // Check for threats
    const threatsFound = this.threatKeywords.filter(keyword => {
      if (fullText.includes(keyword.toLowerCase())) {
        flaggedWords.push(keyword);
        return true;
      }
      return false;
    });

    // Check for harassment
    const harassmentFound = this.harassmentKeywords.filter(keyword => {
      if (fullText.includes(keyword.toLowerCase())) {
        flaggedWords.push(keyword);
        return true;
      }
      return false;
    });

    // Check for spam
    const spamFound = this.spamKeywords.filter(keyword => {
      if (fullText.includes(keyword.toLowerCase())) {
        flaggedWords.push(keyword);
        return true;
      }
      return false;
    });

    // Check for excessive caps (potential shouting/aggression)
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    const excessiveCaps = capsRatio > 0.5 && content.length > 10;

    // Check for repeated characters (potential spam/harassment)
    const repeatedChars = /(.)\1{4,}/.test(content);

    // Determine violation type and severity
    if (threatsFound.length > 0) {
      violationType = 'threats';
      severity = 'high';
      reason = 'Content contains threatening language that could be harmful to other users.';
    } else if (hateSpeechFound.length > 0) {
      violationType = 'hate-speech';
      severity = hateSpeechFound.length > 2 ? 'high' : 'medium';
      reason = 'Content contains hate speech or discriminatory language.';
    } else if (harassmentFound.length > 0) {
      violationType = 'harassment';
      severity = harassmentFound.length > 1 ? 'medium' : 'low';
      reason = 'Content contains language that could be considered harassment or bullying.';
    } else if (spamFound.length > 0 || repeatedChars) {
      violationType = 'spam';
      severity = 'low';
      reason = 'Content appears to be spam or contains excessive repeated characters.';
    } else if (excessiveCaps) {
      violationType = 'harassment';
      severity = 'low';
      reason = 'Content uses excessive capital letters which may be perceived as shouting or aggressive.';
    }

    // Additional contextual checks
    if (this.containsPersonalAttacks(fullText)) {
      violationType = 'harassment';
      severity = severity === 'low' ? 'medium' : 'high';
      reason = 'Content contains personal attacks against other users.';
    }

    const isViolation = violationType !== 'none';

    return {
      isViolation,
      violationType,
      severity,
      flaggedWords,
      reason
    };
  }

  private containsPersonalAttacks(text: string): boolean {
    const personalAttackPatterns = [
      /you are (stupid|dumb|worthless|pathetic)/,
      /you're (stupid|dumb|worthless|pathetic)/,
      /(shut up|go away|nobody cares)/,
      /you (suck|fail|are wrong)/
    ];

    return personalAttackPatterns.some(pattern => pattern.test(text));
  }

  // Enhanced moderation for youth platform
  checkForInappropriateContent(content: string): ModerationResult {
    const baseResult = this.moderateContent(content);
    
    // Additional youth-specific checks
    const youthInappropriate = [
      'alcohol', 'drugs', 'party', 'skip school', 'cheat on test',
      'fake id', 'underage', 'sneak out'
    ];

    const flaggedYouthContent = youthInappropriate.filter(term => 
      content.toLowerCase().includes(term)
    );

    if (flaggedYouthContent.length > 0) {
      return {
        isViolation: true,
        violationType: 'discrimination',
        severity: 'medium',
        flaggedWords: [...baseResult.flaggedWords, ...flaggedYouthContent],
        reason: 'Content may contain inappropriate material for a youth-focused platform.'
      };
    }

    return baseResult;
  }
}

// User violation tracking
export class UserViolationTracker {
  private static violations = new Map<string, UserViolation[]>();
  private static readonly MAX_VIOLATIONS = 3;
  private static readonly VIOLATION_WINDOW_HOURS = 24;

  static addViolation(userId: string, content: string, violationType: string, severity: string): void {
    const violation: UserViolation = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      content: content.substring(0, 100), // Store first 100 chars for reference
      violationType,
      severity
    };

    const userViolations = this.violations.get(userId) || [];
    userViolations.push(violation);
    this.violations.set(userId, userViolations);

    // Clean up old violations (older than 24 hours)
    this.cleanupOldViolations(userId);
  }

  static getViolationCount(userId: string): number {
    const userViolations = this.violations.get(userId) || [];
    const recentViolations = this.getRecentViolations(userId);
    return recentViolations.length;
  }

  static shouldLogoutUser(userId: string): boolean {
    const violationCount = this.getViolationCount(userId);
    return violationCount >= this.MAX_VIOLATIONS;
  }

  static getRecentViolations(userId: string): UserViolation[] {
    const userViolations = this.violations.get(userId) || [];
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - this.VIOLATION_WINDOW_HOURS);

    return userViolations.filter(violation => 
      new Date(violation.timestamp) > cutoffTime
    );
  }

  private static cleanupOldViolations(userId: string): void {
    const recentViolations = this.getRecentViolations(userId);
    this.violations.set(userId, recentViolations);
  }

  static getUserViolations(userId: string): UserViolation[] {
    return this.violations.get(userId) || [];
  }

  static clearUserViolations(userId: string): void {
    this.violations.delete(userId);
  }
}

export { ContentModerationService };
export type { ModerationResult, UserViolation };