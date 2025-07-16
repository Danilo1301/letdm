// Patterns.tsx
import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { AlphaPicker, ChromePicker, ColorResult } from 'react-color';
import './Patterns.css';
import BasicModal from '../../components/BasicModal';
import NumberPicker from '../../components/NumberPicker';

// Tipos principais
interface Step {
    id: string; // nova propriedade
    time: number;
    values: number[];
    useCustomColor: boolean;
    customColor: string;
    useCustomLedColor: boolean;
    customLedColor: string;
}

const createStep = (time: number, values: number[]): Step => ({
    id: Date.now().toString() + Math.random().toString(36).substring(2),
    time,
    values,
    useCustomColor: false,
    customColor: '#0000ff',
    useCustomLedColor: false,
    customLedColor: '#ffffff',
});

interface Pattern {
  steps: Step[];
}

interface GlobalContextType {
  useCustomColor: boolean;
  setUseCustomColor: (v: boolean) => void;
  pattern: Pattern;
  setPattern: (p: Pattern) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [useCustomColor, setUseCustomColor] = useState(false);

    const [pattern, setPattern] = useState<Pattern>({
        steps: [
            createStep(300, [1, 1, 0]),
            createStep(300, [0, 0, 0]),
            createStep(300, [1, 1, 0]),
        ],
    });

  return (
    <GlobalContext.Provider value={{ useCustomColor, setUseCustomColor, pattern, setPattern }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used inside GlobalProvider");
  return ctx;
};

const Led: React.FC<{ on: boolean; step: Step; useCustomColor: boolean }> = ({ on, step, useCustomColor }) => {
  const bg = on ? (useCustomColor ? step.customColor : 'red') : 'transparent';
  const inside = on ? (useCustomColor ? step.customLedColor : 'white') : 'black';
  return <div className='led' style={{ backgroundColor: bg }}><div className='led-inside' style={{ backgroundColor: inside }} /></div>;
};

const StepToggleButton: React.FC<{ stepIndex: number; ledIndex: number; value: number }> = ({ stepIndex, ledIndex, value }) => {
  const { pattern, setPattern } = useGlobal();
  const toggle = () => {
    const newSteps = pattern.steps.map((step, i) => i === stepIndex
      ? { ...step, values: step.values.map((v, vi) => vi === ledIndex ? (v === 1 ? 0 : 1) : v) }
      : step);
    setPattern({ steps: newSteps });
  };
  const backgroundColor = value == 1 ? "#ffffff" : "#414141";
  const textColor = value == 1 ? "#000000" : "#ffffff";
  return <div style={{backgroundColor: backgroundColor, color: textColor}} className='led-toggle' onClick={toggle}>{value}</div>;
};

const StepElement: React.FC<{ step: Step; index: number; resetCurrentStepIndex: () => void }> = ({ step, index, resetCurrentStepIndex }) => {
  const { useCustomColor, pattern, setPattern } = useGlobal();

  const [localTime, setLocalTime] = useState(`${step.time}`);

  const updateTime = (val: string) => {
    const time = parseInt(val) || 1;
    setLocalTime(val);
    const newSteps = pattern.steps.map((s, i) => i === index ? { ...s, time } : s);
    setPattern({ steps: newSteps });
  };
  
  // Armazenar a cor como rgba localmente para poder atualizar alpha e rgb separadamente
  const [localCoronaColor, setLocalCoronaColor] = useState(() => {

    console.log("hex", step.customColor);
    console.log("rgba", hexToRgba(step.customColor));

    return hexToRgba(step.customColor, true);
  });
  const [localLedColor, setLocalLedColor] = useState(() => hexToRgba(step.customLedColor));

  const updateCoronaColor = (newRgb: { r: number; g: number; b: number; a?: number }) => {

    const newLocalColor = {r: newRgb.r, g: newRgb.g, b: newRgb.b, a: newRgb.a!};

    setLocalCoronaColor(newLocalColor);

    const hex = rgbaToHex(newRgb);
    const newSteps = pattern.steps.map((s, i) => {
      if (i !== index) return s;
      return { ...s, ['customColor']: hex };
    });
    setPattern({ steps: newSteps });
  };

  const updateLedColor = (newRgb: { r: number; g: number; b: number; a?: number}) => {

    const newLocalColor = {r: newRgb.r, g: newRgb.g, b: newRgb.b, a: newRgb.a!};

    setLocalLedColor(newLocalColor);

    const hex = rgbaToHex(newRgb);
    const newSteps = pattern.steps.map((s, i) => {
      if (i !== index) return s;
      return { ...s, ['customLedColor']: hex };
    });
    setPattern({ steps: newSteps });
  };

  // Handler do input color html padrão
  const onInputCoronaColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const rgba = hexToRgba(hex);
    updateCoronaColor({ ...rgba, a: localCoronaColor.a });
  };

  return (
    <div className='p-2 border rounded mt-2'>
      <button className='btn btn-sm btn-outline-danger' onClick={() => {
        const newSteps = pattern.steps.filter((_, i) => i !== index);
        setPattern({ steps: newSteps });
        resetCurrentStepIndex();
      }}>X</button>

      <span style={{ marginLeft: "10px" }}>Índice: {index}</span>
      
      <div className='my-2'>
        <label className='me-2'>Tempo</label>
        <input type='number' value={localTime} onChange={e => updateTime(e.target.value)} />
      </div>

      <div className='d-flex'>{step.values.map((v, i) => <StepToggleButton key={i} stepIndex={index} ledIndex={i} value={v} />)}</div>


      {useCustomColor && (
        <div>
          <div className="my-2 d-flex align-items-center gap-2">
            <label style={{ whiteSpace: 'nowrap' }}>Cor (Corona):</label>

            {/* Color Picker */}
            <input
              type="color"
              value={rgbaToHex(localCoronaColor).slice(0, 7)} // só #RRGGBB
              onChange={onInputCoronaColorChange}
              style={{ width: '40px', height: '30px', padding: 0, border: 'none' }}
            />

            {/* Inputs de RGBA */}
            <input
              type="number"
              min={0}
              max={255}
              value={localCoronaColor.r}
              onChange={(e) => updateCoronaColor({ ...localCoronaColor, r: +e.target.value },)}
              style={{ width: '50px' }}
              placeholder="R"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={localCoronaColor.g}
              onChange={(e) => updateCoronaColor({ ...localCoronaColor, g: +e.target.value })}
              style={{ width: '50px' }}
              placeholder="G"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={localCoronaColor.b}
              onChange={(e) => updateCoronaColor({ ...localCoronaColor, b: +e.target.value })}
              style={{ width: '50px' }}
              placeholder="B"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={localCoronaColor.a}
              onChange={(e) => updateCoronaColor({ ...localCoronaColor, a: +e.target.value })}
              style={{ width: '50px' }}
              placeholder="A"
            />
          </div>

          <div className="my-2 d-flex align-items-center gap-2">
            <label>Cor (LED)</label>
            {/* Se quiser fazer igual, pode repetir o esquema aqui */}
            <input
              type="color"
              value={step.customLedColor.slice(0, 7)}
              onChange={e => {
                const c = hexToRgba(e.target.value);
                updateLedColor({ ...c, a: 1 });
              }}
            />
             {/* Inputs de RGBA */}
            <input
              type="number"
              min={0}
              max={255}
              value={localLedColor.r}
              onChange={(e) => updateLedColor({ ...localLedColor, r: +e.target.value },)}
              style={{ width: '50px' }}
              placeholder="R"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={localLedColor.g}
              onChange={(e) => updateLedColor({ ...localLedColor, g: +e.target.value })}
              style={{ width: '50px' }}
              placeholder="G"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={localLedColor.b}
              onChange={(e) => updateLedColor({ ...localLedColor, b: +e.target.value })}
              style={{ width: '50px' }}
              placeholder="B"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const PatternsPage: React.FC = () => {
  const { pattern, setPattern, useCustomColor, setUseCustomColor } = useGlobal();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const resetCurrentStepIndex = () => setCurrentStepIndex(0);
  const [indexStr, setIndexStr] = useState('');

  const current = pattern.steps[currentStepIndex];

  const [numOfLeds, setNumOfLeds] = useState(current.values.length);

  React.useEffect(() => {

    for(const step of pattern.steps)
    {
        while(step.values.length < numOfLeds)
        {
            step.values.push(0);
        }
        while(step.values.length > numOfLeds)
        {
            step.values.pop();
        }
    }

    setPattern(pattern);

  }, [numOfLeds]);

  if (pattern.steps.length === 0) {
    return <div>Não há passos no padrão.</div>;
    }

  useEffect(() => {
    if (pattern.steps.length === 0) return;  // proteção

    const interval = setInterval(() => {
        setCurrentStepIndex(prev => (prev + 1) % pattern.steps.length);
    }, pattern.steps[currentStepIndex]?.time || 300); // fallback de 300ms

    return () => clearInterval(interval);
    }, [pattern, currentStepIndex]);

  

  const toggleColorMode = () => {
    setUseCustomColor(!useCustomColor);
  };

  const addStepAtIndex = (index: number) => {
    // Cria novo step baseado no último step atual (ou default)

    let lastStep: Step | undefined = pattern.steps[pattern.steps.length - 1];

    const values: number[] = [];
    for (let i = 0; i < lastStep.values.length; i++) {
      values.push(0);
    }

    const newStep = createStep(
        300,
        values
    )

    // Cria nova lista de steps com o novo inserido na posição desejada
    const newSteps = [
        ...pattern.steps.slice(0, index),
        newStep,
        ...pattern.steps.slice(index),
    ];

    setPattern({ steps: newSteps });
    };

     const handleClick = () => {
        const index = parseInt(indexStr);
        if (!isNaN(index) && index >= 0) {
            addStepAtIndex(index);
            setIndexStr(''); // limpa input após adicionar
        } else {
            alert('Digite um índice válido (número >= 0)');
        }
    };

    const [dataStr, setDataStr] = useState("No data");
    const [isModalGenerateVisible, setModalGenerateVisible] = useState(false);
    const [isModalLoadVisible, setModalLoadVisible] = useState(false);

    function loadJSON(text: string) {
        if (text.trim().length === 0) {
            alert("Textarea is empty!");
            return;
        }

        try {
            const json = JSON.parse(text);

            if (!json.steps || !Array.isArray(json.steps)) {
                alert("JSON inválido: precisa ter um array steps");
                return;
            }

            let detectedUseCustomColor = false;

            // Mapear os steps do JSON para os seus Steps internos
            const newSteps: Step[] = json.steps.map((stepValue: any, index: number) => {
                if (stepValue.useCustomColor === true || stepValue.useCustomLedColor === true) {
                    detectedUseCustomColor = true;
                }

                // Garante que time está em 'time' ou 'duration' (ajuste conforme seu JSON)
                const time = stepValue.time ?? stepValue.duration ?? 300;

                // Garante que valores/leds estão em 'values' ou 'data' (ajuste conforme seu JSON)
                const values = Array.isArray(stepValue.values)
                    ? stepValue.values
                    : Array.isArray(stepValue.data)
                    ? stepValue.data
                    : [0, 0, 0];

                // Converte cores caso venha em objeto rgba {r,g,b,a}
                const convertColor = (c: any) => {
                    if (typeof c === "string") return c; // já é hex
                    if (c && typeof c === "object" && "r" in c) return rgbaToHex(c);
                    return "#0000ff";
                };

                console.log(stepValue.customColor);

                var step = createStep(time, values);
                step.useCustomColor = detectedUseCustomColor;
                step.customColor = stepValue.customColor ? convertColor(stepValue.customColor) : "#0000ff";

                console.log(step.customColor);

                step.useCustomLedColor = detectedUseCustomColor;
                step.customLedColor = stepValue.customLedColor ? convertColor(stepValue.customLedColor) : "#ffffff";

                return step;
            });

            setUseCustomColor(detectedUseCustomColor);
            setPattern({ steps: newSteps });

            setNumOfLeds(newSteps[0]?.values.length ?? 4);

        } catch (err) {
            alert("Error loading JSON");
            console.error(err);
        }
    }

    const handleLoadData = () => {
        resetCurrentStepIndex();
        loadJSON(dataStr);
        setModalLoadVisible(false);
    };

    const handleOpenModalGenerate = () => {
        var data = generateMobileJSON(pattern, useCustomColor);

        setDataStr(data);
        setModalGenerateVisible(true);
        

    }

  return (
    <div className='container'>
      <h3>Preview</h3>
      <div className='d-flex gap-2 justify-content-center'>
        {current.values.map((v, i) => <Led key={i} on={v === 1} step={current} useCustomColor={useCustomColor} />)}
      </div>

        <div className="d-flex justify-content-start align-items-center gap-3">
            <span className=''>Número de luzes:</span>
            <NumberPicker
                startValue={numOfLeds}
                min={1}
                max={12}
                onChange={(value) => setNumOfLeds(value)}
            />
        </div>

      <button onClick={toggleColorMode} className='btn btn-secondary my-3'>
        {useCustomColor ? "Desativar cor customizada" : "Ativar cor customizada"}
      </button>

      <div className="d-flex align-items-center gap-2 my-3">
            <input
                type="number"
                min={0}
                placeholder="Índice"
                value={indexStr}
                onChange={e => setIndexStr(e.target.value)}
                style={{ width: '80px' }}
                className="form-control form-control-sm"
            />
            <button onClick={handleClick} className="btn btn-secondary btn-sm">
                Adicionar step
            </button>
        </div>
        <div className="d-flex align-items-center gap-2 my-3">
            <input
                type="tezt"
                value={"final"}
                style={{ width: '80px' }}
                className="form-control form-control-sm"
            />
            <button onClick={() => addStepAtIndex(pattern.steps.length)} className="btn btn-secondary btn-sm">
                Adicionar step no final
            </button>
        </div>

      {pattern.steps.map((s, i) => <StepElement key={s.id} step={s} index={i} resetCurrentStepIndex={resetCurrentStepIndex} />)}

        <div>
            <button onClick={() => handleOpenModalGenerate()} className='btn btn-primary m-3'>Gerar json</button>
            <button onClick={() => setModalLoadVisible(true)} className='btn btn-primary m-3'>Carregar json</button>
        </div>

        <BasicModal visible={isModalGenerateVisible} onClose={() => {
            setModalGenerateVisible(false);
        }}>
            <div>
                <textarea 
                    style={{width: "100%"}}
                    rows={10}
                    value={dataStr}
                    onChange={() => {}}
                ></textarea>
            </div>
        </BasicModal>

        <BasicModal visible={isModalLoadVisible} onClose={() => {
            setModalLoadVisible(false);
        }}>
            <div>
                <textarea 
                    style={{width: "100%"}}
                    rows={10}
                    value={dataStr}
                    onChange={(e) => { setDataStr(e.target.value) }}
                ></textarea>

                <button onClick={handleLoadData}>Carregar</button>
            </div>
        </BasicModal>
    </div>
  );
};

const Patterns: React.FC = () => {
  return (
    <GlobalProvider>
      <PatternsPage />
    </GlobalProvider>
  );
};

// Utilitários
function hexColorToRGBA(hex: string) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  if (hex.length === 6) {
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
      a: 255 // alpha inteiro 255 (opaco)
    };
  } else if (hex.length === 8) {
    return {
      r: (bigint >> 24) & 255,
      g: (bigint >> 16) & 255,
      b: (bigint >> 8) & 255,
      a: bigint & 255 // alpha inteiro 0-255
    };
  }
  return { r: 0, g: 0, b: 0, a: 255 };
}

function rgbaToHex({ r, g, b, a = 255 }: { r: number; g: number; b: number; a?: number }): string {
  const toHex = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  // se alfa for >1, assumir que é 0-255, se <=1, assumir float 0-1
  const alpha = a > 1 ? a : a * 255;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`;
}

function hexToRgba(hex: string, alpha255: boolean = false) {
  hex = hex.replace('#', '');

  if (hex.length !== 6 && hex.length !== 8) {
    return { r: 0, g: 0, b: 0, a: alpha255 ? 255 : 1 };
  }

  const hasAlpha = hex.length === 8;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const aHex = hasAlpha ? parseInt(hex.substring(6, 8), 16) : (alpha255 ? 255 : 1);
  const a = alpha255 ? aHex : aHex / 255;

  return { r, g, b, a };
}

function generateMobileJSON(pattern: Pattern, useCustomColor: boolean)
{
    var json: any = {steps: []}
    
    for(const step of pattern.steps)
    {
        json.steps.push({
            data: step.values,
            duration: step.time,
            useCustomColor: useCustomColor,
            customColor: hexColorToRGBA(step.customColor),
            useCustomLedColor: useCustomColor,
            customLedColor: hexColorToRGBA(step.customLedColor)
        });
    }
    
    var str = ``;
    str = JSON.stringify(json);
    
    return str;
}

export default Patterns;
