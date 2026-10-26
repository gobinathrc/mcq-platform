import { query } from './pool';
import { v4 as uuidv4 } from 'uuid';

export interface SeedQuestion {
  difficulty: 'ROOKIE' | 'PRO-BOWLER' | 'HALL OF FAMER';
  topic_id: string;
  category: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export const COMPLETE_CURRICULUM_BANK: SeedQuestion[] = [
  // ================= 1. THE OFFENSIVE LINE (SQL & Data Engineering) =================
  // ROOKIE (Beginner SQL)
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Filtering',
    question_text: 'In SQL, which clause is used to filter records before any GROUP BY operations take place?',
    option_a: 'ORDER BY',
    option_b: 'WHERE',
    option_c: 'HAVING',
    option_d: 'LIMIT',
    correct_option: 'B',
    explanation: 'WHERE filters rows before groupings are formed.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Basics',
    question_text: 'Which SQL statement is used to retrieve data from a database table?',
    option_a: 'SELECT',
    option_b: 'GET',
    option_c: 'EXTRACT',
    option_d: 'PULL',
    correct_option: 'A',
    explanation: 'SELECT is used to query data from database tables.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Aggregates',
    question_text: 'Which aggregate function counts only rows where the specified column is NOT NULL?',
    option_a: 'COUNT(*)',
    option_b: 'TOTAL()',
    option_c: 'COUNT(column_name)',
    option_d: 'SUM()',
    correct_option: 'C',
    explanation: 'COUNT(column_name) ignores NULL rows in that column.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'ol',
    category: 'SQL Sorting',
    question_text: 'Which keyword sorts SQL query results from highest to lowest?',
    option_a: 'ASC',
    option_b: 'DESC',
    option_c: 'HIGH',
    option_d: 'REVERSE',
    correct_option: 'B',
    explanation: 'DESC sorts records in descending order.'
  },

  // PRO-BOWLER (Medium SQL & Joins)
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Joins',
    question_text: 'Which JOIN returns all records from the left table and matching records from the right table, filling NULLs for non-matches?',
    option_a: 'INNER JOIN',
    option_b: 'CROSS JOIN',
    option_c: 'LEFT JOIN',
    option_d: 'FULL JOIN',
    correct_option: 'C',
    explanation: 'LEFT JOIN returns all left rows and matched right rows.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Grouping',
    question_text: 'Which clause is used to filter aggregated data produced by a GROUP BY clause?',
    option_a: 'WHERE',
    option_b: 'HAVING',
    option_c: 'ORDER BY',
    option_d: 'QUALIFY',
    correct_option: 'B',
    explanation: 'HAVING filters aggregate groups.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Window Functions',
    question_text: 'Which window function assigns sequential rank numbers without leaving gaps when values tie?',
    option_a: 'DENSE_RANK()',
    option_b: 'RANK()',
    option_c: 'ROW_NUMBER()',
    option_d: 'NTILE()',
    correct_option: 'A',
    explanation: 'DENSE_RANK() does not skip rank numbers on ties (e.g., 1, 1, 2).'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL CTEs',
    question_text: 'Which SQL keyword introduces a Common Table Expression (CTE) to define a temporary named result set?',
    option_a: 'WITH',
    option_b: 'LET',
    option_c: 'DECLARE',
    option_d: 'TABLE',
    correct_option: 'A',
    explanation: 'WITH introduces a Common Table Expression.'
  },

  // HALL OF FAMER (Advanced SQL & Data Engineering)
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'Data Lake Architecture',
    question_text: 'When designing a distributed data lake in Apache Parquet, what problem occurs when partitioning tables by high-cardinality timestamps down to the second?',
    option_a: 'Data corruption in columnar snappy compression',
    option_b: 'Small files problem causing excessive metadata overhead and slow query planning',
    option_c: 'Loss of ACID isolation in object storage buckets',
    option_d: 'Schema evolution locks',
    correct_option: 'B',
    explanation: 'High-cardinality partitions generate millions of tiny files, overwhelming query engines.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'SQL Optimization',
    question_text: 'What is a "Covering Index" in database optimization?',
    option_a: 'An index that contains all columns requested by a query, allowing index-only scans without accessing the table heap',
    option_b: 'An index that encrypts table pages on storage',
    option_c: 'An index that automatically replicates to standby replicas',
    option_d: 'An index placed only on foreign keys',
    correct_option: 'A',
    explanation: 'Covering indexes satisfy the entire query from the index tree without fetching heap tuples.'
  },

  // ================= 2. SCOUTING COMBINE (Descriptive Stats & EDA) =================
  // ROOKIE
  {
    difficulty: 'ROOKIE',
    topic_id: 'cb',
    category: 'Descriptive Stats',
    question_text: 'Which measure of central tendency is least affected by extreme numerical outliers?',
    option_a: 'Mean',
    option_b: 'Standard Deviation',
    option_c: 'Median',
    option_d: 'Variance',
    correct_option: 'C',
    explanation: 'Median is robust to outliers because it depends on rank rather than magnitudes.'
  },
  {
    difficulty: 'ROOKIE',
    topic_id: 'cb',
    category: 'EDA Basics',
    question_text: 'In a standard box plot, what data interval does the Interquartile Range (IQR) represent?',
    option_a: 'Between the Minimum and Maximum',
    option_b: 'Between the 25th percentile (Q1) and 75th percentile (Q3)',
    option_c: 'Between Mean - 1 Std Dev and Mean + 1 Std Dev',
    option_d: 'Between the 10th and 90th percentiles',
    correct_option: 'B',
    explanation: 'IQR = Q3 - Q1, spanning the middle 50% of the dataset.'
  },
  // PRO-BOWLER
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'cb',
    category: 'EDA & Distributions',
    question_text: 'In an exploratory analysis of continuous salaries, Mean is $85,000 and Median is $52,000. What is the skewness?',
    option_a: 'Right-skewed (Positively skewed)',
    option_b: 'Left-skewed (Negatively skewed)',
    option_c: 'Symmetric Gaussian',
    option_d: 'Zero variance',
    correct_option: 'A',
    explanation: 'When Mean > Median, the distribution exhibits a long right-hand tail.'
  },
  // HALL OF FAMER
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'cb',
    category: 'Multicollinearity & VIF',
    question_text: 'In linear regression diagnostics, what does a Variance Inflation Factor (VIF) greater than 10 for a feature indicate?',
    option_a: 'High heteroscedasticity across residuals',
    option_b: 'Severe multicollinearity where the feature is heavily explained by other predictors',
    option_c: 'Violation of residual normality',
    option_d: 'High autocorrelation',
    correct_option: 'B',
    explanation: 'VIF > 10 signifies severe multicollinearity, inflating coefficient standard errors.'
  },

  // ================= 3. COACHES' CHALLENGE (Inferential Stats & Hypotheses) =================
  // ROOKIE
  {
    difficulty: 'ROOKIE',
    topic_id: 'hc',
    category: 'Hypothesis Testing',
    question_text: 'What constitutes a Type I error in statistical hypothesis testing?',
    option_a: 'Failing to reject a false null hypothesis',
    option_b: 'Rejecting a true null hypothesis (False Positive)',
    option_c: 'Sampling bias in observational studies',
    option_d: 'Incorrect degrees of freedom',
    correct_option: 'B',
    explanation: 'Type I error is falsely rejecting H0 when H0 is actually true.'
  },
  // PRO-BOWLER
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'hc',
    category: 'A/B Testing & P-Values',
    question_text: 'In an A/B test with alpha = 0.05, what does a calculated p-value of 0.02 strictly imply?',
    option_a: 'There is a 98% probability that the variant is superior',
    option_b: 'Assuming the null hypothesis is true, there is only a 2% chance of observing this effect (or more extreme)',
    option_c: 'The statistical power of the test is 2%',
    option_d: 'The experiment has a 2% margin of error',
    correct_option: 'B',
    explanation: 'P-value is the probability of obtaining test results at least as extreme, given H0 is true.'
  },
  // HALL OF FAMER
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'hc',
    category: 'Multiple Testing Correction',
    question_text: 'Why must multiple testing corrections (e.g. Benjamini-Hochberg or Bonferroni) be used when testing 30 variant metrics simultaneously?',
    option_a: 'To prevent inflated Family-Wise Error Rate (FWER) and false discovery explosions',
    option_b: 'To reduce the required sample size',
    option_c: 'To eliminate variance across user cohorts',
    option_d: 'To convert one-tailed tests into two-tailed tests',
    correct_option: 'A',
    explanation: 'Testing multiple hypotheses without correction drastically inflates the chance of false positives.'
  },

  // ================= 4. THE PLAYBOOK (Supervised Machine Learning) =================
  // ROOKIE
  {
    difficulty: 'ROOKIE',
    topic_id: 'oc',
    category: 'Supervised ML',
    question_text: 'What is the primary characteristic of L1 Regularization (Lasso) compared to L2 (Ridge)?',
    option_a: 'Lasso drives uninformative feature weights strictly to zero for sparse feature selection',
    option_b: 'Lasso only works for regression problems',
    option_c: 'Ridge requires unnormalized target variables',
    option_d: 'Lasso prevents gradient descent optimization',
    correct_option: 'A',
    explanation: 'Lasso penalizes absolute coefficients, setting unneeded weights to 0.'
  },
  // PRO-BOWLER
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'oc',
    category: 'Ensemble Learning',
    question_text: 'How does Random Forest fundamentally differ from Gradient Boosted Decision Trees (XGBoost/LightGBM)?',
    option_a: 'Random Forest trains deep trees in parallel independently; Gradient Boosting trains shallow trees sequentially to correct residual errors',
    option_b: 'Boosting only works on classification models',
    option_c: 'Random forest cannot handle categorical variables',
    option_d: 'Boosted trees do not compute feature importance',
    correct_option: 'A',
    explanation: 'Random Forest averages independent trees; Boosting iteratively reduces residual errors.'
  },
  // HALL OF FAMER
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'oc',
    category: 'Loss Optimization',
    question_text: 'Why does XGBoost use a second-order Taylor expansion (gradients and hessians) for its loss objective?',
    option_a: 'To calculate optimal leaf split weights and split gains in closed-form for any arbitrary differentiable loss function',
    option_b: 'To guarantee O(1) inference speed',
    option_c: 'To eliminate cross-validation requirements',
    option_d: 'To convert nonlinear decision boundaries into hyperplanes',
    correct_option: 'A',
    explanation: 'Using gradient g and hessian h allows analytical calculation of leaf values w* = -G/(H+lambda).'
  },

  // ================= 5. ZONE COVERAGE (Unsupervised & Anomaly Detection) =================
  // ROOKIE
  {
    difficulty: 'ROOKIE',
    topic_id: 'fs',
    category: 'Clustering',
    question_text: 'Which clustering algorithm requires you to define the number of clusters (K) in advance?',
    option_a: 'DBSCAN',
    option_b: 'K-Means',
    option_c: 'Mean Shift',
    option_d: 'OPTICS',
    correct_option: 'B',
    explanation: 'K-Means requires specifying K clusters before optimization.'
  },
  // PRO-BOWLER
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'fs',
    category: 'Dimensionality Reduction',
    question_text: 'In Principal Component Analysis (PCA), what do the principal component directions correspond to?',
    option_a: 'The eigenvectors of the feature covariance matrix sorted by decreasing eigenvalues',
    option_b: 'The centroid distance vectors between clusters',
    option_c: 'The inverse loss gradients',
    option_d: 'The L1 norm projection axes',
    correct_option: 'A',
    explanation: 'PCA components are the eigenvectors of the covariance matrix, ordered by variance.'
  },
  // HALL OF FAMER
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'fs',
    category: 'Anomaly Detection',
    question_text: 'How does an Isolation Forest identify anomalous observations faster than normal observations?',
    option_a: 'Anomalies reside in sparse regions and require fewer random feature splits to isolate, resulting in shorter average path lengths in trees',
    option_b: 'By computing Euclidean distances to the global cluster medoid',
    option_c: 'By constructing support vector convex hulls',
    option_d: 'By fitting Gaussian kernel densities',
    correct_option: 'A',
    explanation: 'Outliers are isolated quickly near tree roots, having noticeably shorter path lengths.'
  },

  // ================= 6. CLOCK MANAGEMENT (Time Series & Forecasting) =================
  // ROOKIE
  {
    difficulty: 'ROOKIE',
    topic_id: 'st',
    category: 'Time Series Basics',
    question_text: 'What conditions are required for a time series to be considered weakly stationary?',
    option_a: 'Constant mean, constant variance, and autocovariance that depends only on lag distance (not time)',
    option_b: 'A constant upward linear trend',
    option_c: 'Zero correlation between any two time steps',
    option_d: 'Strict 12-month periodicity',
    correct_option: 'A',
    explanation: 'Weak stationarity requires time-invariant mean and variance, and lag-dependent autocovariance.'
  },
  // PRO-BOWLER
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'st',
    category: 'ARIMA Modeling',
    question_text: 'In an ARIMA(p, d, q) model, what does the parameter "d" represent?',
    option_a: 'The order of autoregressive lags',
    option_b: 'The degree of differencing applied to make the time series stationary',
    option_c: 'The number of moving average error terms',
    option_d: 'The seasonal period length',
    correct_option: 'B',
    explanation: 'd is the differencing order applied to eliminate trends.'
  },
  // HALL OF FAMER
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'st',
    category: 'Time Series Validation',
    question_text: 'Why is standard randomized K-Fold cross validation invalid for evaluating time series forecasting models?',
    option_a: 'It inflates RAM consumption during training',
    option_b: 'It causes data leakage and lookahead bias by training on future observations to predict the past',
    option_c: 'It cannot compute Mean Absolute Percentage Error (MAPE)',
    option_d: 'It forces target values into negative ranges',
    correct_option: 'B',
    explanation: 'Shuffling violates temporal order, leaking future data into training folds.'
  },

  // ================= 7. THE FRANCHISE QB (Deep Learning) =================
  // ROOKIE
  {
    difficulty: 'ROOKIE',
    topic_id: 'qb',
    category: 'Neural Networks',
    question_text: 'Which activation function is most widely used in hidden layers of deep networks to avoid the vanishing gradient problem seen in Sigmoid?',
    option_a: 'ReLU (Rectified Linear Unit)',
    option_b: 'Tanh',
    option_c: 'Step Function',
    option_d: 'Linear Identity',
    correct_option: 'A',
    explanation: 'ReLU derivative is 1 for positive values, preventing vanishing gradients.'
  },
  // PRO-BOWLER
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'qb',
    category: 'Deep Learning Architectures',
    question_text: 'What is the primary role of Batch Normalization during deep neural network training?',
    option_a: 'To normalize layer inputs to zero mean and unit variance across the mini-batch, stabilizing internal covariate shift and allowing higher learning rates',
    option_b: 'To convert fully connected layers into convolutional filters',
    option_c: 'To eliminate backpropagation pass steps',
    option_d: 'To dynamically prune dead neurons',
    correct_option: 'A',
    explanation: 'Batch Normalization standardizes mini-batch layer inputs, accelerating convergence.'
  },
  // HALL OF FAMER
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'qb',
    category: 'Transformers & Attention',
    question_text: 'In Transformer Multi-Head Self-Attention Softmax(QK^T / sqrt(d_k))V, why are dot products scaled by 1/sqrt(d_k)?',
    option_a: 'To prevent large values from driving the Softmax function into regions with near-zero gradients (vanishing gradients)',
    option_b: 'To enforce orthogonal projections across attention heads',
    option_c: 'To invert token positional encodings',
    option_d: 'To eliminate quadratic O(N^2) sequence complexity',
    correct_option: 'A',
    explanation: 'For large d_k, dot products grow large, pushing softmax into flat saturation zones with tiny gradients.'
  },

  // ================= 8. AUDIBLES & CALLING (NLP & Generative AI) =================
  // ROOKIE
  {
    difficulty: 'ROOKIE',
    topic_id: 'dc',
    category: 'NLP Embeddings',
    question_text: 'What is the primary advantage of contextual word embeddings (BERT) over static embeddings (Word2Vec / GloVe)?',
    option_a: 'BERT generates different vector embeddings for the same word based on its sentence context',
    option_b: 'BERT requires no vocabulary tokenization',
    option_c: 'Word2Vec cannot run on CPU hardware',
    option_d: 'BERT produces single-dimension integers instead of vectors',
    correct_option: 'A',
    explanation: 'Contextual embeddings assign different representations based on surrounding context.'
  },
  // PRO-BOWLER
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'dc',
    category: 'RAG Architecture',
    question_text: 'In a Retrieval-Augmented Generation (RAG) system, what is the role of a Vector Database?',
    option_a: 'To store chunk embeddings and retrieve semantically similar context chunks via Approximate Nearest Neighbor (ANN) search',
    option_b: 'To fine-tune transformer model weights',
    option_c: 'To convert output text into speech',
    option_d: 'To calculate perplexity and BLEU scores',
    correct_option: 'A',
    explanation: 'Vector databases index high-dimensional embeddings for fast semantic similarity lookups.'
  },
  // HALL OF FAMER
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'dc',
    category: 'LLM Fine-Tuning & Quantization',
    question_text: 'How does LoRA (Low-Rank Adaptation) fine-tune large language models efficiently without updating full model weights?',
    option_a: 'By freezing base weights and injecting trainable low-rank decomposition matrices Delta_W = B * A with rank r << min(d, k)',
    option_b: 'By quantizing all model parameters from 16-bit to 1-bit binary weights',
    option_c: 'By deleting attention heads with lowest variance',
    option_d: 'By replacing causal decoder masks with bidirectional encoders',
    correct_option: 'A',
    explanation: 'LoRA freezes base weights and trains small low-rank adapter matrices B and A.'
  },

  // ================= 9. THE FRONT OFFICE (MLOps & System Architecture) =================
  // ROOKIE
  {
    difficulty: 'ROOKIE',
    topic_id: 'gm',
    category: 'Model Monitoring',
    question_text: 'What type of drift occurs when the distribution of input features changes over time (P(X) shifts) while the relationship to targets P(Y|X) remains constant?',
    option_a: 'Concept Drift',
    option_b: 'Data Drift (Covariate Shift)',
    option_c: 'Target Leakage',
    option_d: 'Prior Shift',
    correct_option: 'B',
    explanation: 'Data Drift / Covariate Shift refers to shifts in input feature distributions P(X).'
  },
  // PRO-BOWLER
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'gm',
    category: 'Deployment Strategies',
    question_text: 'Which deployment strategy safely routes a small percentage (e.g. 5%) of production traffic to a new model to monitor real-world performance before full rollout?',
    option_a: 'Canary Deployment',
    option_b: 'Blue-Green Deployment',
    option_c: 'Shadow Deployment',
    option_d: 'Rolling Deployment',
    correct_option: 'A',
    explanation: 'Canary deployments send a small slice of live traffic to evaluate the new version.'
  },
  // HALL OF FAMER
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'gm',
    category: 'Feature Stores & Architecture',
    question_text: 'In enterprise MLOps architectures, what is the primary role of a dual-layer Feature Store (Online vs Offline)?',
    option_a: 'Online store provides low-latency key-value feature lookups for real-time inference, while Offline store provides point-in-time historical joins for training without data leakage',
    option_b: 'To convert unstructured video into tabular CSV tables',
    option_c: 'To automatically generate API documentation and licenses',
    option_d: 'To run unit tests across distributed clusters',
    correct_option: 'A',
    explanation: 'Dual feature stores prevent training-serving skew with low-latency reads in production and point-in-time joins in training.'
  }
];

export const seedQuestions = async (): Promise<void> => {
  await query('TRUNCATE TABLE questions CASCADE');

  for (const q of COMPLETE_CURRICULUM_BANK) {
    const id = uuidv4();
    await query(
      `INSERT INTO questions (id, difficulty, topic_id, category, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [id, q.difficulty, q.topic_id, q.category, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.explanation]
    );
  }
};

if (require.main === module) {
  seedQuestions()
    .then(() => {
      console.log('Successfully seeded complete curriculum question bank.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed questions:', err);
      process.exit(1);
    });
}
