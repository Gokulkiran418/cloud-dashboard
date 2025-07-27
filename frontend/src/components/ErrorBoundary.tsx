import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center text-red-700 font-semibold">
          😬 Something went wrong.<br />
          <button
            className="btn-secondary mt-4"
            onClick={() => window.location.reload()}
            tabIndex={0}
            aria-label="Reload Page"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
