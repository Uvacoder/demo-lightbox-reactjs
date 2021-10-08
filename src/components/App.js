import React from "react";
// Internal styles
import "./App.scss";
// External component libraries
import GridList from "react-gridlist";
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper } from "simple-react-lightbox";

// Setting Viewport size
const viewportContext = React.createContext({});

const ViewportProvider = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);
  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};
const useViewport = () => {
  const { width, height } = React.useContext(viewportContext);
  return { width, height };
};
const MobileComponent = () => <p></p>;
const DesktopComponent = () => <p></p>;
const AppComponent = () => {
  const { width } = useViewport();
  const breakpoint = 600;
  return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

// Fetching random images - limit 30
const images = Array.from({ length: 30 }, (_, i) => {
  let width = 300;
  let height = Math.floor(Math.random() * 300) + 100;
  return {
    url: `https://picsum.photos/id/${
      Math.floor(Math.random() * 300) + 300
    }/${width}/${height}.jpg`,
    width,
    height,
  };
});

// Setting container styles
let styles = {
  container: {
    margin: "20px auto",
    padding: "0 20px",
  },
  image: {
    position: "relative",
    width: "100%",
    height: "auto",
    verticalAlign: "top",
    background: "hsl(0, 0%, 98%)",
  },
};

// Material-ui Gridlist props
const getGridGap = (elementWidth, windowHeight) =>
  elementWidth > 720 && windowHeight > 480 ? 10 : 5;

const getColumnCount = (elementWidth) => Math.floor(elementWidth / 300);

const getWindowMargin = (windowHeight) => Math.round(windowHeight * 1.5);

const getItemData = (image, columnWidth) => {
  let imageRatio = image.height / image.width;
  let adjustedHeight = Math.round(columnWidth * imageRatio);
  return {
    key: image.url,
    height: adjustedHeight,
  };
};

const App = () => (
  <ViewportProvider>
    <SimpleReactLightbox>
      <AppComponent />
      <div style={styles.container} role="button" aria-label="section">
        <SRLWrapper>
          <GridList
            items={images}
            getGridGap={getGridGap}
            getColumnCount={getColumnCount}
            getWindowMargin={getWindowMargin}
            getItemData={getItemData}
            renderItem={(image) => {
              return (
                <img
                  src={image.url}
                  width={image.width}
                  height={image.height}
                  aria-live="polite"
                  aria-atomic="true"
                  alt=""
                />
              );
            }}
          />
        </SRLWrapper>
      </div>
    </SimpleReactLightbox>
  </ViewportProvider>
);
export default App;
