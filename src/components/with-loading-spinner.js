import React from "react";

export default Component =>
  class WithLoadingSpinner extends React.Component {
    render() {
      if (this.props.data && !this.props.data.loading) {
        return <Component {...this.props} />;
      } else {
        return <div>Spinner...</div>;
      }
    }
  };
