// services/simpleRecommendation.ts
import User from '../models/User';
import Job from '../models/Job';
import Swipe from '../models/Swipe';

export class SimpleRecommendationService {
  
  async getRecommendations(userId: string, limit: number = 20) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Get jobs user has already swiped on
    const swipedJobIds = await Swipe.distinct('jobId', { userId });
    console.log(swipedJobIds);
    
    const candidates = await Job.find({
      _id: { $nin: swipedJobIds },
      hiring: true,
    }).limit(100).lean();
    
    const scoredJobs = candidates.map(job => ({
      ...job,
      score: this.calculateScore(user, job)
    }));
    
    // Sort by score and return top N
    scoredJobs.sort((a, b) => b.score - a.score);
    return scoredJobs.slice(0, limit);
  }
  
  private calculateScore(user: any, job: any): number {
    let score = 0;
    
    // 1. Skill Match (40 points)
    const userSkills = new Set(user.skills || []);
    const jobRequirements = new Set(job.requirements || []);
    const skillOverlap = [...userSkills].filter(s => jobRequirements.has(s)).length;
    
    if (jobRequirements.size > 0) {
      score += (skillOverlap / jobRequirements.size) * 40;
    }
    
    // 2. Interest/Domain Match (30 points)
    const userInterests = user.interests || [];
    if (job.domain && userInterests.some((interest: string) => 
      interest.toLowerCase().includes(job.domain.toLowerCase()) ||
      job.domain.toLowerCase().includes(interest.toLowerCase())
    )) {
      score += 30;
    }
    
    // 3. Location Match (20 points)
    if (user.city && job.city) {
      if (user.city === job.city) {
        score += 20;
      } else if (user.state && job.state && user.state === job.state) {
        score += 10;
      }
    }
    
    // 4. Freshness (10 points) - prefer recent jobs
    const hoursOld = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 10 - (hoursOld / 24));
    
    // 5. Random exploration (5 points) - add variety
    score += Math.random() * 5;
    
    return score;
  }
  
}