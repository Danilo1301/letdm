import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import './Patterns.css';
import NumberPicker from '../../components/NumberPicker';

type GlobalContextType = {
  useCustomColor: boolean;
  setUseCustomColor: (value: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [useCustomColor, setUseCustomColor] = useState(false);

  return (
    <GlobalContext.Provider value={{ useCustomColor, setUseCustomColor }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook de acesso mais fácil
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext deve ser usado dentro de um <ColorProvider>");
  }
  return context;
};

let defaultPattern: Pattern | undefined;

const PatternsPage: React.FC = () => {
    
    if(!defaultPattern)
    {
        const p = new Pattern();
        p.addStep(300, [1, 1, 0, 0]);
        p.addStep(300, [0, 0, 0, 0]);
        p.addStep(300, [0, 0, 1, 1]);
        p.addStep(300, [0, 0, 0, 0]);

        defaultPattern = p;
    }

    const currentStepIndexRef = useRef(0);
    const [currentStep, setCurrentStep] = useState<Step | undefined>();

    const [numOfLeds, setNumOfLeds] = useState(defaultPattern!.steps[0].values.length);

    const {useCustomColor, setUseCustomColor} = useGlobalContext();

    const timeElapsedRef = useRef(0);
    const lastTickRef = useRef(Date.now());
    const intervalRef = useRef<NodeJS.Timeout>();

    const [pattern] = useState<Pattern>(() => {
        return defaultPattern!;
    });

    const handleToggleCustomColor = () => {
        setUseCustomColor(!useCustomColor);
    }

    // Atualiza currentStep sempre que currentStepIndex mudar
    useEffect(() => {
        const step = pattern.steps[currentStepIndexRef.current];
        if (step) setCurrentStep(step);
    }, [currentStepIndexRef, pattern]);

    // Tick principal
    const tick = () => {
        const now = Date.now();
        const diff = now - lastTickRef.current;
        lastTickRef.current = now;

        timeElapsedRef.current += diff;

        const step = pattern.steps[currentStepIndexRef.current];
        if (step) {
            if (timeElapsedRef.current >= step.time) {
                timeElapsedRef.current = 0;

                const next = (currentStepIndexRef.current + 1) % pattern.steps.length;
                currentStepIndexRef.current = next;

                const newStep = pattern.steps[currentStepIndexRef.current];
                setCurrentStep(newStep);
            }
        }

    };

     // Inicia o loop
    useEffect(() => {
        intervalRef.current = setInterval(tick, 10);

        return () => clearInterval(intervalRef.current); // limpar no unmount
    }, []);

    //const firstStep = pattern.steps[0];
    //const numOfLeds = firstStep?.values.length ?? 0;

    const leds: React.JSX.Element[] = [];

    if (currentStep) {
        console.log("led updated");
        
        if(numOfLeds < 20)
        {
            for (let i = 0; i < numOfLeds; i++) {
            const on = currentStep.values[i] === 1;
                leds.push(<Led key={i} useCustomColor={useCustomColor} step={currentStep} on={on} />);
            }
        }
    }

    const steps: React.JSX.Element[] = [];
    for(let i = 0; i < pattern.steps.length; i++)
    {
        const step = pattern.steps[i];
        steps.push(<StepElement key={i} step={step}></StepElement>);
    }


    return (
        <div className="container mt-2">
            <div className="text-center mb-2">
                Tempo: {timeElapsedRef.current}ms
            </div>

            <div className="d-flex justify-content-center gap-1">
                {leds}
            </div>

            <div className="d-flex flex-column align-items-center">
                <div className="d-flex justify-content-start align-items-center m-3">
                    <span>Número de luzes:</span>
                    <NumberPicker
                        startValue={numOfLeds}
                        min={1}
                        max={12}
                        onChange={(value) => setNumOfLeds(value)}
                    />
                </div>

                <button className='btn btn-light m-2' onClick={handleToggleCustomColor}>{useCustomColor == false ? "Usar cor customizada" : "Desativar cor customizada" }</button>

                <div>
                    {steps}
                </div>
            </div>
        </div>
    );
}

export interface StepElementProps {
    step: Step
}

const StepElement: React.FC<StepElementProps> = (props) => {

    const {useCustomColor} = useGlobalContext();

    const customColorDisplay = useCustomColor ? "block" : "none";

    const [color, setColor] = useState(props.step.color); // cor inicial
    const [ledColor, setLedColor] = useState(props.step.ledColor); // cor inicial

    React.useEffect(() => {

        props.step.color = color;
        props.step.ledColor = ledColor;

    }, [color, ledColor])

    return <>
        <div className="p-2 border rounded" style={{ maxWidth: 400 }}>
            {/* Botão de fechar no topo esquerdo */}
            <div className="d-flex justify-content-start">
                <button className="btn btn-sm btn-outline-danger">X</button>
            </div>

            {/* Tempo */}
            <div className="my-2 d-flex align-items-center">
                <label className="form-label me-2 mb-0" style={{ minWidth: '60px' }}>Tempo</label>
                <input type="number" className="form-control" />
            </div>

            <div>colocar botoes pra acender/apagar</div>

            {/* Cores dos LEDs */}
            <div className="mt-2" style={{display: customColorDisplay}}>    

                <div className="my-2 d-flex align-items-center">
                    <label className="form-label">Cor (Corona)</label>
                    <input
                        type="color"
                        className="form-control form-control-color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>

                <div className="my-2 d-flex align-items-center">
                    <label className="form-label">Cor (LED)</label>
                    <input
                        type="color"
                        className="form-control form-control-color"
                        value={ledColor}
                        onChange={(e) => setLedColor(e.target.value)}
                    />
                </div>
            </div>
        </div>
    </>
}

interface Step {
    time: number;
    values: number[];
    color: string;
    ledColor: string;
}

class Pattern {
    public steps: Step[] = [];

    public addStep(time: number, values: number[])
    {
        const step: Step = {
            time: time,
            values: values,
            color: "#0000ff",
            ledColor: "#ffffff"
        }
    
        this.steps.push(step)
    }
}


export interface LedProps {
  step: Step
  on: boolean
  useCustomColor: boolean
}

const Led: React.FC<LedProps> = (props) => {

    let colorOn = "red";
    const colorOff = "#00000000"

    let ledOn = "white";
    const ledOff = "#000000"

    if(props.useCustomColor)
    {
        colorOn = props.step.color;
        ledOn = props.step.ledColor;
    }

    const color = props.on ? colorOn : colorOff;
    const ledColor = props.on ? ledOn : ledOff;
    
    return <>
        <div style={{backgroundColor: color}} className='led'>
            <div style={{backgroundColor: ledColor}} className='led-inside'>
                
            </div>
        </div>
    </>
}

const Patterns = () => {
    return <>
        <GlobalContextProvider>
            <PatternsPage></PatternsPage>
        </GlobalContextProvider>
    </>
}

export default Patterns;