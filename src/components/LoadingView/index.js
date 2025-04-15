import { Oval } from "react-loader-spinner";
import "./index.css";

const LoadingView = ({ width, height, color = "#0d6efd" }) => {
  return (
    <div className="loader-container">
      <Oval
        visible={true}
        height="80"
        width="80"
        color={color}
        secondaryColor="grey"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default LoadingView;
