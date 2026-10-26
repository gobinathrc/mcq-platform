import { query } from './pool';
import { v4 as uuidv4 } from 'uuid';

export interface CurriculumTopic {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
}

export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  { id: 'ol', code: 'OL', title: 'THE OFFENSIVE LINE', subtitle: 'SQL & Data Engineering', icon: 'Shield' },
  { id: 'cb', code: 'CB', title: 'SCOUTING COMBINE', subtitle: 'Descriptive Stats & EDA', icon: 'Zap' },
  { id: 'hc', code: 'HC', title: "COACHES' CHALLENGE", subtitle: 'Inferential Stats & Hypotheses', icon: 'Flag' },
  { id: 'oc', code: 'OC', title: 'THE PLAYBOOK', subtitle: 'Supervised Machine Learning', icon: 'Clipboard' },
  { id: 'fs', code: 'FS', title: 'ZONE COVERAGE', subtitle: 'Unsupervised & Anomaly Detection', icon: 'Lock' },
  { id: 'st', code: 'ST', title: 'CLOCK MANAGEMENT', subtitle: 'Time Series & Forecasting', icon: 'Clock' },
  { id: 'qb', code: 'QB', title: 'THE FRANCHISE QB', subtitle: 'Deep Learning (DL)', icon: 'Cpu' },
  { id: 'dc', code: 'DC', title: 'AUDIBLES & CALLING', subtitle: 'NLP & Generative AI', icon: 'Megaphone' },
  { id: 'gm', code: 'GM', title: 'THE FRONT OFFICE', subtitle: 'MLOps & System Architecture', icon: 'Building2' },
];

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

export const COMPREHENSIVE_QUESTION_BANK: SeedQuestion[] = [
  // ================= 1. THE OFFENSIVE LINE (SQL & Data Engineering) =================
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
    explanation: 'WHERE filters individual records before aggregation. HAVING filters aggregated data.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'ol',
    category: 'SQL Window Functions',
    question_text: 'Which window function assigns sequential integers without skipping numbers when values tie?',
    option_a: 'DENSE_RANK()',
    option_b: 'RANK()',
    option_c: 'ROW_NUMBER()',
    option_d: 'NTILE()',
    correct_option: 'A',
    explanation: 'DENSE_RANK() leaves no sequence gaps on tied values (e.g. 1, 1, 2).'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'ol',
    category: 'Data Engineering & Partitions',
    question_text: 'When designing a distributed data lake in Apache Parquet, what issue arises when tables are partitioned on high-cardinality keys like timestamp down to the second?',
    option_a: 'Data corruption in columnar compression',
    option_b: 'Small files problem causing excessive metadata overhead on the query engine',
    option_c: 'Loss of ACID isolation in object storage',
    option_d: 'Schema evolution lockouts',
    correct_option: 'B',
    explanation: 'High cardinality partitioning creates millions of tiny files, overwhelming query planning and object storage metadata lookups.'
  },

  // ================= 2. SCOUTING COMBINE (Descriptive Stats & EDA) =================
  {
    difficulty: 'ROOKIE',
    topic_id: 'cb',
    category: 'Descriptive Stats',
    question_text: 'Which measure of central tendency is least sensitive to extreme outliers in a skewed numerical feature?',
    option_a: 'Mean',
    option_b: 'Standard Deviation',
    option_c: 'Median',
    option_d: 'Variance',
    correct_option: 'C',
    explanation: 'Median is robust to outliers because it reflects the 50th percentile rank rather than arithmetic magnitude.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'cb',
    category: 'EDA & Distributions',
    question_text: 'In an exploratory data analysis, a distribution has a mean of 45 and a median of 32. What is the nature of its skewness?',
    option_a: 'Right-skewed (Positively skewed)',
    option_b: 'Left-skewed (Negatively skewed)',
    option_c: 'Symmetric Gaussian',
    option_d: 'Zero kurtosis',
    correct_option: 'A',
    explanation: 'When Mean > Median, the long tail extends to the right (positive/right skew).'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'cb',
    category: 'Multicollinearity & VIF',
    question_text: 'What does a Variance Inflation Factor (VIF) greater than 10 for an explanatory variable indicate?',
    option_a: 'High heteroscedasticity across residuals',
    option_b: 'Severe multicollinearity with other predictor variables',
    option_c: 'Insufficient sample size for normal approximation',
    option_d: 'Non-linear polynomial relationships',
    correct_option: 'B',
    explanation: 'A VIF above 5-10 indicates that more than 80-90% of the variance is explained by other predictors, inflating coefficient standard errors.'
  },

  // ================= 3. COACHES\' CHALLENGE (Inferential Stats & Hypotheses) =================
  {
    difficulty: 'ROOKIE',
    topic_id: 'hc',
    category: 'Hypothesis Testing',
    question_text: 'What is a Type I error in statistical hypothesis testing?',
    option_a: 'Failing to reject a false null hypothesis (False Negative)',
    option_b: 'Rejecting a true null hypothesis (False Positive)',
    option_c: 'Selecting a non-random sample',
    option_d: 'Calculating an incorrect p-value',
    correct_option: 'B',
    explanation: 'Type I error is falsely rejecting H0 when H0 is actually true (alpha rate).'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'hc',
    category: 'A/B Testing & P-Values',
    question_text: 'In an A/B test with an alpha threshold of 0.05, what does a calculated p-value of 0.018 mean?',
    option_a: 'There is a 1.8% chance that the treatment is effective',
    option_b: 'There is only a 1.8% probability of observing this effect (or more extreme) assuming the null hypothesis is true',
    option_c: 'The statistical power of the experiment is 98.2%',
    option_d: 'The alternative hypothesis has an 82% margin of error',
    correct_option: 'B',
    explanation: 'P-value is the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is correct.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'hc',
    category: 'Multiple Testing & Bonferroni',
    question_text: 'Why must multiple testing corrections (e.g. Benjamini-Hochberg FDR or Bonferroni) be applied when evaluating 20 simultaneous variant metrics?',
    option_a: 'To adjust for non-normal sample sizes',
    option_b: 'To control the inflated Family-Wise Error Rate (FWER) and prevent false discovery explosions',
    option_c: 'To eliminate sample variance across test segments',
    option_d: 'To reduce the required test run duration',
    correct_option: 'B',
    explanation: 'Testing 20 hypotheses at alpha=0.05 yields a ~64% chance of at least one false positive (1 - 0.95^20) without correction.'
  },

  // ================= 4. THE PLAYBOOK (Supervised Machine Learning) =================
  {
    difficulty: 'ROOKIE',
    topic_id: 'oc',
    category: 'Supervised ML',
    question_text: 'What is the primary trade-off modeled by L1 Regularization (Lasso) compared to L2 Regularization (Ridge)?',
    option_a: 'Lasso drives non-essential feature weights strictly to zero, yielding sparse feature selection',
    option_b: 'Lasso prevents multi-threading during gradient updates',
    option_c: 'Ridge only works on classification models',
    option_d: 'Lasso requires unnormalized target values',
    correct_option: 'A',
    explanation: 'Lasso adds absolute penalties (|w|), producing sharp corners on the constraint boundary that zero out weights.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'oc',
    category: 'Ensemble Learning',
    question_text: 'What is the key structural difference between Random Forest and Gradient Boosted Trees (XGBoost/LightGBM)?',
    option_a: 'Random Forest trains deep trees in parallel independently; Boosted Trees train shallow trees sequentially on residual errors',
    option_b: 'Boosted Trees can only be applied to continuous regression targets',
    option_c: 'Random Forest uses gradient descent to prune decision trees',
    option_d: 'Boosted trees do not support feature sampling',
    correct_option: 'A',
    explanation: 'Random Forest bags independent high-variance trees in parallel; boosting iteratively reduces bias by fitting each tree to the residual errors of prior trees.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'oc',
    category: 'Loss Functions & Optimization',
    question_text: 'Why does XGBoost incorporate second-order Taylor series expansion (Hessian) in its custom objective optimization?',
    option_a: 'To guarantee monotonic convergence without learning rates',
    option_b: 'To calculate optimal tree leaf weights and split gain scores analytically for any arbitrary differentiable loss function',
    option_c: 'To eliminate the need for cross-validation',
    option_d: 'To convert decision trees into linear vector spaces',
    correct_option: 'B',
    explanation: 'By approximating the loss with both gradient (g) and hessian (h), XGBoost evaluates leaf weights w* = -G/(H+lambda) in closed form.'
  },

  // ================= 5. ZONE COVERAGE (Unsupervised & Anomaly Detection) =================
  {
    difficulty: 'ROOKIE',
    topic_id: 'fs',
    category: 'Clustering',
    question_text: 'Which clustering algorithm requires specifying the number of clusters (K) in advance and assumes spherical clusters?',
    option_a: 'DBSCAN',
    option_b: 'K-Means',
    option_c: 'OPTICS',
    option_d: 'Agglomerative Hierarchical',
    correct_option: 'B',
    explanation: 'K-Means partitions data into K predefined centroids using Euclidean distance, assuming spherical clusters of similar size.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'fs',
    category: 'Dimensionality Reduction',
    question_text: 'In Principal Component Analysis (PCA), what mathematical construct do the principal component directions correspond to?',
    option_a: 'The eigenvectors of the feature covariance matrix ordered by decreasing eigenvalues',
    option_b: 'The inverse gradient of the residual error matrix',
    option_c: 'The centroid distance vectors between clusters',
    option_d: 'The L1 norm projection vectors of independent columns',
    correct_option: 'A',
    explanation: 'PCA diagonalizes the covariance matrix: eigenvectors define orthogonal axes of maximum variance, and eigenvalues quantify explained variance.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'fs',
    category: 'Anomaly Detection',
    question_text: 'How does an Isolation Forest isolate anomalies much faster than normal data points?',
    option_a: 'By fitting hyperplanes using support vector margins',
    option_b: 'Anomalies reside in sparse regions and require fewer random recursive feature splits to isolate, resulting in significantly shorter path lengths in iTrees',
    option_c: 'By computing cosine similarity against global cluster medoids',
    option_d: 'By applying kernel density estimators to normalized projections',
    correct_option: 'B',
    explanation: 'Outliers require fewer random cuts to isolate from the rest of the sample, creating lower average tree depth/path length.'
  },

  // ================= 6. CLOCK MANAGEMENT (Time Series & Forecasting) =================
  {
    difficulty: 'ROOKIE',
    topic_id: 'st',
    category: 'Time Series Fundamentals',
    question_text: 'What property must a time series exhibit to be considered weakly stationary?',
    option_a: 'Constant mean, constant variance, and autocovariance dependent only on lag distance (not time)',
    option_b: 'Strict zero correlation between all time periods',
    option_c: 'A monotonically increasing linear trend',
    option_d: 'No cyclic or seasonal components over 12 months',
    correct_option: 'A',
    explanation: 'Weak stationarity requires time-invariant mean and variance, and autocovariance that depends solely on time lag.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'st',
    category: 'ARIMA Modeling',
    question_text: 'In an ARIMA(p, d, q) specification, what does the parameter "d" represent?',
    option_a: 'The order of the autoregressive lag polynomial',
    option_b: 'The degree of differencing applied to make the series stationary',
    option_c: 'The order of moving average forecast error terms',
    option_d: 'The seasonal period multiplier',
    correct_option: 'B',
    explanation: 'd is the order of integration/differencing needed to eliminate non-stationary trend.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'st',
    category: 'Time Series Cross-Validation',
    question_text: 'Why is standard K-Fold random cross-validation invalid for time series forecasting models?',
    option_a: 'It inflates memory consumption in batch processing',
    option_b: 'It introduces data leakage and lookahead bias by training on future time periods to predict past observations',
    option_c: 'It cannot compute Root Mean Squared Error (RMSE)',
    option_d: 'It forces target transformations to logarithmic scales',
    correct_option: 'B',
    explanation: 'Random shuffling shuffles future data into training folds, violating temporal causality (lookahead leakage). Rolling-window/expanding-window validation must be used.'
  },

  // ================= 7. THE FRANCHISE QB (Deep Learning) =================
  {
    difficulty: 'ROOKIE',
    topic_id: 'qb',
    category: 'Neural Networks',
    question_text: 'Which non-linear activation function helps mitigate the vanishing gradient problem in deep neural networks compared to Sigmoid?',
    option_a: 'ReLU (Rectified Linear Unit)',
    option_b: 'Tanh',
    option_c: 'Softmax',
    option_d: 'Linear Step',
    correct_option: 'A',
    explanation: 'ReLU has a constant derivative of 1 for positive inputs, preventing exponential decay of backpropagated gradients.'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'qb',
    category: 'Convolutional & Recurrent Architectures',
    question_text: 'What is the purpose of Batch Normalization in deep neural networks during training?',
    option_a: 'To reduce internal covariate shift by normalizing layer inputs to zero mean and unit variance across the mini-batch',
    option_b: 'To convert fully connected layers into 1D convolutions',
    option_c: 'To eliminate the need for loss backpropagation',
    option_d: 'To dynamically alter the number of hidden neurons',
    correct_option: 'A',
    explanation: 'Batch Normalization stabilizes and accelerates training by normalizing activations across the mini-batch, allowing higher learning rates.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'qb',
    category: 'Attention & Transformers',
    question_text: 'In the Transformer Scaled Dot-Product Attention mechanism Softmax(QK^T / sqrt(d_k))V, why are query-key dot products scaled by 1/sqrt(d_k)?',
    option_a: 'To prevent large values from pushing Softmax into regions with extremely small gradients',
    option_b: 'To compress token representations into orthogonal subspaces',
    option_c: 'To invert the positional encoding vectors',
    option_d: 'To ensure quadratic memory reduction in multi-head blocks',
    correct_option: 'A',
    explanation: 'For large projection dimensions d_k, dot products grow large in magnitude, driving the softmax function into regions with tiny gradients (gradient vanishing).'
  },

  // ================= 8. AUDIBLES & CALLING (NLP & Generative AI) =================
  {
    difficulty: 'ROOKIE',
    topic_id: 'dc',
    category: 'NLP Embeddings',
    question_text: 'What is the primary advantage of contextual word embeddings (BERT) over static word embeddings (Word2Vec / GloVe)?',
    option_a: 'BERT produces smaller vocabulary matrices',
    option_b: 'BERT generates different vector representations for a word depending on its surrounding context in the sentence',
    option_c: 'Word2Vec cannot run on GPU acceleration',
    option_d: 'BERT does not require tokenizer vocabularies',
    correct_option: 'B',
    explanation: 'BERT computes dynamic contextual representations (e.g. "bank" of a river vs "bank" for money have different vectors).'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'dc',
    category: 'RAG Architecture',
    question_text: 'In a Retrieval-Augmented Generation (RAG) system, what is the primary role of a Vector Database (e.g. Pinecone, Chroma, pgvector)?',
    option_a: 'To fine-tune transformer attention weights on custom corpora',
    option_b: 'To index text chunk embeddings and perform fast Approximate Nearest Neighbor (ANN) semantic similarity search',
    option_c: 'To format prompt responses into JSON schema',
    option_d: 'To evaluate BLEU and ROUGE benchmark scores',
    correct_option: 'B',
    explanation: 'Vector databases store embedding vectors and retrieve the top-K semantically relevant document chunks given a user query embedding.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'dc',
    category: 'LLM Fine-Tuning & Quantization',
    question_text: 'What mathematical principle enables LoRA (Low-Rank Adaptation) to fine-tune large language models with a fraction of trainable parameters?',
    option_a: 'Decomposing weight update matrices Delta_W into the product of two low-rank matrices B and A where rank r << min(d, k)',
    option_b: 'Quantizing weights from float32 to int2 using stochastic rounding',
    option_c: 'Pruning attention heads with low mutual information',
    option_d: 'Replacing causal masking with bidirectional prefix encodings',
    correct_option: 'A',
    explanation: 'LoRA freezes the pretrained weights W0 and represents the update Delta_W as B * A, where B (d x r) and A (r x k) have small rank r.'
  },

  // ================= 9. THE FRONT OFFICE (MLOps & System Architecture) =================
  {
    difficulty: 'ROOKIE',
    topic_id: 'gm',
    category: 'Model Monitoring',
    question_text: 'What type of model degradation occurs when the statistical distribution of input features changes over time while the target relationship P(Y|X) remains unchanged?',
    option_a: 'Concept Drift',
    option_b: 'Data Drift (Covariate Shift)',
    option_c: 'Prior Probability Shift',
    option_d: 'Target Leakage',
    correct_option: 'B',
    explanation: 'Data Drift / Covariate Shift refers to changes in P(X), whereas Concept Drift refers to changes in the conditional distribution P(Y|X).'
  },
  {
    difficulty: 'PRO-BOWLER',
    topic_id: 'gm',
    category: 'Deployment Strategies',
    question_text: 'Which deployment strategy routes a small percentage of production traffic to a new model version while serving the majority with the baseline to evaluate live performance with minimal risk?',
    option_a: 'Blue-Green Deployment',
    option_b: 'Canary Deployment',
    option_c: 'Shadow Deployment',
    option_d: 'Rolling Deployment',
    correct_option: 'B',
    explanation: 'Canary deployments route a small fraction of live traffic to the candidate model to monitor stability before full rollout.'
  },
  {
    difficulty: 'HALL OF FAMER',
    topic_id: 'gm',
    category: 'Feature Stores & Low Latency Serving',
    question_text: 'In enterprise MLOps architectures (e.g. Feast, Tecton), what is the primary architectural purpose of a dual-layer Feature Store (Online vs Offline)?',
    option_a: 'Online store (Redis/DynamoDB) delivers millisecond latency features for real-time inference, while Offline store (Snowflake/BigQuery) provides point-in-time correct historical features for training without leakage',
    option_b: 'To convert unstructured video streams into tabular CSV dumps',
    option_c: 'To automatically generate model documentation and licenses',
    option_d: 'To run distributed unit tests across GPU clusters',
    correct_option: 'A',
    explanation: 'Dual feature stores solve training-serving skew: low latency key-value reads in production and point-in-time historical joins for training.'
  }
];

export const seedQuestions = async (): Promise<void> => {
  // Setup tables if needed
  await query(`
    CREATE TABLE IF NOT EXISTS questions (
      id VARCHAR(64) PRIMARY KEY,
      difficulty VARCHAR(20) NOT NULL,
      topic_id VARCHAR(20) NOT NULL DEFAULT 'all',
      category VARCHAR(100) NOT NULL,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option CHAR(1) NOT NULL,
      explanation TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query('TRUNCATE TABLE questions CASCADE');

  for (const q of COMPREHENSIVE_QUESTION_BANK) {
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
      console.log('Successfully seeded 9-topic curriculum question bank.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed 9-topic curriculum:', err);
      process.exit(1);
    });
}
