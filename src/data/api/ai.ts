import type { AIResponse } from '../../types';

const aiResponses: Record<string, AIResponse> = {
  '为什么0不能做除数': {
    explanation: '小朋友，你想想看，如果0能做除数的话，会发生很奇怪的事情哦！比如5÷0，这个式子是什么意思呢？它是问"0乘以多少等于5"。但是0乘以任何数都等于0，永远不可能等于5，所以这个式子没有答案。再比如0÷0，它问的是"0乘以多少等于0"，任何数乘以0都等于0，所以答案有无数个，这样就乱套了！所以为了避免这些奇怪的情况，我们规定0不能做除数。',
    deepExplanation: '从数学定义来看，除法是乘法的逆运算。对于a÷b=c，意味着b×c=a。当b=0时：如果a≠0，那么不存在c使得0×c=a；如果a=0，那么任何c都满足0×c=0，商不唯一。因此，0做除数在数学上是无意义的，违反了运算的确定性原则。',
    relatedTopics: ['除法的意义', '乘除法的关系', '四则运算'],
  },
  '什么是乘法分配律': {
    explanation: '乘法分配律就像给小朋友分糖果一样！比如有3个小朋友，每个小朋友要分2颗牛奶糖和3颗水果糖，总共要分多少颗糖呢？我们可以先算每个小朋友分几颗：2+3=5颗，再乘以3个小朋友：3×5=15颗。也可以先算牛奶糖：3×2=6颗，再算水果糖：3×3=9颗，最后加起来：6+9=15颗。两种方法结果一样，这就是乘法分配律：(a+b)×c=a×c+b×c。',
    deepExplanation: '乘法分配律是乘法对加法的分配性质，用字母表示为(a+b)×c=a×c+b×c。它不仅适用于两个数的和，还适用于多个数的和，即(a+b+c)×d=a×d+b×d+c×d。此外，它还可以逆向应用，即a×c+b×c=(a+b)×c，这在简便计算中非常有用。',
    relatedTopics: ['运算定律', '简便计算', '乘法结合律'],
  },
  '为什么三角形内角和是180度': {
    explanation: '小朋友，你可以做一个小实验来验证！拿一张纸剪一个任意三角形，把三个角剪下来，然后把它们的顶点拼在一起，你会发现三个角正好拼成一个平角，也就是180度！这就是三角形内角和是180度的秘密。不管是什么样的三角形，锐角三角形、直角三角形还是钝角三角形，内角和都是180度哦！',
    deepExplanation: '从几何证明的角度，我们可以通过作平行线来证明。过三角形的一个顶点作对边的平行线，根据平行线的性质，内错角相等，这样三角形的三个内角就转化成了一个平角，平角是180度，所以三角形内角和是180度。这个性质是欧几里得几何的基本定理之一。',
    relatedTopics: ['三角形', '角的分类', '平行线'],
  },
  '小数和分数有什么关系': {
    explanation: '小数和分数是好朋友，可以互相转化哦！比如0.5就是一半，也就是1/2；0.25就是四分之一，也就是1/4。一位小数表示十分之几，两位小数表示百分之几，三位小数表示千分之几。反过来，分数也可以变成小数，比如3/4就是3除以4等于0.75。',
    deepExplanation: '小数实际上是分数的一种特殊形式，是以10的幂为分母的分数。0.a=a/10，0.ab=ab/100，0.abc=abc/1000。有限小数和无限循环小数都可以转化为分数，而无限不循环小数（如π）不能转化为分数，它们是无理数。',
    relatedTopics: ['小数的意义', '分数', '分数与小数互化'],
  },
};

export const aiExplain = async (question: string): Promise<AIResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const trimmedQuestion = question.trim();
  const matchedKey = Object.keys(aiResponses).find(key => 
    trimmedQuestion.includes(key) || key.includes(trimmedQuestion)
  );
  
  if (matchedKey) {
    return aiResponses[matchedKey];
  }
  
  return {
    explanation: `老师来帮你解答"${question}"这个问题！${getGenericExplanation(question)}`,
    deepExplanation: `从更深层次来看，${getDeepExplanation(question)}`,
    relatedTopics: ['相关知识点', '深入学习'],
  };
};

const getGenericExplanation = (question: string): string => {
  if (question.includes('乘法')) {
    return '乘法是求几个相同加数和的简便运算。比如3×4就是3个4相加，或者4个3相加。掌握乘法能帮助我们快速计算很多相同数量的总和。';
  }
  if (question.includes('除法')) {
    return '除法是平均分的运算。比如把12个苹果平均分给3个小朋友，每个小朋友分到4个，就是12÷3=4。除法是乘法的逆运算。';
  }
  if (question.includes('角')) {
    return '角是由两条有公共端点的射线组成的图形。我们可以用量角器来测量角的大小，单位是度。根据度数大小，角可以分为锐角、直角、钝角、平角和周角。';
  }
  if (question.includes('三角形')) {
    return '三角形是由三条线段首尾相连组成的封闭图形。它有三条边、三个角和三个顶点，具有稳定性。三角形的内角和是180度。';
  }
  if (question.includes('小数')) {
    return '小数是表示十分之几、百分之几、千分之几……的数。小数点左边是整数部分，右边是小数部分。小数在生活中很常见，比如商品价格、测量长度等。';
  }
  if (question.includes('运算')) {
    return '四则运算包括加、减、乘、除。在混合运算中，要先算乘除，后算加减，有括号的先算括号里面的。正确的运算顺序能保证计算结果的准确性。';
  }
  return '这个问题很有趣！让我们一起来探索吧。首先，我们需要理解问题的核心概念，然后逐步分析，最后找到答案。学习数学就像解谜一样，每一步都很重要！';
};

const getDeepExplanation = (question: string): string => {
  if (question.includes('乘法')) {
    return '乘法运算满足交换律、结合律和分配律。这些运算定律可以帮助我们简化计算，提高计算效率。乘法在代数、几何、概率等多个数学领域都有广泛应用。';
  }
  if (question.includes('除法')) {
    return '除法运算中，除数不能为0，这是数学中的基本规定。除法可以转化为乘法，即a÷b=a×(1/b)。在分数运算中，除以一个数等于乘以它的倒数。';
  }
  if (question.includes('角')) {
    return '角的概念在几何学中非常基础。角度的测量单位除了度，还有弧度。角的大小与边的长度无关，只与两条边张开的程度有关。';
  }
  if (question.includes('三角形')) {
    return '三角形是平面几何中最基本的图形之一。根据边和角的不同，三角形有多种分类。三角形的面积公式、勾股定理等都是重要的几何知识。';
  }
  if (question.includes('小数')) {
    return '小数和分数的等价关系是数学中的重要概念。小数的性质、小数点移动规律等都是小数运算的基础。理解小数有助于后续学习百分数、比例等知识。';
  }
  return '这个问题涉及到数学中的核心概念。深入理解这些概念不仅能帮助我们解决当前的问题，还能为未来学习更复杂的数学知识打下坚实的基础。';
};

export const aiAnalyzeMistake = async (
  _question: string,
  userAnswer: string,
  correctAnswer: string
): Promise<{
  errorType: 'careless' | 'concept' | 'method' | 'reading';
  analysis: string;
  relatedKnowledge: string;
  similarQuestions: string[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const lowerUser = userAnswer.toLowerCase().trim();
  const lowerCorrect = correctAnswer.toLowerCase().trim();
  
  if (lowerUser === lowerCorrect) {
    return {
      errorType: 'careless',
      analysis: '你的答案是对的！继续保持！',
      relatedKnowledge: '',
      similarQuestions: [],
    };
  }
  
  const errorTypes: Array<'careless' | 'concept' | 'method' | 'reading'> = ['careless', 'concept', 'method', 'reading'];
  const randomType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
  
  const typeAnalysis: Record<string, string> = {
    careless: '这是一道粗心错误！你可能在计算过程中看错了数字或者写错了符号。下次做题时要更加细心哦！',
    concept: '这是一道概念错误！你对这个知识点的理解还不够深入。建议重新复习相关概念，理解清楚后再做练习。',
    method: '这是一道方法错误！你用的解题方法不正确。建议学习正确的解题思路和方法。',
    reading: '这是一道审题错误！你可能没有仔细阅读题目，理解错了题目的意思。下次要认真读题，圈出关键信息。',
  };
  
  return {
    errorType: randomType,
    analysis: typeAnalysis[randomType],
    relatedKnowledge: '建议复习相关知识点：运算定律、小数的性质、三角形的特征等。',
    similarQuestions: ['类似题目1', '类似题目2', '类似题目3'],
  };
};

export const aiGeneratePlan = async (
  _weakSubjects: string[],
  studyTime: number
): Promise<{
  plan: {
    subject: string;
    chapter: string;
    type: 'learn' | 'practice' | 'review';
    duration: number;
    priority: 'high' | 'medium' | 'low';
  }[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const plan: {
    subject: string;
    chapter: string;
    type: 'learn' | 'practice' | 'review';
    duration: number;
    priority: 'high' | 'medium' | 'low';
  }[] = [];
  const chapters = [
    { subject: '数学', chapter: '四则运算', priority: 'high' as const },
    { subject: '数学', chapter: '运算定律', priority: 'high' as const },
    { subject: '数学', chapter: '小数的意义和性质', priority: 'medium' as const },
    { subject: '数学', chapter: '三角形', priority: 'medium' as const },
  ];
  
  const types: Array<'learn' | 'practice' | 'review'> = ['learn', 'practice', 'review'];
  
  chapters.forEach((ch, index) => {
    if (index < studyTime / 20) {
      plan.push({
        subject: ch.subject,
        chapter: ch.chapter,
        type: types[index % types.length],
        duration: 20,
        priority: ch.priority,
      });
    }
  });
  
  return { plan };
};
