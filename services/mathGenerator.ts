
import { GameLevel, Question } from '../types';

const generateRandomId = () => Math.random().toString(36).substring(2, 9);

export function generateQuestionSet(level: GameLevel, count: number = 20): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateSingleQuestion(level));
  }
  return questions;
}

function generateSingleQuestion(level: GameLevel): Question {
  const id = generateRandomId();
  
  switch (level) {
    case GameLevel.BASIC:
      return generateBasicQuestion(id);
    case GameLevel.INTERMEDIATE:
      return generateIntermediateQuestion(id);
    case GameLevel.ADVANCED:
      return generateAdvancedQuestion(id);
    case GameLevel.EXPERT:
      return generateExpertQuestion(id);
    case GameLevel.EXPERT_PLUS:
      return generateExpertPlusQuestion(id);
    default:
      return generateBasicQuestion(id);
  }
}

function generateBasicQuestion(id: string): Question {
  // 80% Sum/Mult, 20% Div/Sub
  const isHarder = Math.random() < 0.2;
  const op = isHarder 
    ? (Math.random() < 0.5 ? '-' : '/') 
    : (Math.random() < 0.5 ? '+' : 'x');

  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = (a + b).toString();
  } else if (op === 'x') {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    answer = (a * b).toString();
  } else if (op === '-') {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * a) + 1;
    answer = (a - b).toString();
  } else {
    // Division: result must be exact
    b = Math.floor(Math.random() * 9) + 2;
    const quotient = Math.floor(Math.random() * 10) + 1;
    a = b * quotient;
    answer = quotient.toString();
    return { id, expression: `${a} ÷ ${b}`, answer, level: GameLevel.BASIC, type: 'simple' };
  }

  return { id, expression: `${a} ${op} ${b}`, answer, level: GameLevel.BASIC, type: 'simple' };
}

function generateIntermediateQuestion(id: string): Question {
  // Same chance for all 4 + simple fractions
  const isFraction = Math.random() < 0.25;
  if (isFraction) {
    const denominators = [2, 3, 4, 5, 10];
    const den = denominators[Math.floor(Math.random() * denominators.length)];
    const num1 = Math.floor(Math.random() * (den - 1)) + 1;
    const num2 = Math.floor(Math.random() * (den - 1)) + 1;
    const sum = num1 + num2;
    
    // Simplification (very basic)
    const result = sum % den === 0 ? (sum / den).toString() : `${sum}/${den}`;
    return { 
      id, 
      expression: `${num1}/${den} + ${num2}/${den}`, 
      answer: result, 
      level: GameLevel.INTERMEDIATE, 
      type: 'fraction' 
    };
  }

  const ops = ['+', '-', 'x', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  if (op === '+') {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
    answer = (a + b).toString();
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 50;
    b = Math.floor(Math.random() * 50) + 1;
    answer = (a - b).toString();
  } else if (op === 'x') {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = (a * b).toString();
  } else {
    b = Math.floor(Math.random() * 12) + 2;
    const quotient = Math.floor(Math.random() * 12) + 1;
    a = b * quotient;
    answer = quotient.toString();
    return { id, expression: `${a} ÷ ${b}`, answer, level: GameLevel.INTERMEDIATE, type: 'simple' };
  }

  return { id, expression: `${a} ${op === 'x' ? '×' : op} ${b}`, answer, level: GameLevel.INTERMEDIATE, type: 'simple' };
}

function generateAdvancedQuestion(id: string): Question {
  // Numerical expressions
  const patterns = [
    () => {
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 10) + 2;
      const c = Math.floor(Math.random() * 20) + 1;
      return { exp: `(${a} × ${b}) + ${c}`, ans: (a * b + c).toString() };
    },
    () => {
      const a = Math.floor(Math.random() * 30) + 10;
      const b = Math.floor(Math.random() * 5) + 2;
      const c = Math.floor(Math.random() * 10) + 1;
      return { exp: `${a} - (${b} × ${c})`, ans: (a - (b * c)).toString() };
    },
    () => {
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 5) + 2;
      const c = Math.floor(Math.random() * 5) + 2;
      return { exp: `${a} × ${b} × ${c}`, ans: (a * b * c).toString() };
    }
  ];

  const { exp, ans } = patterns[Math.floor(Math.random() * patterns.length)]();
  return { id, expression: exp, answer: ans, level: GameLevel.ADVANCED, type: 'expression' };
}

function generateExpertQuestion(id: string): Question {
  // 3-digit calculations
  const ops = ['+', '-', 'x'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  if (op === '+') {
    a = Math.floor(Math.random() * 900) + 100;
    b = Math.floor(Math.random() * 900) + 100;
    answer = (a + b).toString();
    return { id, expression: `${a} + ${b}`, answer, level: GameLevel.EXPERT, type: 'simple' };
  } else if (op === '-') {
    a = Math.floor(Math.random() * 900) + 500;
    b = Math.floor(Math.random() * 400) + 100;
    answer = (a - b).toString();
    return { id, expression: `${a} - ${b}`, answer, level: GameLevel.EXPERT, type: 'simple' };
  } else {
    a = Math.floor(Math.random() * 100) + 10;
    b = Math.floor(Math.random() * 20) + 2;
    answer = (a * b).toString();
    return { id, expression: `${a} × ${b}`, answer, level: GameLevel.EXPERT, type: 'simple' };
  }
}

function generateExpertPlusQuestion(id: string): Question {
  const types = ['3-digit', 'fractions-diff', 'decimals', 'roots', 'powers', 'mixed'];
  const chosenType = types[Math.floor(Math.random() * types.length)];

  switch (chosenType) {
    case '3-digit': {
      const a = Math.floor(Math.random() * 900) + 100;
      const b = Math.floor(Math.random() * 900) + 100;
      const op = Math.random() > 0.5 ? '+' : '-';
      const ans = op === '+' ? a + b : a - b;
      return { id, expression: `${a} ${op} ${b}`, answer: ans.toString(), level: GameLevel.EXPERT_PLUS, type: 'simple' };
    }
    case 'fractions-diff': {
      const d1 = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const d2 = [2, 3, 4, 5].filter(d => d !== d1)[Math.floor(Math.random() * 3)];
      const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
      const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
      
      const commonDen = d1 * d2;
      const finalNum = (n1 * d2) + (n2 * d1);
      
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const commonFactor = gcd(finalNum, commonDen);
      const simplifiedNum = finalNum / commonFactor;
      const simplifiedDen = commonDen / commonFactor;

      const ans = simplifiedDen === 1 ? simplifiedNum.toString() : `${simplifiedNum}/${simplifiedDen}`;
      return { id, expression: `${n1}/${d1} + ${n2}/${d2}`, answer: ans, level: GameLevel.EXPERT_PLUS, type: 'fraction' };
    }
    case 'decimals': {
      const a = (Math.floor(Math.random() * 1000) / 100).toFixed(2);
      const b = (Math.floor(Math.random() * 1000) / 100).toFixed(2);
      const op = Math.random() > 0.5 ? '+' : '-';
      const ans = op === '+' ? parseFloat(a) + parseFloat(b) : parseFloat(a) - parseFloat(b);
      return { id, expression: `${a} ${op} ${b}`, answer: ans.toFixed(2).replace(/\.00$/, ''), level: GameLevel.EXPERT_PLUS, type: 'simple' };
    }
    case 'roots': {
      const roots = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400];
      const val = roots[Math.floor(Math.random() * roots.length)];
      return { id, expression: `√${val}`, answer: Math.sqrt(val).toString(), level: GameLevel.EXPERT_PLUS, type: 'simple' };
    }
    case 'powers': {
      const base = Math.floor(Math.random() * 10) + 2;
      const exp = Math.floor(Math.random() * 3) + 2;
      const ans = Math.pow(base, exp);
      return { id, expression: `${base}^${exp}`, answer: ans.toString(), level: GameLevel.EXPERT_PLUS, type: 'simple' };
    }
    default: {
      // Mixed Expert Plus
      const a = Math.floor(Math.random() * 5) + 2; // Power or mult base
      const b = [4, 9, 16, 25][Math.floor(Math.random() * 4)]; // root
      const c = (Math.floor(Math.random() * 50) / 10).toFixed(1); // decimal
      // pattern: a * sqrt(b) + c
      const ans = a * Math.sqrt(b) + parseFloat(c);
      return { id, expression: `(${a} × √${b}) + ${c}`, answer: ans.toFixed(1).replace(/\.0$/, ''), level: GameLevel.EXPERT_PLUS, type: 'expression' };
    }
  }
}
