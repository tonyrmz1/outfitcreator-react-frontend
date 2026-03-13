import { ErrorMessage } from './ErrorMessage';

/**
 * ErrorMessage Component Examples
 * 
 * This file demonstrates the various configurations of the ErrorMessage component.
 * It serves as both documentation and a visual reference for developers.
 */

export const ErrorMessageExamples = () => {
  const handleRetry = () => {
    console.log('Retry clicked');
  };

  const handleDismiss = () => {
    console.log('Dismiss clicked');
  };

  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Error Message</h2>
        <ErrorMessage message="Something went wrong. Please try again." />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">With Retry Button</h2>
        <ErrorMessage 
          message="Failed to load data. Click retry to try again." 
          onRetry={handleRetry}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">With Dismiss Button</h2>
        <ErrorMessage 
          message="This is a dismissible warning message." 
          onDismiss={handleDismiss}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">With Both Buttons</h2>
        <ErrorMessage 
          message="Network error occurred. You can retry or dismiss this message." 
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Common Error Scenarios</h2>
        <div className="space-y-4">
          <ErrorMessage 
            message="Network connection failed. Please check your internet connection." 
            onRetry={handleRetry}
          />
          <ErrorMessage 
            message="The requested resource was not found (404)." 
            onDismiss={handleDismiss}
          />
          <ErrorMessage 
            message="Server error (500). Please try again later." 
            onRetry={handleRetry}
            onDismiss={handleDismiss}
          />
          <ErrorMessage 
            message="Validation failed: Please check your input and try again." 
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Long Error Message</h2>
        <ErrorMessage 
          message="An unexpected error occurred while processing your request. This could be due to a temporary server issue, network connectivity problems, or an invalid request. Please try again in a few moments. If the problem persists, please contact support." 
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />
      </section>
    </div>
  );
};

export default ErrorMessageExamples;
