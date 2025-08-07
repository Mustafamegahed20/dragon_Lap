import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const WithTitle = ({ component: WrappedComponent, title, ...rest }) => {
  const params = useParams();
  const dynamicTitle = Object.keys(params) // return an array of the keys (parameter names)
    .map((key) => params[key]) // return an array of the corresponding values (parameter values)
    .join(" - ");

  return (
    <>
      <Helmet>
        <title>{dynamicTitle ? `${title} - ${dynamicTitle}` : title}</title>
      </Helmet>
      <WrappedComponent {...rest} />
    </>
  );
};

export default WithTitle;
