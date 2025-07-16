import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ChromePicker, ColorResult } from "react-color";

import './Patterns.css';
import NumberPicker from '../../components/NumberPicker';
import BasicModal from '../../components/BasicModal';

type GlobalContextType = {
  useCustomColor: boolean;
  pattern: Pattern;
  setPattern: (p: Pattern) => void;
  setUseCustomColor: (value: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

let gambiarraFdc = false;

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [useCustomColor, setUseCustomColor] = useState(false);

  const [pattern, setPattern] = useState<Pattern>(() => {
        const p = new Pattern();

        p.addStep(300, [1, 1, 0, 0]);
        p.addStep(300, [0, 0, 0, 0]);
        p.addStep(300, [0, 0, 1, 1]);
        p.addStep(300, [0, 0, 0, 0]);

        return p;
  });

  return (
    <GlobalContext.Provider value={{ useCustomColor, setUseCustomColor, pattern, setPattern }}>
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


const PatternsPage: React.FC = () => {
    
    const currentStepIndexRef = useRef(0);
    const [currentStep, setCurrentStep] = useState<Step | undefined>();

    const {useCustomColor, setUseCustomColor, pattern, setPattern} = useGlobalContext();

    const [numOfLeds, setNumOfLeds] = useState(pattern.steps[0].values.length);

    const [generatedData, setGeneratedData] = useState("No data");

    const [loadData, setLoadData] = useState("");

    const [generateModalVisible, setGenerateModalVisible] = useState(false);
    const [loadModalVisible, setLoadModalVisible] = useState(false);

    function generateMobileINI()
    {
        var str = `[Pattern]\n`;
        
        for(const step of pattern.steps)
        {
            for(var i = 0; i < step.values.length; i++)
            {
            str += `${step.values[i]}`;
            }
            
            str += `|${step.time}\n`;
        }
        
        return str;
    }

    function generateMobileJSON()
    {
        var json: any = {steps: []}
        
        for(const step of pattern.steps)
        {
            json.steps.push({
                data: step.values,
                duration: step.time,
                useCustomColor: step.useCustomColor,
                customColor: hexColorToRGBA(step.customColor),
                useCustomLedColor: step.useCustomLedColor,
                customLedColor: hexColorToRGBA(step.customLedColor)
            });
        }
        
        var str = ``;
        str = JSON.stringify(json);
        
        return str;
    }

    function loadJSON(text: string)
    {
        if(text.length == 0)
        {
            alert("Textarea is empty!")
            return;
        }
        
        let useCustomColor = false;

        try
        {
            pattern.steps = [];
            
            console.log(text)
            
            var json = JSON.parse(text);
            
            console.log(json);

            

            for(const stepValue of json.steps)
            {
                if(stepValue.useCustomColor === true) useCustomColor = true;
                if(stepValue.useCustomLedColor === true) useCustomColor = true;
            }

            
            

            //pattern.setAmountOfLights(json.steps[0].data.length);
            
            for(const stepValue of json.steps)
            {
                const step = pattern.addStep(stepValue.duration, stepValue.data)
                
                step.useCustomColor = useCustomColor;
                step.useCustomLedColor = useCustomColor;

                //if(stepValue.useCustomColor != undefined) step.useCustomColor = stepValue.useCustomColor;
                if(stepValue.customColor != undefined)
                {
                    
                    step.customColor = rgbaToHex(stepValue.customColor);

                    console.log(`${stepValue.customColor} virou ${step.customColor}`);
                }
                
                //if(stepValue.useCustomLedColor != undefined) step.useCustomLedColor = stepValue.useCustomLedColor;
                if(stepValue.customLedColor != undefined)  step.customLedColor = rgbaToHex(stepValue.customLedColor);
                
                console.log("stepValue", stepValue);
                console.log("step", step);
            }
            
        } catch (err) {
            alert("Error loading");
            console.error(err);
        }

        setUseCustomColor(useCustomColor);
        setPattern(pattern);
        setNumOfLeds(pattern.steps[0].values.length);
    }

    const handleGenerateData = () => {

        var data = generateMobileJSON();

        setGeneratedData(data);
        setGenerateModalVisible(true);
    }

    const handleOpenLoadData = () => {
        setLoadModalVisible(true);
    }

    const handleLoadData = () => {
        loadJSON(loadData);
        setLoadModalVisible(false);
    }

    const timeElapsedRef = useRef(0);
    
    const lastTickRef = useRef(Date.now());
    const intervalRef = useRef<NodeJS.Timeout>();

    const handleToggleCustomColor = () => {
        var newValue = !useCustomColor;

        setUseCustomColor(newValue);

        for(const step of pattern.steps)
        {
            step.useCustomColor = newValue;
            step.useCustomLedColor = newValue;
        }
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

        if(gambiarraFdc)
        {
            gambiarraFdc = false;

            timeElapsedRef.current = 0;
            currentStepIndexRef.current = 0;

            const newStep = pattern.steps[0];
            setCurrentStep(newStep);
        }


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
        steps.push(<StepElement key={i} index={i} step={step}></StepElement>);
    }


    return (
        <div className="container mt-2">
            <div className="text-center mb-2">
                Padrão
            </div>

            <div className="d-flex justify-content-center gap-1">
                {leds}
            </div>

            <div className="d-flex flex-column align-items-center mt-3">
                <div className="d-flex justify-content-start align-items-center gap-3">
                    <span className=''>Número de luzes:</span>
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

                <div>
                    <button onClick={handleGenerateData} className='btn btn-primary m-3'>Gerar json</button>
                    <button onClick={handleOpenLoadData} className='btn btn-primary m-3'>Carregar json</button>
                </div>

                <BasicModal visible={generateModalVisible} onClose={() => {
                    setGenerateModalVisible(false);
                }}>
                    <div>
                        <textarea 
                            style={{width: "100%"}}
                            rows={10}
                            value={generatedData}
                            onChange={() => {}}
                        ></textarea>
                    </div>
                </BasicModal>

                <BasicModal visible={loadModalVisible} onClose={() => {
                    setLoadModalVisible(false);
                }}>
                    <div>
                        <textarea 
                            style={{width: "100%"}}
                            rows={10}
                            value={loadData}
                            onChange={(e) => { setLoadData(e.target.value) }}
                        ></textarea>

                        <button onClick={handleLoadData}>Carregar</button>
                    </div>
                </BasicModal>
            </div>
        </div>
    );
}

export interface StepElementProps {
    step: Step
    index: number
}

const StepElement: React.FC<StepElementProps> = (props) => {

    const {useCustomColor, pattern, setPattern} = useGlobalContext();

    const customColorDisplay = useCustomColor ? "block" : "none";

    const [color, setColor] = useState<ColorResult['rgb']>(() => {

        const hex = props.step.customColor;
        const c = hexColorToRGBA(hex);

        console.log(props.step.customColor);
        console.log(c);

        const val: ColorResult['rgb'] = {
            r: c.r,
            g: c.g,
            b: c.b,
            a: c.a / 255  // <- inclui alpha normalizado
        }

        return val;
    });

    //props.step.customLedColor
    const [ledColor, setLedColor] = useState<ColorResult['rgb']>(() => {

        const hex = props.step.customLedColor;
        const c = hexColorToRGBA(hex);

        console.log(props.step.customLedColor);
        console.log(c);

        const val: ColorResult['rgb'] = {
            r: c.r,
            g: c.g,
            b: c.b,
            a: c.a / 255  // <- inclui alpha normalizado
        }

        return val;
    });

    const [timeStr, setTimeStr] = useState(`${props.step.time}`);

    const [time, setTime] = useState(props.step.time);

    const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        let valueInt = parseInt(value);

        if(!(valueInt >= 1 && valueInt < 10000))
        {
            valueInt = 1;
        }

        props.step.time = valueInt;

        setTime(valueInt);
        setTimeStr(value);
    }   

    const handleClickClose = () => {
        console.log(`delete ${props.index}`);

        const newPattern = new Pattern();
        newPattern.steps = [...pattern.steps]; // copia os steps

        newPattern.removeStep(props.index); // remove o step correto

        setPattern(newPattern);
        gambiarraFdc = true;
    }

    React.useEffect(() => {

        // props.step.customColor = rgbaToHex(color);
        // props.step.customLedColor = rgbaToHex(ledColor);

    }, [color, ledColor])


    const stepToggleButtons: React.JSX.Element[] = [];
    for(let i = 0; i < props.step.values.length; i++)
    {
        const value = props.step.values[i];
        stepToggleButtons.push(<StepToggleButton key={i} step={props.step} index={i} on={value == 1}></StepToggleButton>);
    }

    const inputStyle = {
        backgroundColor: "#3e3e3e",
        color: "#ffffff"
    }

    return <>
        <div className="p-2 border rounded" style={{ maxWidth: 400 }}>
            {/* Botão de fechar no topo esquerdo */}
            <div className="d-flex justify-content-start">
                <button onClick={handleClickClose} className="btn btn-sm btn-outline-danger">X</button>
            </div>

            {/* Tempo */}
            <div className="my-2 d-flex align-items-center">
                <label className="form-label me-2 mb-0" style={{ minWidth: '60px' }}>Tempo</label>
                <input style={inputStyle} onChange={(e) => handleChangeTime(e)} value={timeStr} type="number" className="form-control" />
            </div>

            <div className="d-flex">
                {stepToggleButtons}
            </div>

            {/* Cores dos LEDs */}
            <div className="mt-2" style={{ display: customColorDisplay }}>
                <div className="my-2 d-flex align-items-start justify-content-between gap-3">
                    <label className="form-label mt-2">Cor (Corona)</label>
                    <ChromePicker
                    color={color}
                    onChange={(newColor: ColorResult) => {
                        setColor(newColor.rgb);
                    }}
                    disableAlpha={false}
                    styles={{ default: { picker: { width: '220px' } } }} // opcional
                    />
                </div>

                <div className="my-2 d-flex align-items-start justify-content-between gap-3">
                    <label className="form-label mt-2">Cor (LED)</label>
                    <ChromePicker
                    color={ledColor}
                    onChange={(newColor: ColorResult) => {
                        setLedColor(newColor.rgb);
                    }}
                    disableAlpha={false}
                    styles={{ default: { picker: { width: '220px' } } }} // opcional
                    />
                </div>
            </div>
        </div>
    </>
}

export interface StepToggleButtonProps {
    step: Step
    index: number
    on: boolean
}

const StepToggleButton: React.FC<StepToggleButtonProps> = (props) =>
{
    const { on, index, step } = props;

    const [state, setState] = useState(on);

    const {pattern, setPattern} = useGlobalContext();

    const backgroundColor = state ? "#ffffff" : "#000000";

    const handleClick = () => {
        const newValue = state ? 0 : 1;

        // Atualiza o pattern inteiro imutavelmente:
        const newPattern = new Pattern();
        newPattern.steps = pattern.steps.map((s, si) => {
            if (s === step) {
            return {
                ...s,
                values: s.values.map((v, vi) => (vi === index ? newValue : v))
            };
            }
            return { ...s, values: [...s.values] };
        });

        setPattern(newPattern);
        setState(!state);
    };

    return <>
        <div onClick={handleClick} className='led-toggle' style={{backgroundColor: backgroundColor}}>
            {state ? 1 : 0}
        </div>
    </>;
}

interface Step {
    time: number;
    values: number[];

    useCustomColor: boolean;
    customColor: string;

    useCustomLedColor: boolean;
    customLedColor: string;
}

class Pattern {
    
    public steps: Step[] = [];

    public addStep(time: number, values: number[])
    {
        const step: Step = {
            time: time,
            values: values,
            customColor: "#0000ff",
            customLedColor: "#ffffff",
            useCustomColor: false,
            useCustomLedColor: false
        }
    
        this.steps.push(step)

        return step;
    }

    public removeStep(index: number): void {
        if (index >= 0 && index < this.steps.length) {
            const removed = this.steps[index];
            console.log("Removendo step no índice:", index);
            console.log("Conteúdo do step:", removed);

            this.steps.splice(index, 1);

            console.log("Steps restantes:", this.steps);
        } else {
            console.error(`Índice inválido ao remover step: ${index}`);
        }
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
        colorOn = props.step.customColor;
        ledOn = props.step.customLedColor;
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

function hexColorToRGBA(hex: string) {
  // Remove o "#" se existir
  hex = hex.replace(/^#/, '');

  // Suporta formatos #RGB, #RRGGBB, #RRGGBBAA
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const bigint = parseInt(hex, 16);

  let r = 0, g = 0, b = 0, a = 255;

  if (hex.length === 6) {
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else if (hex.length === 8) {
    r = (bigint >> 24) & 255;
    g = (bigint >> 16) & 255;
    b = (bigint >> 8) & 255;
    a = bigint & 255;
  }

  return { r, g, b, a };
}

function rgbaToHex({ r, g, b, a }: { r: number, g: number, b: number, a?: number }): string {
  const toHex = (v: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(v)));
    return clamped.toString(16).padStart(2, '0');
  };

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  if (typeof a === 'number') {
    const alpha = a <= 1 ? a * 255 : a; // aceita tanto 0–1 quanto 0–255
    return hex + toHex(alpha);
  }

  return hex;
}

export default Patterns;