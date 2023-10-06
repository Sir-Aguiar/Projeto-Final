import { ArrowRight } from "@mui/icons-material";
import { Divider } from "@mui/material";

const TutorialTitle: React.FC<{ children: string }> = ({ children }) => {
  return (
    <Divider flexItem className="font-Montserrat font-semibold">
      {children}
    </Divider>
  );
};

const TutorialStep: React.FC<{ title: string; stage?: number; children: JSX.Element[] | JSX.Element }> = ({
  title,
  children,
  stage,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex items-center justify-start gap-1">
        <div className="flex items-center">
          <div className="w-[25px] h-[25px] flex items-center justify-center rounded-full bg-blue-500 text-background text-sm font-Lato font-bold">
            {stage}
          </div>
          <div className="w-[25px] h-[2px] rounded-full bg-blue-500"></div>
        </div>
        <h1 className="text-blue-500 text-sm font-medium">{title}</h1>
      </div>
      <div className="flex items-center w-full gap-2">
        <ArrowRight />
        <div className="w-full text-[12px] flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
};

const Tutorial: React.FC<{ area: 2 | 3; children: JSX.Element[] }> = ({ area, children }) => {
  return (
    <div
      className={`flex flex-col items-center justify-start gap-3 w-full h-full max-w-[${
        area === 2 ? "300px" : "100%"
      }] mobile:max-w-full`}
    >
      {children}
    </div>
  );
};

export { Tutorial, TutorialStep, TutorialTitle };
