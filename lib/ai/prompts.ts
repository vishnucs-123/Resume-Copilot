export const PROMPTS = {
  REWRITE_EXPERIENCE: (bullet: string, role: string) => `
You are a professional resume writer helping someone get hired.
Rewrite this resume bullet point to be stronger:

Original: "${bullet}"
Target Role: ${role}

Rules:
- Start with a strong action verb
- Add measurable impact if possible
- Keep it under 20 words
- Return ONLY the rewritten bullet. No explanation.
`,

  GENERATE_SUMMARY: (name: string, role: string, yearsExp: string, skills: string[]) => `
Write a professional resume summary for:
Name: ${name}
Target Role: ${role}
Years of Experience: ${yearsExp}
Key Skills: ${skills.join(", ")}

Rules:
- 2-3 sentences maximum
- ATS-friendly
- Do NOT use "I"
- Do NOT use buzzwords like "passionate" or "dynamic"
- Return ONLY the summary paragraph. No explanation.
`,

  SUGGEST_SKILLS: (role: string, existingSkills: string[]) => `
For a ${role} position, suggest important technical and soft skills.
User already has: ${existingSkills.join(", ")}
Return ONLY a JSON array: ["Skill 1", "Skill 2"]
Maximum 10 skills. Return raw JSON only. No explanation.
`,

  ANALYZE_RESUME: (resumeText: string) => `
Analyze this resume and return a JSON report:
"""
${resumeText}
"""
Return ONLY this JSON (no markdown):
{
  "atsScore": 0-100,
  "strengths": ["max 3 items"],
  "weaknesses": ["max 5 items"],
  "missingElements": ["elements to add"],
  "keywordDensity": "low/medium/high",
  "readabilityScore": 0-100,
  "suggestions": ["max 5 improvements"]
}
`,

  MATCH_JOB: (resumeText: string, jobDescription: string) => `
Compare this resume against the job description:
Resume: """${resumeText}"""
Job Description: """${jobDescription}"""
Return ONLY this JSON (no markdown):
{
  "matchScore": 0-100,
  "matchedKeywords": ["keywords in both"],
  "missingKeywords": ["important JD keywords not in resume"],
  "missingSkills": ["skills JD requires that resume lacks"],
  "summaryTweak": "rewrite summary to better match this JD",
  "topSuggestions": ["3-5 specific changes to make"]
}
`,

  OPTIMIZE_FOR_JOB: (resumeText: string, jobDescription: string) => `
Rewrite this resume content to be optimized for the job description.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Rules:
- Inject relevant keywords naturally
- Rewrite the summary to match the JD
- Rephrase top 3 experience bullets to align with JD requirements
- Do NOT fabricate experience or skills
- Keep all facts accurate

Return ONLY this JSON (no markdown):
{
  "optimizedSummary": "...",
  "optimizedBullets": ["bullet 1", "bullet 2", "bullet 3"],
  "addedKeywords": ["keyword1", "keyword2"]
}
`,

  EXTRACT_RESUME_FROM_TEXT: (rawText: string) => `
Extract structured resume data from this raw text:
"""
${rawText}
"""
Return ONLY this JSON (no markdown):
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "summary": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "grade": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "techStack": [],
      "link": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": ""
    }
  ]
}
`,

  COPILOT_CHAT: (message: string, resumeContext: string) => `
You are an expert resume coach. The user is working on their resume.
Current resume context: """${resumeContext}"""
User message: "${message}"
Respond helpfully and concisely. Keep response under 150 words. Be direct and actionable.
`,
};