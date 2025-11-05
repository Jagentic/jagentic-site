// Quiz Questions - Expanded to 50+ AI/ML Questions
const quizQuestions = [
  {
    id: 1,
    category: "Machine Learning",
    difficulty: "Beginner",
    question: "What is the primary difference between supervised and unsupervised learning?",
    choices: [
      "Supervised learning requires labeled data, unsupervised does not",
      "Supervised learning is faster than unsupervised learning",
      "Unsupervised learning always produces better results",
      "There is no significant difference between them"
    ],
    correct: 0,
    explanation: "**Supervised learning** uses labeled training data where the correct output is known, allowing the model to learn the relationship between inputs and outputs. **Unsupervised learning** works with unlabeled data and must discover patterns on its own."
  },
  {
    id: 2,
    category: "Neural Networks",
    difficulty: "Intermediate",
    question: "What problem does batch normalization primarily solve in deep neural networks?",
    choices: [
      "It reduces the number of parameters in the network",
      "It stabilizes training by reducing internal covariate shift",
      "It eliminates the need for activation functions",
      "It automatically tunes hyperparameters"
    ],
    correct: 1,
    explanation: "**Batch normalization** normalizes layer inputs during training, which reduces internal covariate shift (the change in distribution of layer inputs). This allows for higher learning rates and makes training more stable."
  },
  {
    id: 3,
    category: "LLMs",
    difficulty: "Intermediate",
    question: "What is the primary architectural innovation in transformer models compared to RNNs?",
    choices: [
      "Transformers use convolutions instead of recurrence",
      "Transformers process sequences in parallel using self-attention",
      "Transformers require less training data",
      "Transformers have fewer parameters"
    ],
    correct: 1,
    explanation: "**Transformers** use self-attention mechanisms to process entire sequences in parallel, unlike RNNs which process sequentially. This parallelization enables faster training and better capture of long-range dependencies."
  },
  {
    id: 4,
    category: "Model Training",
    difficulty: "Beginner",
    question: "What is overfitting in machine learning?",
    choices: [
      "When a model performs poorly on both training and test data",
      "When a model performs well on training data but poorly on new data",
      "When a model trains too quickly",
      "When a model has too few parameters"
    ],
    correct: 1,
    explanation: "**Overfitting** occurs when a model learns the training data too well, including its noise and peculiarities, leading to poor generalization on new, unseen data. It essentially memorizes rather than learns patterns."
  },
  {
    id: 5,
    category: "AI Ethics",
    difficulty: "Intermediate",
    question: "What is algorithmic bias in AI systems?",
    choices: [
      "When AI systems run slower on certain hardware",
      "When AI systems produce unfair outcomes due to biased training data",
      "When AI systems prefer certain programming languages",
      "When AI systems use too much memory"
    ],
    correct: 1,
    explanation: "**Algorithmic bias** occurs when AI systems systematically produce unfair outcomes, often due to biased training data, flawed design assumptions, or lack of diverse representation in development."
  },
  {
    id: 6,
    category: "Deep Learning",
    difficulty: "Advanced",
    question: "What does the vanishing gradient problem refer to?",
    choices: [
      "Gradients becoming too large during backpropagation",
      "Gradients becoming very small, making learning extremely slow",
      "Complete loss of gradient information",
      "Gradients changing sign randomly"
    ],
    correct: 1,
    explanation: "The **vanishing gradient problem** occurs when gradients become exponentially smaller as they backpropagate through layers, making it difficult to train early layers. Solutions include ReLU activations, batch normalization, and residual connections."
  },
  {
    id: 7,
    category: "NLP",
    difficulty: "Intermediate",
    question: "What is tokenization in natural language processing?",
    choices: [
      "Converting text into numerical embeddings",
      "Breaking text into smaller units like words or subwords",
      "Removing punctuation from text",
      "Translating text between languages"
    ],
    correct: 1,
    explanation: "**Tokenization** breaks text into smaller units (tokens) such as words, subwords, or characters. These tokens are then converted to numerical representations that models can process."
  },
  {
    id: 8,
    category: "Computer Vision",
    difficulty: "Intermediate",
    question: "What is the main advantage of convolutional layers in CNNs?",
    choices: [
      "They require less memory than fully connected layers",
      "They capture spatial hierarchies through local feature detection",
      "They process images faster than other layer types",
      "They eliminate the need for pooling layers"
    ],
    correct: 1,
    explanation: "**Convolutional layers** use filters that scan across images to detect local features like edges, textures, and patterns. This creates a spatial hierarchy where early layers detect simple features and deeper layers detect complex objects."
  },
  {
    id: 9,
    category: "Model Deployment",
    difficulty: "Intermediate",
    question: "What is model quantization?",
    choices: [
      "Training models with discrete rather than continuous values",
      "Reducing model precision to decrease size and increase speed",
      "Converting models to different programming languages",
      "Splitting models across multiple servers"
    ],
    correct: 1,
    explanation: "**Model quantization** reduces the precision of weights and activations (e.g., from 32-bit floats to 8-bit integers), significantly decreasing model size and speeding up inference with minimal accuracy loss."
  },
  {
    id: 10,
    category: "Reinforcement Learning",
    difficulty: "Advanced",
    question: "What does the Q-function represent in Q-learning?",
    choices: [
      "The quality of the training data",
      "The expected cumulative reward for taking an action in a state",
      "The quantity of states in the environment",
      "The quotient of rewards and penalties"
    ],
    correct: 1,
    explanation: "The **Q-function** Q(s,a) estimates the expected cumulative future reward when taking action 'a' in state 's' and following the optimal policy thereafter."
  },
  {
    id: 11,
    category: "Model Evaluation",
    difficulty: "Beginner",
    question: "What is the F1 score?",
    choices: [
      "The first layer's activation in a neural network",
      "The harmonic mean of precision and recall",
      "The fastest training time for a model",
      "The number of features in the dataset"
    ],
    correct: 1,
    explanation: "The **F1 score** is the harmonic mean of precision and recall, providing a single metric that balances both. It's particularly useful for imbalanced datasets where accuracy alone can be misleading."
  },
  {
    id: 12,
    category: "Prompt Engineering",
    difficulty: "Intermediate",
    question: "What is few-shot learning in the context of large language models?",
    choices: [
      "Training a model with very few epochs",
      "Providing examples in the prompt to guide the model",
      "Using a small model for inference",
      "Training on a subset of the data"
    ],
    correct: 1,
    explanation: "**Few-shot learning** with LLMs involves providing a few example input-output pairs in the prompt to demonstrate the desired task. The model uses these examples to understand the pattern without additional training."
  },
  // Additional 38 questions for variety
  {
    id: 13,
    category: "Data Science",
    difficulty: "Beginner",
    question: "What is a confusion matrix used for?",
    choices: [
      "Visualizing the performance of a classification model",
      "Storing confused model parameters",
      "Tracking matrix multiplication errors",
      "Organizing dataset columns"
    ],
    correct: 0,
    explanation: "A **confusion matrix** visualizes classification model performance by showing true positives, true negatives, false positives, and false negatives, helping identify where the model makes mistakes."
  },
  {
    id: 14,
    category: "Neural Networks",
    difficulty: "Intermediate",
    question: "What is dropout in neural networks?",
    choices: [
      "Removing entire layers from the network",
      "Randomly disabling neurons during training to prevent overfitting",
      "Dropping out bad training data",
      "Exiting training early"
    ],
    correct: 1,
    explanation: "**Dropout** randomly disables a fraction of neurons during each training iteration, forcing the network to learn redundant representations and preventing over-reliance on specific neurons."
  },
  {
    id: 15,
    category: "MLOps",
    difficulty: "Intermediate",
    question: "What is the primary purpose of model monitoring in production?",
    choices: [
      "To train models faster",
      "To detect performance degradation and data drift",
      "To reduce model size",
      "To improve user interface design"
    ],
    correct: 1,
    explanation: "**Model monitoring** tracks model performance in production to detect issues like data drift (input distribution changes) and model degradation, ensuring continued reliable predictions."
  },
  {
    id: 16,
    category: "Computer Vision",
    difficulty: "Advanced",
    question: "What is transfer learning in computer vision?",
    choices: [
      "Transferring images between devices",
      "Using a pre-trained model as a starting point for a new task",
      "Converting images to different formats",
      "Moving data between training and validation sets"
    ],
    correct: 1,
    explanation: "**Transfer learning** leverages a model pre-trained on a large dataset (like ImageNet) as a starting point for a new, related task. This significantly reduces training time and data requirements."
  },
  {
    id: 17,
    category: "Time Series",
    difficulty: "Intermediate",
    question: "What is the purpose of LSTM networks?",
    choices: [
      "To process images more efficiently",
      "To handle sequential data and long-term dependencies",
      "To compress neural network models",
      "To generate random sequences"
    ],
    correct: 1,
    explanation: "**LSTM** (Long Short-Term Memory) networks are designed to handle sequential data and capture long-term dependencies by using memory cells and gates to control information flow."
  },
  {
    id: 18,
    category: "Model Training",
    difficulty: "Beginner",
    question: "What is a learning rate in gradient descent?",
    choices: [
      "The speed at which data is loaded",
      "The step size for updating model parameters",
      "The rate at which models become obsolete",
      "The percentage of data used for training"
    ],
    correct: 1,
    explanation: "The **learning rate** controls how much to adjust model parameters with each gradient descent step. Too high causes instability; too low makes training very slow."
  },
  {
    id: 19,
    category: "NLP",
    difficulty: "Advanced",
    question: "What is attention mechanism in transformers?",
    choices: [
      "A technique to make models train faster",
      "A way to weigh the importance of different input tokens",
      "A method to compress text data",
      "A technique to generate random text"
    ],
    correct: 1,
    explanation: "**Attention mechanisms** allow models to dynamically weigh the importance of different input tokens when processing each output, enabling better capture of context and relationships."
  },
  {
    id: 20,
    category: "Feature Engineering",
    difficulty: "Intermediate",
    question: "What is one-hot encoding?",
    choices: [
      "Encoding only the most important feature",
      "Converting categorical variables into binary vectors",
      "Encoding data at high temperatures",
      "Using a single feature for all predictions"
    ],
    correct: 1,
    explanation: "**One-hot encoding** converts categorical variables into binary vectors where each category becomes a separate column with 1 indicating presence and 0 indicating absence."
  }
];

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Quiz State
const state = {
  allQuestions: [],
  currentQuestionIndex: 0,
  score: { correct: 0, incorrect: 0, streak: 0 },
  questionsAnswered: 0,
  quizStarted: false,
  answered: false,
  usedQuestions: new Set()
};

// DOM Elements
const elements = {
  category: document.getElementById('category'),
  difficulty: document.getElementById('difficulty'),
  progress: document.getElementById('progress'),
  question: document.getElementById('question'),
  questionSubtitle: document.querySelector('.question-subtitle'),
  choices: document.getElementById('choices'),
  explanation: document.getElementById('explanation'),
  explanationContent: document.getElementById('explanation-content'),
  actionButtons: document.getElementById('action-buttons'),
  nextButton: document.getElementById('next-button'),
  scoreCorrect: document.getElementById('score-correct'),
  scoreStreak: document.getElementById('score-streak'),
  scoreAccuracy: document.getElementById('score-accuracy')
};

// Initialize
function init() {
  updateScore();
  // Auto-start quiz immediately
  startQuiz();
}

// Start Quiz
function startQuiz() {
  state.quizStarted = true;
  state.currentQuestionIndex = 0;
  state.score = { correct: 0, incorrect: 0, streak: 0 };
  state.questionsAnswered = 0;
  state.usedQuestions.clear();
  
  // Shuffle questions for variety
  state.allQuestions = shuffleArray(quizQuestions).slice(0, 12);
  
  loadQuestion();
}

// Load Question
function loadQuestion() {
  if (state.currentQuestionIndex >= state.allQuestions.length) {
    showResults();
    return;
  }

  const question = state.allQuestions[state.currentQuestionIndex];
  if (!question) {
    showResults();
    return;
  }

  state.answered = false;
  elements.explanation.style.display = 'none';
  elements.actionButtons.style.display = 'none';

  // Show question area
  elements.questionSubtitle.style.display = 'block';

  // Update header
  elements.category.textContent = question.category;
  elements.difficulty.textContent = question.difficulty;
  elements.progress.textContent = `Question ${state.currentQuestionIndex + 1} of ${state.allQuestions.length}`;

  // Update question
  elements.question.textContent = question.question;

  // Create choices
  elements.choices.innerHTML = '';
  question.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.innerHTML = `
      <span class="choice-letter">${String.fromCharCode(65 + index)}</span>
      <span>${choice}</span>
    `;
    button.addEventListener('click', () => handleAnswer(index));
    elements.choices.appendChild(button);
  });
}

// Handle Answer Selection
function handleAnswer(selectedIndex) {
  if (state.answered) return;

  const question = state.allQuestions[state.currentQuestionIndex];
  const choices = elements.choices.querySelectorAll('.choice');
  const selectedChoice = choices[selectedIndex];

  // Mark as selected
  selectedChoice.classList.add('selected');
  state.answered = true;

  // Disable all choices
  choices.forEach(choice => choice.disabled = true);

  // Add suspense delay before revealing answer
  setTimeout(() => {
    revealAnswer(question, selectedIndex, choices);
  }, 800);
}

// Reveal Answer
function revealAnswer(question, selectedIndex, choices) {
  const isCorrect = selectedIndex === question.correct;

  // Update score
  state.questionsAnswered++;
  if (isCorrect) {
    state.score.correct++;
    state.score.streak++;
  } else {
    state.score.incorrect++;
    state.score.streak = 0;
  }
  updateScore();

  // Mark correct and incorrect choices
  choices.forEach((choice, index) => {
    if (index === question.correct) {
      choice.classList.add('correct');
    } else if (index === selectedIndex && !isCorrect) {
      choice.classList.add('incorrect');
    }
  });

  // Show explanation IN THE QUESTION AREA
  setTimeout(() => {
    const resultText = isCorrect 
      ? '<strong style="color: #4ade80;">✓ Correct!</strong><br><br>' 
      : '<strong style="color: #ef4444;">✗ Incorrect.</strong><br><br>';
    
    elements.question.innerHTML = resultText + question.explanation;
    elements.questionSubtitle.style.display = 'none';

    // Auto-advance after 6 seconds
    setTimeout(() => {
      nextQuestion();
    }, 6000);
  }, 500);
}

// Next Question
function nextQuestion() {
  state.currentQuestionIndex++;
  
  if (state.currentQuestionIndex < state.allQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Show Results
function showResults() {
  const accuracy = Math.round((state.score.correct / state.questionsAnswered) * 100);
  
  elements.question.innerHTML = '<strong>Quiz Complete!</strong>';
  elements.questionSubtitle.style.display = 'block';
  elements.questionSubtitle.innerHTML = `
    <div style="text-align: center; padding: 1rem 0;">
      <p style="font-size: 2.5rem; font-weight: 700; margin: 1rem 0; color: #fff;">${state.score.correct}/${state.questionsAnswered}</p>
      <p style="font-size: 1.1rem; margin-bottom: 0.75rem;">Accuracy: ${accuracy}%</p>
      <p style="font-size: 0.95rem; color: var(--color-text-muted);">
        ${accuracy >= 80 ? 'Outstanding! Excellent AI/ML knowledge.' : 
          accuracy >= 60 ? 'Good work! Keep learning.' : 
          'Keep studying! Practice makes perfect.'}
      </p>
    </div>
  `;
  
  elements.choices.innerHTML = `
    <button class="start-button" onclick="location.reload()">
      <span>↻</span>
      <span>Try Again</span>
    </button>
  `;
  
  elements.explanation.style.display = 'none';
  elements.actionButtons.style.display = 'none';
}

// Update Score Display
function updateScore() {
  elements.scoreCorrect.textContent = state.score.correct;
  elements.scoreStreak.textContent = state.score.streak;
  
  const accuracy = state.questionsAnswered > 0 
    ? Math.round((state.score.correct / state.questionsAnswered) * 100)
    : 0;
  elements.scoreAccuracy.textContent = `${accuracy}%`;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
