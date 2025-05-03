
import React from 'react';

class AIChat {
  static predefinedAnswers: Record<string, string> = {
    "why did engagement drop from day 14 to day 21": `Between Day 14 and Day 21 after Mutation 2, engagement saw a decline. During this interval, we tested a variant ad where the game element was swapped with Minecraft, but the rest of the visual—especially the Cola product—remained unchanged.

🎯 Here's what likely happened:

Audience fatigue: The core creative (featuring the Cola) was already familiar. Swapping only the game without refreshing the overall context may not have been novel enough to spark interest.

Mismatch in novelty: Minecraft has a nostalgic and specific fan base, but without cohesive changes to the ad's tone or messaging, it may have created a visual incongruity, making the update feel random instead of intentional.`,

    "why did engagement rise so rapidly from day 21 to day 28": `From Day 21 to Day 28, we observed a notable spike in engagement, coinciding with Mutation 3: the Cola product color was changed to a vibrant green.

🔬 Here's the breakdown:

Visual disruption drove curiosity: The unexpected color shift in a well-known product acted as a pattern interrupt. This sort of novelty triggers attention and drives user interaction.

Social virality effect: Such radical changes often lead to users sharing the ad or commenting, asking "Why is the Coke green?"—even if subconsciously. This builds hype loops.

Perceived special edition: Green product variants are often seen as limited editions or event-based tie-ins. Viewers might have speculated on exclusivity or thematic relevance (e.g. gaming collab, Earth Day), further boosting interaction.`,

    "is this sustainable": `✅ Yes — by design.

The intent behind Mutation 3 (turning the Cola drink green) was to ignite short-term hype through visual disruption. This tactic succeeded by amplifying attention and interaction.

💡 What makes it sustainable:

This was a strategic burst, not a permanent shift.

At Mutation 4, scheduled for post-Day 28, the ad will revert to the original Cola design, restoring familiarity.

This oscillation between shock and stability helps keep the audience engaged without oversaturating them with gimmicks.

📊 In essence: We leveraged novelty to reinvigorate the audience, and now we anchor the campaign with a return to the classic. This rhythm is key to long-term campaign health.`
  };

  static getResponse(question: string): string {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Check each predefined answer against the normalized question
    for (const [key, value] of Object.entries(this.predefinedAnswers)) {
      if (normalizedQuestion.includes(key)) {
        return value;
      }
    }
    
    // Default response if no match is found
    return `I don't have specific data on that question yet. I can help with:
    
• Why engagement dropped between days 14-21
• Why engagement rose between days 21-28
• Whether the engagement strategy is sustainable`;
  }
}

export default AIChat;
