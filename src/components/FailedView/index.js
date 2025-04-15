const FailedView = (props) => {
  const { error } = props;
  return (
    <div>
      <h1>Something went Wrong</h1>
      <p>{error}</p>
    </div>
  );
};

export default FailedView;
