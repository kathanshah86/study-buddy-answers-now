
export interface SampleQA {
  question: string;
  answer: string;
  keywords: string[];
}

export const sampleAnswers: SampleQA[] = [
  {
    question: "What is the Pythagorean theorem?",
    answer: "The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides. It's written as a² + b² = c², where c is the hypotenuse and a and b are the other two sides.",
    keywords: ["pythagorean", "theorem", "triangle", "right", "hypotenuse"]
  },
  {
    question: "What caused World War I?",
    answer: "World War I was caused by a complex set of factors, including militarism, alliances, imperialism, and nationalism. The immediate trigger was the assassination of Archduke Franz Ferdinand of Austria-Hungary in June 1914 by a Serbian nationalist. This led to a chain reaction of alliance activations and declarations of war.",
    keywords: ["world war", "wwi", "world war 1", "causes", "history"]
  },
  {
    question: "How does photosynthesis work?",
    answer: "Photosynthesis is the process used by plants, algae and certain bacteria to convert light energy (usually from the sun) into chemical energy. During photosynthesis, plants take in carbon dioxide (CO₂) and water (H₂O) from their environment and, using energy from sunlight, convert these compounds into glucose (C₆H₁₂O₆) and oxygen (O₂). The basic equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂.",
    keywords: ["photosynthesis", "plants", "energy", "light", "carbon dioxide"]
  },
  {
    question: "What are Newton's laws of motion?",
    answer: "Newton's laws of motion are three fundamental principles describing the relationship between an object's motion and the forces acting on it:\n\n1. First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.\n\n2. Second Law: Force equals mass times acceleration (F = ma).\n\n3. Third Law: For every action, there is an equal and opposite reaction.",
    keywords: ["newton", "laws", "motion", "physics", "force"]
  },
  {
    question: "What is the central dogma of molecular biology?",
    answer: "The central dogma of molecular biology describes the flow of genetic information within a biological system. It states that information transfers from DNA to RNA through transcription, and from RNA to protein through translation. In some cases, information can transfer from RNA back to DNA through reverse transcription. This process forms the foundation for how genes are expressed in organisms.",
    keywords: ["central dogma", "biology", "dna", "rna", "protein", "transcription", "translation"]
  }
];

export const findAnswer = (question: string): string => {
  const lowercasedQuestion = question.toLowerCase();
  
  // Look for exact matches in sample questions
  const exactMatch = sampleAnswers.find(qa => 
    qa.question.toLowerCase() === lowercasedQuestion
  );
  
  if (exactMatch) return exactMatch.answer;
  
  // Look for keyword matches
  const keywordMatch = sampleAnswers.find(qa =>
    qa.keywords.some(keyword => lowercasedQuestion.includes(keyword.toLowerCase()))
  );
  
  if (keywordMatch) return keywordMatch.answer;
  
  // Default response if no match is found
  return "I don't have specific information about that yet. Could you rephrase your question or ask something about math, physics, biology, or history?";
};
