export interface TransactionContext {
  amount: number;
  recipientId: string;
  merchantName?: string;
  merchantCategory?: string;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  time?: string;
  deviceInfo?: {
    fingerprint?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface UserHistory {
  avgAmount: number;
  maxAmount: number;
  transactionCount: number;
  lastTransactionTime?: string;
  lastLocation?: {
    lat: number;
    lng: number;
  };
  frequentMerchants: string[];
  frequentCategories: string[];
  avgDailyTransactions: number;
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskAssessment {
  decision: 'ALLOW' | 'ALLOW_WITH_WARNING' | 'REVIEW' | 'REJECT';
  riskScore: number;
  confidenceScore: number;
  fallbackUsed: boolean;
  reasons: string[];
  riskFactors: RiskFactor[];
  dataQualityScore: number;
  missingFields: string[];
  recommendations: string[];
}

export class EnhancedRiskScorer {
  private readonly HIGH_RISK_THRESHOLD = 60;
  private readonly MEDIUM_RISK_THRESHOLD = 30;
  
  assessRisk(
    transaction: TransactionContext,
    userHistory: UserHistory
  ): RiskAssessment {
    const riskFactors: RiskFactor[] = [];
    let fallbackUsed = false;
    const missingFields: string[] = [];
    
    // 1. Amount-based risk assessment
    const amountRisk = this.assessAmountRisk(transaction.amount, userHistory);
    riskFactors.push(amountRisk);
    
    // 2. Location-based risk assessment
    if (transaction.location) {
      const locationRisk = this.assessLocationRisk(transaction.location, userHistory.lastLocation);
      riskFactors.push(locationRisk);
    } else {
      missingFields.push('location');
      fallbackUsed = true;
      riskFactors.push({
        name: 'Missing Location',
        score: 15,
        weight: 0.2,
        reason: 'Location data unavailable - using historical patterns',
        severity: 'medium',
      });
    }
    
    // 3. Merchant-based risk assessment
    if (transaction.merchantName && transaction.merchantCategory) {
      const merchantRisk = this.assessMerchantRisk(
        transaction.merchantName,
        transaction.merchantCategory,
        userHistory
      );
      riskFactors.push(merchantRisk);
    } else {
      missingFields.push('merchant');
      fallbackUsed = true;
      riskFactors.push({
        name: 'Missing Merchant Data',
        score: 10,
        weight: 0.15,
        reason: 'Merchant information missing - inferred from transaction history',
        severity: 'low',
      });
    }
    
    // 4. Behavioral risk assessment
    const behaviorRisk = this.assessBehavioralRisk(transaction, userHistory);
    riskFactors.push(behaviorRisk);
    
    // 5. Velocity check
    const velocityRisk = this.assessVelocityRisk(userHistory);
    riskFactors.push(velocityRisk);
    
    // Calculate weighted risk score
    const totalRiskScore = this.calculateWeightedScore(riskFactors);
    
    // Calculate data quality score
    const dataQualityScore = this.calculateDataQuality(transaction, missingFields);
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidence(dataQualityScore, fallbackUsed);
    
    // Determine decision
    const decision = this.makeDecision(totalRiskScore, confidenceScore);
    
    // Generate reasons and recommendations
    const reasons = this.generateReasons(riskFactors, fallbackUsed);
    const recommendations = this.generateRecommendations(riskFactors, decision);
    
    return {
      decision,
      riskScore: Math.round(totalRiskScore),
      confidenceScore: Math.round(confidenceScore),
      fallbackUsed,
      reasons,
      riskFactors,
      dataQualityScore: Math.round(dataQualityScore),
      missingFields,
      recommendations,
    };
  }
  
  private assessAmountRisk(amount: number, history: UserHistory): RiskFactor {
    const avgRatio = amount / history.avgAmount;
    const maxRatio = amount / history.maxAmount;
    
    let score = 0;
    let severity: RiskFactor['severity'] = 'low';
    let reason = '';
    
    if (avgRatio > 4) {
      score = 25;
      severity = 'critical';
      reason = `Amount is ${avgRatio.toFixed(1)}x higher than your average transaction`;
    } else if (avgRatio > 2) {
      score = 20;
      severity = 'high';
      reason = `Amount is ${avgRatio.toFixed(1)}x higher than your average transaction`;
    } else if (avgRatio > 1.5) {
      score = 10;
      severity = 'medium';
      reason = `Amount is ${avgRatio.toFixed(1)}x higher than your average transaction`;
    } else {
      score = 0;
      severity = 'low';
      reason = 'Amount is within normal range';
    }
    
    return {
      name: 'Transaction Amount',
      score,
      weight: 0.25,
      reason,
      severity,
    };
  }
  
  private assessLocationRisk(
    location: { lat: number; lng: number },
    lastLocation?: { lat: number; lng: number }
  ): RiskFactor {
    if (!lastLocation) {
      return {
        name: 'Location Analysis',
        score: 5,
        weight: 0.2,
        reason: 'First transaction from this location',
        severity: 'low',
      };
    }
    
    const distance = this.calculateDistance(location, lastLocation);
    
    let score = 0;
    let severity: RiskFactor['severity'] = 'low';
    let reason = '';
    
    if (distance > 1000) {
      score = 20;
      severity = 'high';
      reason = `Transaction location is ${distance.toFixed(0)}km from last transaction`;
    } else if (distance > 500) {
      score = 15;
      severity = 'medium';
      reason = `Transaction location is ${distance.toFixed(0)}km from last transaction`;
    } else if (distance > 100) {
      score = 5;
      severity = 'low';
      reason = `Transaction location is ${distance.toFixed(0)}km from last transaction`;
    } else {
      score = 0;
      severity = 'low';
      reason = 'Transaction location is within normal range';
    }
    
    return {
      name: 'Location Analysis',
      score,
      weight: 0.2,
      reason,
      severity,
    };
  }
  
  private assessMerchantRisk(
    merchantName: string,
    merchantCategory: string,
    history: UserHistory
  ): RiskFactor {
    const isFrequentMerchant = history.frequentMerchants.includes(merchantName);
    const isFrequentCategory = history.frequentCategories.includes(merchantCategory);
    
    const highRiskCategories = ['gambling', 'crypto', 'forex', 'adult'];
    const isHighRiskCategory = highRiskCategories.includes(merchantCategory.toLowerCase());
    
    let score = 0;
    let severity: RiskFactor['severity'] = 'low';
    let reason = '';
    
    if (isHighRiskCategory) {
      score = 20;
      severity = 'high';
      reason = `Transaction in high-risk category: ${merchantCategory}`;
    } else if (!isFrequentMerchant && !isFrequentCategory) {
      score = 10;
      severity = 'medium';
      reason = 'New merchant and category for your account';
    } else if (!isFrequentMerchant) {
      score = 5;
      severity = 'low';
      reason = 'New merchant in familiar category';
    } else {
      score = 0;
      severity = 'low';
      reason = 'Trusted merchant';
    }
    
    return {
      name: 'Merchant Analysis',
      score,
      weight: 0.2,
      reason,
      severity,
    };
  }
  
  private assessBehavioralRisk(
    transaction: TransactionContext,
    history: UserHistory
  ): RiskFactor {
    const currentHour = transaction.time 
      ? new Date(transaction.time).getHours() 
      : new Date().getHours();
    
    const isUnusualTime = currentHour < 6 || currentHour > 23;
    
    let score = 0;
    let severity: RiskFactor['severity'] = 'low';
    let reason = '';
    
    if (isUnusualTime) {
      score = 10;
      severity = 'medium';
      reason = `Transaction at unusual time: ${currentHour}:00`;
    } else {
      score = 0;
      severity = 'low';
      reason = 'Transaction time is normal';
    }
    
    return {
      name: 'Behavioral Pattern',
      score,
      weight: 0.15,
      reason,
      severity,
    };
  }
  
  private assessVelocityRisk(history: UserHistory): RiskFactor {
    const velocityRatio = history.avgDailyTransactions > 0 
      ? 1 / history.avgDailyTransactions 
      : 1;
    
    let score = 0;
    let severity: RiskFactor['severity'] = 'low';
    let reason = '';
    
    if (history.avgDailyTransactions > 20) {
      score = 15;
      severity = 'high';
      reason = 'Unusually high transaction frequency detected';
    } else if (history.avgDailyTransactions > 10) {
      score = 10;
      severity = 'medium';
      reason = 'High transaction frequency';
    } else {
      score = 0;
      severity = 'low';
      reason = 'Normal transaction frequency';
    }
    
    return {
      name: 'Velocity Check',
      score,
      weight: 0.2,
      reason,
      severity,
    };
  }
  
  private calculateWeightedScore(factors: RiskFactor[]): number {
    return factors.reduce((total, factor) => {
      return total + (factor.score * factor.weight);
    }, 0);
  }
  
  private calculateDataQuality(
    transaction: TransactionContext,
    missingFields: string[]
  ): number {
    const totalFields = 5; // amount, location, merchant, time, device
    const presentFields = totalFields - missingFields.length;
    return (presentFields / totalFields) * 100;
  }
  
  private calculateConfidence(dataQuality: number, fallbackUsed: boolean): number {
    let confidence = dataQuality;
    
    if (fallbackUsed) {
      confidence -= 20;
    }
    
    return Math.max(0, Math.min(100, confidence));
  }
  
  private makeDecision(riskScore: number, confidenceScore: number): RiskAssessment['decision'] {
    if (riskScore >= 90) {
      return 'REJECT';
    } else if (riskScore >= this.HIGH_RISK_THRESHOLD) {
      return 'REVIEW';
    } else if (riskScore >= this.MEDIUM_RISK_THRESHOLD) {
      return 'ALLOW_WITH_WARNING';
    } else {
      return 'ALLOW';
    }
  }
  
  private generateReasons(factors: RiskFactor[], fallbackUsed: boolean): string[] {
    const reasons: string[] = [];
    
    if (fallbackUsed) {
      reasons.push('⚡ Fallback mode active - some data filled from historical patterns');
    }
    
    factors
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .forEach(factor => {
        const icon = this.getSeverityIcon(factor.severity);
        reasons.push(`${icon} ${factor.reason}`);
      });
    
    return reasons;
  }
  
  private generateRecommendations(
    factors: RiskFactor[],
    decision: RiskAssessment['decision']
  ): string[] {
    const recommendations: string[] = [];
    
    if (decision === 'REJECT') {
      recommendations.push('This transaction has been blocked for your security');
      recommendations.push('Contact support if you believe this is an error');
    } else if (decision === 'REVIEW') {
      recommendations.push('This transaction requires manual review');
      recommendations.push('You will be notified once the review is complete');
    } else if (decision === 'ALLOW_WITH_WARNING') {
      recommendations.push('Proceed with caution - unusual activity detected');
      
      const highRiskFactors = factors.filter(f => f.severity === 'high' || f.severity === 'critical');
      if (highRiskFactors.length > 0) {
        recommendations.push(`Review: ${highRiskFactors[0].reason}`);
      }
    } else {
      recommendations.push('Transaction appears safe to proceed');
    }
    
    return recommendations;
  }
  
  private getSeverityIcon(severity: RiskFactor['severity']): string {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }
  
  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const riskScorer = new EnhancedRiskScorer();
