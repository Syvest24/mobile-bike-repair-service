import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { BikeIssue } from '../types';

interface DiagnosticToolProps {
  onIssuesDetected: (issues: BikeIssue[]) => void;
}

const issueTypes = [
  {
    type: 'flat_tire' as const,
    label: 'Flat Tire',
    questions: [
      'Is the tire completely flat?',
      'Can you see any visible punctures?',
      'Is it the front or rear tire?'
    ],
    estimatedCost: 25,
    estimatedTime: 15
  },
  {
    type: 'brake_issue' as const,
    label: 'Brake Problems',
    questions: [
      'Are the brakes making noise?',
      'Do the brakes feel spongy?',
      'Is it hard to stop?'
    ],
    estimatedCost: 45,
    estimatedTime: 30
  },
  {
    type: 'chain_problem' as const,
    label: 'Chain Issues',
    questions: [
      'Is the chain slipping?',
      'Is the chain making noise?',
      'Has the chain come off?'
    ],
    estimatedCost: 35,
    estimatedTime: 20
  },
  {
    type: 'gear_issue' as const,
    label: 'Gear Problems',
    questions: [
      'Are gears not shifting smoothly?',
      'Is the bike stuck in one gear?',
      'Are you hearing grinding noises?'
    ],
    estimatedCost: 55,
    estimatedTime: 40
  }
];

export default function DiagnosticTool({ onIssuesDetected }: DiagnosticToolProps) {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'questions' | 'results'>('selection');
  const [answers, setAnswers] = useState<Record<string, boolean[]>>({});

  const handleIssueToggle = (issueType: string) => {
    setSelectedIssues(prev =>
      prev.includes(issueType)
        ? prev.filter(type => type !== issueType)
        : [...prev, issueType]
    );
  };

  const handleQuestionAnswer = (issueType: string, questionIndex: number, answer: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [issueType]: {
        ...prev[issueType],
        [questionIndex]: answer
      }
    }));
  };

  const generateDiagnosis = () => {
    const detectedIssues: BikeIssue[] = selectedIssues.map(issueType => {
      const issueConfig = issueTypes.find(type => type.type === issueType)!;
      const issueAnswers = answers[issueType] || [];
      const positiveAnswers = Object.values(issueAnswers).filter(Boolean).length;

      let severity: 'low' | 'medium' | 'high' = 'low';
      if (positiveAnswers >= 2) severity = 'high';
      else if (positiveAnswers === 1) severity = 'medium';

      return {
        id: `issue-${Date.now()}-${issueType}`,
        type: issueType as any,
        description: `${issueConfig.label} detected through diagnostic`,
        severity,
        estimated_cost: issueConfig.estimatedCost,
        estimated_time: issueConfig.estimatedTime
      };
    });

    onIssuesDetected(detectedIssues);
    setCurrentStep('results');
  };

  const totalCost = selectedIssues.reduce((sum, issueType) => {
    const issue = issueTypes.find(type => type.type === issueType);
    return sum + (issue?.estimatedCost || 0);
  }, 0);

  const totalTime = selectedIssues.reduce((sum, issueType) => {
    const issue = issueTypes.find(type => type.type === issueType);
    return sum + (issue?.estimatedTime || 0);
  }, 0);

  if (currentStep === 'selection') {
    return (
      <div className="card">
        <div className="flex items-center mb-6">
          <AlertCircle className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Bike Diagnostic Tool</h3>
        </div>

        <p className="text-gray-600 mb-6">
          Select the issues you're experiencing with your bike:
        </p>

        <div className="space-y-3 mb-6">
          {issueTypes.map((issue) => (
            <label
              key={issue.type}
              className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedIssues.includes(issue.type)}
                onChange={() => handleIssueToggle(issue.type)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">{issue.label}</div>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Est. ${issue.estimatedCost}
                  <Clock className="h-3 w-3 ml-3 mr-1" />
                  {issue.estimatedTime} min
                </div>
              </div>
            </label>
          ))}
        </div>

        {selectedIssues.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Total estimate: <span className="font-semibold">${totalCost}</span> • {totalTime} min
            </div>
            <button
              onClick={() => setCurrentStep('questions')}
              className="btn-primary"
            >
              Continue Diagnosis
            </button>
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 'questions') {
    return (
      <div className="card">
        <div className="flex items-center mb-6">
          <AlertCircle className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Detailed Questions</h3>
        </div>

        <div className="space-y-6">
          {selectedIssues.map(issueType => {
            const issue = issueTypes.find(type => type.type === issueType)!;
            return (
              <div key={issueType} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{issue.label}</h4>
                <div className="space-y-3">
                  {issue.questions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{question}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleQuestionAnswer(issueType, index, true)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            answers[issueType]?.[index] === true
                              ? 'bg-success-100 text-success-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleQuestionAnswer(issueType, index, false)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            answers[issueType]?.[index] === false
                              ? 'bg-error-100 text-error-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep('selection')}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            onClick={generateDiagnosis}
            className="btn-primary"
          >
            Get Diagnosis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <CheckCircle className="h-6 w-6 text-success-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Diagnosis Complete</h3>
      </div>

      <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
        <p className="text-success-800 text-sm">
          We've analyzed your bike's symptoms and prepared a service estimate.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {selectedIssues.map(issueType => {
          const issue = issueTypes.find(type => type.type === issueType)!;
          const issueAnswers = answers[issueType] || [];
          const positiveAnswers = Object.values(issueAnswers).filter(Boolean).length;

          let severity: 'low' | 'medium' | 'high' = 'low';
          let severityColor = 'text-success-600 bg-success-50';

          if (positiveAnswers >= 2) {
            severity = 'high';
            severityColor = 'text-error-600 bg-error-50';
          } else if (positiveAnswers === 1) {
            severity = 'medium';
            severityColor = 'text-warning-600 bg-warning-50';
          }

          return (
            <div key={issueType} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{issue.label}</h4>
                <span className={`badge ${severityColor}`}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)} Priority
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                ${issue.estimatedCost}
                <Clock className="h-4 w-4 ml-4 mr-1" />
                {issue.estimatedTime} min
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Estimate</span>
          <div className="text-right">
            <div className="font-semibold text-lg text-gray-900">${totalCost}</div>
            <div className="text-sm text-gray-600">{totalTime} minutes</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setCurrentStep('selection');
          setSelectedIssues([]);
          setAnswers({});
        }}
        className="btn-primary w-full"
      >
        Book This Service
      </button>
    </div>
  );
}
