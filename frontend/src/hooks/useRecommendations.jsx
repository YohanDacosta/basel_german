import { useCallback } from "react";
import schoolsData from "../data/schools.json";

const useRecommendations = () => {
  const getRecommendations = useCallback((answers) => {
    const schools = Object.values(schoolsData);
    const scoredSchools = schools.map((school) => {
      let score = 0;
      const reasons = [];

      // Working status and time availability
      if (answers.isWorking === "fulltime") {
        if (school.schedule.includes("evening")) {
          score += 20;
          reasons.push("Offers evening courses for working professionals");
        }
        if (school.schedule.includes("weekend")) {
          score += 15;
          reasons.push("Weekend courses available");
        }
      } else if (answers.isWorking === "parttime") {
        if (school.schedule.includes("afternoon")) {
          score += 15;
          reasons.push("Flexible afternoon schedule");
        }
        if (school.schedule.includes("evening")) {
          score += 10;
        }
      } else if (answers.isWorking === "no") {
        if (school.courseTypes.includes("intensive")) {
          score += 20;
          reasons.push("Intensive courses for faster progress");
        }
        if (school.schedule.includes("morning")) {
          score += 10;
        }
      }

      // Time availability matching
      if (answers.timeAvailable) {
        const timeMap = {
          mornings: "morning",
          afternoons: "afternoon",
          evenings: "evening",
          weekends: "weekend",
        };
        const scheduleKey = timeMap[answers.timeAvailable];
        if (scheduleKey && school.schedule.includes(scheduleKey)) {
          score += 15;
          reasons.push(`Matches your ${answers.timeAvailable} availability`);
        }
      }

      // Goal matching
      if (answers.goal === "integration") {
        if (school.features.includes("integration_focus")) {
          score += 25;
          reasons.push("Specializes in integration courses");
        }
        if (school.features.includes("subsidized")) {
          score += 10;
          reasons.push("Subsidized pricing available");
        }
      } else if (answers.goal === "career") {
        if (school.features.includes("business_german")) {
          score += 25;
          reasons.push("Offers business German courses");
        }
        if (school.features.includes("corporate_training")) {
          score += 15;
        }
        if (school.features.includes("job_search_support")) {
          score += 20;
          reasons.push("Includes job search support");
        }
      } else if (answers.goal === "certificate") {
        if (school.features.includes("certificate_prep")) {
          score += 30;
          reasons.push("Official certificate preparation");
        }
        if (school.features.includes("exam_prep")) {
          score += 20;
          reasons.push("Exam preparation courses");
        }
      } else if (answers.goal === "conversation") {
        if (school.features.includes("berlitz_method") || school.features.includes("inlingua_method")) {
          score += 20;
          reasons.push("Focuses on practical speaking skills");
        }
        if (school.features.includes("community_focus")) {
          score += 15;
          reasons.push("Community-oriented learning environment");
        }
      }

      // Current level matching
      if (answers.currentLevel) {
        const levelMap = {
          none: "a1",
          alpha: "alpha",
          a1: "a1",
          a2: "a2",
          b1: "b1",
          b2: "b2",
        };
        const neededLevel = levelMap[answers.currentLevel] || "a1";
        if (school.levels.includes(neededLevel)) {
          score += 10;
        }
        if (answers.currentLevel === "alpha" && school.levels.includes("alpha")) {
          score += 20;
          reasons.push("Offers alphabetization courses");
        }
      }

      // Budget matching
      if (answers.budget === "low") {
        if (school.priceRange.min < 300) {
          score += 25;
          reasons.push("Affordable pricing");
        }
        if (school.features.includes("subsidized") || school.features.includes("income_based_pricing")) {
          score += 20;
          reasons.push("Income-based pricing available");
        }
        if (school.features.includes("voucher_accepted")) {
          score += 15;
          reasons.push("Accepts Basel-Stadt vouchers");
        }
      } else if (answers.budget === "medium") {
        if (school.priceRange.min >= 300 && school.priceRange.max <= 3000) {
          score += 15;
          reasons.push("Mid-range pricing fits your budget");
        }
      } else if (answers.budget === "high") {
        if (school.features.includes("private_lessons")) {
          score += 20;
          reasons.push("Private lessons available");
        }
        if (school.features.includes("small_classes")) {
          score += 15;
          reasons.push("Small class sizes");
        }
      }

      // Childcare needs
      if (answers.hasChildren === true) {
        if (school.features.includes("childcare")) {
          score += 30;
          reasons.push("Childcare available during classes");
        }
        if (school.features.includes("women_only_courses")) {
          score += 10;
        }
      }

      return {
        ...school,
        score,
        reasons: [...new Set(reasons)].slice(0, 3),
        matchPercentage: Math.min(Math.round((score / 100) * 100), 100),
      };
    });

    return scoredSchools
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, []);

  return { getRecommendations };
};

export default useRecommendations;
